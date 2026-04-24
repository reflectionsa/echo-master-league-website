/**
 * EML Discord OAuth2 Cloudflare Worker
 *
 * Endpoints:
 *   POST /auth/callback          — exchange Discord OAuth code for user info + roles
 *   POST /signups/add            — caster signs up to cast a match
 *   POST /signups/remove         — caster withdraws signup
 *   GET  /signups/:matchId       — fetch signups for a match
 *   POST /production/ticket      — create Discord support ticket
 *   POST /production/caster-stats
 *   POST /production/camera-stats
 *   POST /player/register        — register player profile (region, etc.)
 *   GET  /player/:discordId      — fetch player profile
 *   POST /team/create            — create a team
 *   GET  /team/:teamId           — fetch team data
 *   POST /team/invite            — invite player to team
 *   POST /team/invite/respond    — accept or decline invite
 *   POST /team/kick              — kick player from team
 *   POST /team/leave             — player leaves team
 *   POST /team/transfer          — transfer captain role
 *   POST /team/disband           — disband team
 *   POST /match/report           — captain reports round scores (Bo3)
 *   POST /match/dispute          — flag match as disputed
 *   POST /match/resolve          — admin resolves dispute
 *   POST /challenge/send         — send team challenge
 *   POST /challenge/respond      — accept/decline challenge
 *   GET  /challenges/:teamId     — active challenges for a team
 *   GET  /notifications/:userId  — fetch notifications
 *   POST /notifications/read     — mark notification(s) read
 *   GET  /announcements          — fetch Discord channel announcements
 *   POST /admin/team             — admin force-update team tier/ELO
 *   POST /admin/player           — admin ban/unban player
 *   POST /admin/match            — admin force-report/forfeit match
 *   GET  /audit-log              — admin audit log
 *   POST /caster/claim           — caster claims a match to cast
 *   POST /caster/unclaim         — caster releases a match
 *   GET  /caster/matches         — all claimable/claimed matches
 *   GET  /history/player/:id     — player team history
 *   GET  /history/roster/:teamId — roster change log
 *
 * KV namespaces: EML_SIGNUPS (reused for all KV data)
 */

const DISCORD_API = 'https://discord.com/api/v10';

// ─── Role Mapping ─────────────────────────────────────────────────────────────

const ROLE_PRIORITY = ['viewer', 'player', 'caster', 'mod', 'admin'];

const STATIC_ROLE_NAME_MAP = {
  'Commissioner': 'admin',
  'Board': 'admin',
  'League Mod': 'mod',
  'League Mod EU': 'mod',
  'Casters': 'caster',
  'Player NA': 'player',  // matches DISCORD_ROLE_MAP exactly
  'PlayerNA': 'player',  // fallback (no space variant)
  'Player EU': 'player',  // matches DISCORD_ROLE_MAP exactly
  'PlayerEU': 'player',  // fallback (no space variant)
  'CaptainNA': 'player',
  'Co-Captain': 'player',  // matches DISCORD_ROLE_MAP exactly
  'CoCaptainNA': 'player',  // fallback variant
};

function mapRoleNamesToAppRole(roleNames) {
  const appRoles = roleNames
    .map(name => STATIC_ROLE_NAME_MAP[name])
    .filter(Boolean);

  if (!appRoles.length) return 'viewer';

  return appRoles.reduce((best, current) =>
    ROLE_PRIORITY.indexOf(current) > ROLE_PRIORITY.indexOf(best) ? current : best,
    appRoles[0]
  );
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
}

function buildCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = getAllowedOrigins(env);
  const reflected = allowed.includes(origin) ? origin : (allowed[0] || '*');

  return {
    'Access-Control-Allow-Origin': reflected,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// ─── Role ID Resolution ───────────────────────────────────────────────────────

/**
 * Resolve an array of Discord role IDs to role names.
 *
 * Strategy (in order):
 *   1. DISCORD_ROLE_MAP env var (JSON string: {"roleId": "roleName"}) — fastest, no bot needed
 *   2. Bot token + KV-cached guild roles list — self-updating but requires bot
 */
async function resolveRoleNames(roleIds, env) {
  if (!roleIds.length) return [];

  // Strategy 1: static JSON map in wrangler.toml [vars]
  if (env.DISCORD_ROLE_MAP) {
    try {
      const idToName = JSON.parse(env.DISCORD_ROLE_MAP);
      return roleIds.map(id => idToName[id]).filter(Boolean);
    } catch (e) {
      console.error('Failed to parse DISCORD_ROLE_MAP:', e.message);
    }
  }

  // Strategy 2: bot token + KV cache
  if (env.DISCORD_BOT_TOKEN && env.EML_SIGNUPS) {
    const cacheKey = `guild_roles_cache_${env.DISCORD_GUILD_ID}`;
    let guildRoles;

    const cached = await env.EML_SIGNUPS.get(cacheKey);
    if (cached) {
      guildRoles = JSON.parse(cached);
    } else {
      const res = await fetch(`${DISCORD_API}/guilds/${env.DISCORD_GUILD_ID}/roles`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });
      if (res.ok) {
        guildRoles = await res.json();
        await env.EML_SIGNUPS.put(cacheKey, JSON.stringify(guildRoles), { expirationTtl: 3600 });
      }
    }

    if (guildRoles) {
      const idToName = Object.fromEntries(guildRoles.map(r => [r.id, r.name]));
      return roleIds.map(id => idToName[id]).filter(Boolean);
    }
  }

  return [];
}

// ─── Route: POST /auth/callback ───────────────────────────────────────────────

async function handleAuthCallback(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
  }

  const { code, redirect_uri } = body;
  if (!code || !redirect_uri) {
    return jsonResponse({ error: 'Missing code or redirect_uri' }, 400, cors);
  }

  // 1. Exchange authorization code for access token
  const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID || '1477115120759996667',
      client_secret: env.DISCORD_CLIENT_SECRET, // Workers Secret — never leaves the Worker
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error('Discord token exchange failed:', err);
    return jsonResponse({ error: 'Token exchange failed. Verify your redirect_uri matches exactly.' }, 401, cors);
  }

  const { access_token } = await tokenRes.json();

  // 2. Fetch Discord user info
  const userRes = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    return jsonResponse({ error: 'Failed to fetch Discord user info' }, 401, cors);
  }
  const discordUser = await userRes.json();

  // 3. Fetch guild member info to get role IDs
  let guildRoleIds = [];
  let guildRoleNames = [];

  const memberRes = await fetch(`${DISCORD_API}/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (memberRes.ok) {
    const member = await memberRes.json();
    guildRoleIds = member.roles || [];
    guildRoleNames = await resolveRoleNames(guildRoleIds, env);
  } else if (memberRes.status === 404) {
    // User is not in the EML guild — they log in as 'viewer'
    guildRoleNames = [];
  } else {
    console.error('Guild member fetch failed:', memberRes.status, await memberRes.text());
    guildRoleNames = [];
  }

  const appRole = mapRoleNamesToAppRole(guildRoleNames);

  // 4. Build avatar URL
  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number(discordUser.discriminator || '0') % 5}.png`;

  // 5. Return sanitized user object — access_token is NEVER sent to the frontend
  return jsonResponse({
    id: discordUser.id,
    username: discordUser.username,
    globalName: discordUser.global_name || discordUser.username,
    avatar: avatarUrl,
    guildRoles: guildRoleNames,
    appRole,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }, 200, cors);
}

// ─── Route: POST /signups/add ─────────────────────────────────────────────────

async function handleSignupAdd(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { matchId, userId, username, role } = body;
  if (!matchId || !userId || !username) {
    return jsonResponse({ error: 'Missing required fields: matchId, userId, username' }, 400, cors);
  }

  const key = `signups:${matchId}`;
  const existing = await env.EML_SIGNUPS.get(key);
  const signups = existing ? JSON.parse(existing) : [];

  // Idempotent — don't add duplicates
  if (!signups.find(s => s.userId === userId)) {
    signups.push({ userId, username, role: role || 'caster', signedUpAt: new Date().toISOString() });
    await env.EML_SIGNUPS.put(key, JSON.stringify(signups));
  }

  return jsonResponse({ success: true, signups }, 200, cors);
}

// ─── Route: POST /signups/remove ──────────────────────────────────────────────

async function handleSignupRemove(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { matchId, userId } = body;
  if (!matchId || !userId) {
    return jsonResponse({ error: 'Missing required fields: matchId, userId' }, 400, cors);
  }

  const key = `signups:${matchId}`;
  const existing = await env.EML_SIGNUPS.get(key);
  const signups = existing ? JSON.parse(existing) : [];
  const updated = signups.filter(s => s.userId !== userId);
  await env.EML_SIGNUPS.put(key, JSON.stringify(updated));

  return jsonResponse({ success: true, signups: updated }, 200, cors);
}

// ─── Route: GET /signups/:matchId ─────────────────────────────────────────────

async function handleSignupGet(matchId, env, cors) {
  const data = await env.EML_SIGNUPS.get(`signups:${matchId}`);
  const signups = data ? JSON.parse(data) : [];
  return jsonResponse({ signups }, 200, cors);
}

// ─── Route: POST /production/ticket ───────────────────────────────────────────

const TICKET_TYPE_MAP = {
  'production': {
    emoji: '🎥',
    name: 'Production / Cast Request',
    description: 'Production scheduling and casting assignments',
  },
  'tech-support': {
    emoji: '⚙️',
    name: 'Tech Support',
    description: 'Technical issues and support requests',
  },
  'match-support': {
    emoji: '🏆',
    name: 'Match Support',
    description: 'Match-related issues and coordination',
  },
  'league-support': {
    emoji: '📋',
    name: 'League Support',
    description: 'League rules, policies, and administrative help',
  },
  'server-request': {
    emoji: '🖥️',
    name: 'Server Request',
    description: 'Competitive server requests and configuration',
  },
};

async function handleCreateTicket(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { matchId, title, ticketType = 'production' } = body;
  if (!matchId) {
    return jsonResponse({ error: 'Missing required field: matchId' }, 400, cors);
  }

  if (!env.DISCORD_BOT_TOKEN) {
    return jsonResponse({ error: 'DISCORD_BOT_TOKEN not configured' }, 500, cors);
  }

  // Get channel ID based on ticket type from env vars
  const channelKey = `TICKET_CHANNEL_${ticketType.toUpperCase()}`;
  const CHANNEL_ID = env[channelKey];

  if (!CHANNEL_ID) {
    return jsonResponse({ error: `Channel ID not configured for ticket type: ${ticketType}` }, 500, cors);
  }

  const ticketInfo = TICKET_TYPE_MAP[ticketType] || TICKET_TYPE_MAP['production'];
  const ticketTitle = title || `${ticketInfo.emoji} ${ticketInfo.name} - ${matchId}`;
  const ticketMessage = `${ticketInfo.emoji} **${ticketTitle}**\n\nMatch ID: \`${matchId}\`\n${ticketInfo.description}`;

  try {
    const res = await fetch(`${DISCORD_API}/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: ticketMessage,
        allowed_mentions: { parse: [] },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Discord message creation failed:', err);
      return jsonResponse({ error: 'Failed to create Discord ticket' }, 500, cors);
    }

    const message = await res.json();
    return jsonResponse({ success: true, messageId: message.id }, 200, cors);
  } catch (err) {
    console.error('Error creating ticket:', err);
    return jsonResponse({ error: 'Internal server error' }, 500, cors);
  }
}

// ─── Route: POST /production/caster-stats ─────────────────────────────────────

async function handleUpdateCasterStats(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { name, events, matches } = body;
  if (!name) {
    return jsonResponse({ error: 'Missing required field: name' }, 400, cors);
  }

  // Store in KV with key pattern: caster_stats:{name}
  const key = `caster_stats:${name.toLowerCase()}`;
  const stats = {
    id: `caster_${Math.random().toString(36).substr(2, 9)}`,
    name,
    events: parseInt(events) || 0,
    matches: parseInt(matches) || 0,
    lastUpdated: new Date().toISOString(),
  };

  try {
    await env.EML_SIGNUPS.put(key, JSON.stringify(stats));
    return jsonResponse({ success: true, stats }, 200, cors);
  } catch (err) {
    console.error('Error updating caster stats:', err);
    return jsonResponse({ error: 'Failed to update stats' }, 500, cors);
  }
}

// ─── Route: POST /production/camera-stats ────────────────────────────────────

async function handleUpdateCameraStats(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { name, events, matches } = body;
  if (!name) {
    return jsonResponse({ error: 'Missing required field: name' }, 400, cors);
  }

  // Store in KV with key pattern: camera_stats:{name}
  const key = `camera_stats:${name.toLowerCase()}`;
  const stats = {
    id: `camera_${Math.random().toString(36).substr(2, 9)}`,
    name,
    events: parseInt(events) || 0,
    matches: parseInt(matches) || 0,
    lastUpdated: new Date().toISOString(),
  };

  try {
    await env.EML_SIGNUPS.put(key, JSON.stringify(stats));
    return jsonResponse({ success: true, stats }, 200, cors);
  } catch (err) {
    console.error('Error updating camera stats:', err);
    return jsonResponse({ error: 'Failed to update stats' }, 500, cors);
  }
}

// ─── Main Fetch Handler ───────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

function kv(env) { return env.EML_SIGNUPS; }
async function kvGet(env, key) {
  const v = await kv(env).get(key);
  return v ? JSON.parse(v) : null;
}
async function kvPut(env, key, val) {
  await kv(env).put(key, JSON.stringify(val));
}

async function pushNotification(env, userId, notification) {
  const key = `notifs:${userId}`;
  const existing = await kvGet(env, key) || [];
  existing.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false, ...notification });
  // Keep max 50
  await kvPut(env, key, existing.slice(0, 50));
}

async function appendAuditLog(env, entry) {
  const key = 'audit_log';
  const log = await kvGet(env, key) || [];
  log.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry });
  await kvPut(env, key, log.slice(0, 500));
}

// ─── Player Routes ────────────────────────────────────────────────────────────

async function handlePlayerRegister(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { discordId, username, globalName, avatar, region } = body;
  if (!discordId || !username || !region) return jsonResponse({ error: 'Missing required fields' }, 400, cors);

  const key = `player:${discordId}`;
  const existing = await kvGet(env, key) || {};
  const player = {
    ...existing,
    discordId,
    username,
    globalName: globalName || username,
    avatar: avatar || '',
    region,
    registeredAt: existing.registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teamId: existing.teamId || null,
    banned: existing.banned || false,
    banReason: existing.banReason || null,
  };
  await kvPut(env, key, player);
  return jsonResponse({ success: true, player }, 200, cors);
}

async function handlePlayerGet(discordId, env, cors) {
  const player = await kvGet(env, `player:${discordId}`);
  if (!player) return jsonResponse({ error: 'Player not found' }, 404, cors);
  return jsonResponse({ player }, 200, cors);
}

// ─── Team Routes ──────────────────────────────────────────────────────────────

async function handleTeamCreate(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { captainDiscordId, captainUsername, name, tag, logoUrl, bannerUrl, region } = body;
  if (!captainDiscordId || !name || !tag || !region) return jsonResponse({ error: 'Missing required fields' }, 400, cors);

  // Check player not already on a team
  const player = await kvGet(env, `player:${captainDiscordId}`);
  if (player?.teamId) return jsonResponse({ error: 'You are already on a team' }, 409, cors);

  const teamId = crypto.randomUUID();
  const team = {
    id: teamId,
    name: name.trim(),
    tag: tag.trim().toUpperCase().slice(0, 4),
    logoUrl: logoUrl || '',
    bannerUrl: bannerUrl || '',
    region: region || 'NA',
    tier: 'Gold',
    elo: 800,
    captainDiscordId,
    captainUsername,
    coCaptainDiscordId: null,
    players: [{ discordId: captainDiscordId, username: captainUsername, role: 'captain', joinedAt: new Date().toISOString() }],
    disbanded: false,
    disbandedAt: null,
    createdAt: new Date().toISOString(),
    wins: 0,
    losses: 0,
    streak: 0,
  };
  await kvPut(env, `team:${teamId}`, team);
  // Add team to index
  const index = await kvGet(env, 'teams:index') || [];
  index.push(teamId);
  await kvPut(env, 'teams:index', index);
  // Update player record
  if (player) { player.teamId = teamId; await kvPut(env, `player:${captainDiscordId}`, player); }
  await appendAuditLog(env, { action: 'team_create', actorId: captainDiscordId, teamId, teamName: name });
  return jsonResponse({ success: true, team }, 200, cors);
}

async function handleTeamGet(teamId, env, cors) {
  const team = await kvGet(env, `team:${teamId}`);
  if (!team) return jsonResponse({ error: 'Team not found' }, 404, cors);
  return jsonResponse({ team }, 200, cors);
}

async function handleTeamInvite(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamId, captainDiscordId, targetDiscordId, targetUsername } = body;
  if (!teamId || !captainDiscordId || !targetDiscordId) return jsonResponse({ error: 'Missing fields' }, 400, cors);

  const team = await kvGet(env, `team:${teamId}`);
  if (!team) return jsonResponse({ error: 'Team not found' }, 404, cors);
  if (team.captainDiscordId !== captainDiscordId && team.coCaptainDiscordId !== captainDiscordId)
    return jsonResponse({ error: 'Not authorized' }, 403, cors);

  const inviteId = crypto.randomUUID();
  const invite = { id: inviteId, teamId, teamName: team.name, teamTag: team.tag, captainDiscordId, targetDiscordId, targetUsername, status: 'pending', createdAt: new Date().toISOString() };
  await kvPut(env, `invite:${inviteId}`, invite);
  await pushNotification(env, targetDiscordId, { type: 'team_invite', title: 'Team Invite', body: `You've been invited to join ${team.name} [${team.tag}]`, inviteId, teamId });
  return jsonResponse({ success: true, inviteId }, 200, cors);
}

async function handleInviteRespond(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { inviteId, discordId, accept } = body;
  const invite = await kvGet(env, `invite:${inviteId}`);
  if (!invite || invite.targetDiscordId !== discordId) return jsonResponse({ error: 'Invite not found' }, 404, cors);
  if (invite.status !== 'pending') return jsonResponse({ error: 'Invite already handled' }, 409, cors);

  invite.status = accept ? 'accepted' : 'declined';
  await kvPut(env, `invite:${inviteId}`, invite);

  if (accept) {
    const team = await kvGet(env, `team:${invite.teamId}`);
    if (!team) return jsonResponse({ error: 'Team dissolved' }, 404, cors);
    const player = await kvGet(env, `player:${discordId}`);
    if (player?.teamId) return jsonResponse({ error: 'Already on a team' }, 409, cors);
    team.players.push({ discordId, username: invite.targetUsername, role: 'player', joinedAt: new Date().toISOString() });
    await kvPut(env, `team:${invite.teamId}`, team);
    if (player) { player.teamId = invite.teamId; await kvPut(env, `player:${discordId}`, player); }
    await appendRosterLog(env, invite.teamId, { action: 'join', discordId, username: invite.targetUsername });
    await pushNotification(env, invite.captainDiscordId, { type: 'invite_accepted', title: 'Invite Accepted', body: `${invite.targetUsername} joined ${team.name}` });
  }
  return jsonResponse({ success: true }, 200, cors);
}

async function handleTeamKick(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamId, captainDiscordId, targetDiscordId } = body;
  const team = await kvGet(env, `team:${teamId}`);
  if (!team) return jsonResponse({ error: 'Team not found' }, 404, cors);
  if (team.captainDiscordId !== captainDiscordId && team.coCaptainDiscordId !== captainDiscordId)
    return jsonResponse({ error: 'Not authorized' }, 403, cors);
  if (targetDiscordId === captainDiscordId) return jsonResponse({ error: 'Cannot kick yourself' }, 400, cors);

  const kicked = team.players.find(p => p.discordId === targetDiscordId);
  team.players = team.players.filter(p => p.discordId !== targetDiscordId);
  if (team.coCaptainDiscordId === targetDiscordId) team.coCaptainDiscordId = null;
  await kvPut(env, `team:${teamId}`, team);
  const player = await kvGet(env, `player:${targetDiscordId}`);
  if (player) { player.teamId = null; await kvPut(env, `player:${targetDiscordId}`, player); }
  await appendRosterLog(env, teamId, { action: 'kick', discordId: targetDiscordId, username: kicked?.username, by: captainDiscordId });
  await pushNotification(env, targetDiscordId, { type: 'kicked', title: 'Kicked from Team', body: `You were removed from ${team.name}` });
  await appendAuditLog(env, { action: 'team_kick', actorId: captainDiscordId, teamId, target: targetDiscordId });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleTeamLeave(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamId, discordId } = body;
  const team = await kvGet(env, `team:${teamId}`);
  if (!team) return jsonResponse({ error: 'Team not found' }, 404, cors);
  if (team.captainDiscordId === discordId) return jsonResponse({ error: 'Captain must transfer or disband before leaving' }, 400, cors);

  const leaving = team.players.find(p => p.discordId === discordId);
  team.players = team.players.filter(p => p.discordId !== discordId);
  if (team.coCaptainDiscordId === discordId) team.coCaptainDiscordId = null;
  await kvPut(env, `team:${teamId}`, team);
  const player = await kvGet(env, `player:${discordId}`);
  if (player) { player.teamId = null; await kvPut(env, `player:${discordId}`, player); }
  await appendRosterLog(env, teamId, { action: 'leave', discordId, username: leaving?.username });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleTeamTransfer(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamId, captainDiscordId, newCaptainDiscordId } = body;
  const team = await kvGet(env, `team:${teamId}`);
  if (!team || team.captainDiscordId !== captainDiscordId) return jsonResponse({ error: 'Not authorized' }, 403, cors);
  const newCap = team.players.find(p => p.discordId === newCaptainDiscordId);
  if (!newCap) return jsonResponse({ error: 'Target not on team' }, 404, cors);

  team.players = team.players.map(p => ({ ...p, role: p.discordId === newCaptainDiscordId ? 'captain' : p.discordId === captainDiscordId ? 'player' : p.role }));
  team.captainDiscordId = newCaptainDiscordId;
  team.captainUsername = newCap.username;
  await kvPut(env, `team:${teamId}`, team);
  await appendAuditLog(env, { action: 'captain_transfer', actorId: captainDiscordId, teamId, newCaptain: newCaptainDiscordId });
  await pushNotification(env, newCaptainDiscordId, { type: 'captain_transfer', title: 'Captain Transfer', body: `You are now the captain of ${team.name}` });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleTeamDisband(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamId, captainDiscordId } = body;
  const team = await kvGet(env, `team:${teamId}`);
  if (!team || team.captainDiscordId !== captainDiscordId) return jsonResponse({ error: 'Not authorized' }, 403, cors);

  team.disbanded = true;
  team.disbandedAt = new Date().toISOString();
  await kvPut(env, `team:${teamId}`, team);
  for (const p of team.players) {
    const pr = await kvGet(env, `player:${p.discordId}`);
    if (pr) { pr.teamId = null; await kvPut(env, `player:${p.discordId}`, pr); }
    if (p.discordId !== captainDiscordId)
      await pushNotification(env, p.discordId, { type: 'team_disbanded', title: 'Team Disbanded', body: `${team.name} has been disbanded by the captain` });
  }
  await appendAuditLog(env, { action: 'team_disband', actorId: captainDiscordId, teamId, teamName: team.name });
  return jsonResponse({ success: true }, 200, cors);
}

// ─── Roster Log Helper ────────────────────────────────────────────────────────

async function appendRosterLog(env, teamId, entry) {
  const key = `rosterlog:${teamId}`;
  const log = await kvGet(env, key) || [];
  log.unshift({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), ...entry });
  await kvPut(env, key, log.slice(0, 200));
}

// ─── Match Report Routes ──────────────────────────────────────────────────────

async function handleMatchReport(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { matchId, reporterDiscordId, reporterTeam, rounds, forfeit, forfeitTeam } = body;
  if (!matchId || !reporterDiscordId) return jsonResponse({ error: 'Missing fields' }, 400, cors);

  const key = `matchreport:${matchId}`;
  const existing = await kvGet(env, key) || { matchId, reports: [], status: 'pending', resolvedAt: null };

  // Check duplicate reporter
  if (existing.reports.find(r => r.reporterDiscordId === reporterDiscordId))
    return jsonResponse({ error: 'Already reported' }, 409, cors);

  existing.reports.push({ reporterDiscordId, reporterTeam, rounds: rounds || [], forfeit: !!forfeit, forfeitTeam: forfeitTeam || null, submittedAt: new Date().toISOString() });

  // Auto-resolve when both captains reported
  if (existing.reports.length >= 2) {
    const [r1, r2] = existing.reports;
    // Compare score totals
    const score1 = (r1.rounds || []).reduce((a, r) => a + (r.team1 || 0), 0);
    const score2 = (r1.rounds || []).reduce((a, r) => a + (r.team2 || 0), 0);
    const score1b = (r2.rounds || []).reduce((a, r) => a + (r.team1 || 0), 0);
    const score2b = (r2.rounds || []).reduce((a, r) => a + (r.team2 || 0), 0);
    const agree = score1 === score1b && score2 === score2b;
    existing.status = agree ? 'confirmed' : 'disputed';
    existing.resolvedAt = agree ? new Date().toISOString() : null;
    if (!agree) {
      await pushNotification(env, 'ADMIN', { type: 'dispute', title: 'Match Disputed', body: `Match ${matchId} has conflicting score reports`, matchId });
    }
  }
  await kvPut(env, key, existing);
  return jsonResponse({ success: true, report: existing }, 200, cors);
}

async function handleMatchDispute(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { matchId, reporterDiscordId, reason } = body;
  const key = `matchreport:${matchId}`;
  const existing = await kvGet(env, key) || { matchId, reports: [], status: 'disputed' };
  existing.status = 'disputed';
  existing.disputeReason = reason || '';
  existing.disputedBy = reporterDiscordId;
  existing.disputedAt = new Date().toISOString();
  await kvPut(env, key, existing);
  await appendAuditLog(env, { action: 'match_dispute', actorId: reporterDiscordId, matchId, reason });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleMatchResolve(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { matchId, adminDiscordId, winner, rounds, note } = body;
  const key = `matchreport:${matchId}`;
  const existing = await kvGet(env, key) || { matchId, reports: [] };
  existing.status = 'resolved';
  existing.resolvedBy = adminDiscordId;
  existing.resolvedAt = new Date().toISOString();
  existing.adminWinner = winner;
  existing.adminRounds = rounds;
  existing.adminNote = note || '';
  await kvPut(env, key, existing);
  await appendAuditLog(env, { action: 'match_resolve', actorId: adminDiscordId, matchId, winner, note });
  return jsonResponse({ success: true }, 200, cors);
}

// ─── Challenge Routes ─────────────────────────────────────────────────────────

const CHALLENGE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ELO_CHALLENGE_RANGE = 300;

async function handleChallengeSend(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { challengerTeamId, challengedTeamId, captainDiscordId } = body;
  if (!challengerTeamId || !challengedTeamId || !captainDiscordId) return jsonResponse({ error: 'Missing fields' }, 400, cors);

  const [challenger, challenged] = await Promise.all([
    kvGet(env, `team:${challengerTeamId}`),
    kvGet(env, `team:${challengedTeamId}`),
  ]);
  if (!challenger || !challenged) return jsonResponse({ error: 'Team not found' }, 404, cors);
  if (challenger.captainDiscordId !== captainDiscordId) return jsonResponse({ error: 'Not captain' }, 403, cors);

  // ELO range check
  if (Math.abs((challenger.elo || 800) - (challenged.elo || 800)) > ELO_CHALLENGE_RANGE)
    return jsonResponse({ error: `ELO difference exceeds ${ELO_CHALLENGE_RANGE} limit` }, 400, cors);

  // Diamond cannot challenge Master
  if (challenger.tier === 'Diamond' && challenged.tier === 'Master')
    return jsonResponse({ error: 'Diamond teams cannot challenge Master teams' }, 400, cors);

  // Cooldown check
  const cooldownKey = `cooldown:challenge:${challengerTeamId}:${challengedTeamId}`;
  const lastChallenge = await kvGet(env, cooldownKey);
  if (lastChallenge && Date.now() - new Date(lastChallenge).getTime() < CHALLENGE_COOLDOWN_MS)
    return jsonResponse({ error: 'Challenge cooldown active (7 days)' }, 429, cors);

  const challengeId = crypto.randomUUID();
  const challenge = {
    id: challengeId,
    challengerTeamId,
    challengerTeamName: challenger.name,
    challengedTeamId,
    challengedTeamName: challenged.name,
    captainDiscordId,
    status: 'pending',
    eloDiff: Math.abs((challenger.elo || 800) - (challenged.elo || 800)),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_COOLDOWN_MS).toISOString(),
  };
  await kvPut(env, `challenge:${challengeId}`, challenge);

  // Add to team challenge lists
  const cList = await kvGet(env, `challenges:${challengerTeamId}`) || [];
  cList.unshift(challengeId);
  await kvPut(env, `challenges:${challengerTeamId}`, cList.slice(0, 20));
  const dList = await kvGet(env, `challenges:${challengedTeamId}`) || [];
  dList.unshift(challengeId);
  await kvPut(env, `challenges:${challengedTeamId}`, dList.slice(0, 20));

  await pushNotification(env, challenged.captainDiscordId, { type: 'challenge', title: 'Team Challenge', body: `${challenger.name} has challenged your team!`, challengeId });
  return jsonResponse({ success: true, challengeId }, 200, cors);
}

async function handleChallengeRespond(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { challengeId, captainDiscordId, accept } = body;
  const challenge = await kvGet(env, `challenge:${challengeId}`);
  if (!challenge) return jsonResponse({ error: 'Challenge not found' }, 404, cors);
  const challenged = await kvGet(env, `team:${challenge.challengedTeamId}`);
  if (!challenged || challenged.captainDiscordId !== captainDiscordId) return jsonResponse({ error: 'Not authorized' }, 403, cors);

  challenge.status = accept ? 'accepted' : 'declined';
  challenge.respondedAt = new Date().toISOString();
  await kvPut(env, `challenge:${challengeId}`, challenge);

  if (accept) {
    const cooldownKey = `cooldown:challenge:${challenge.challengerTeamId}:${challenge.challengedTeamId}`;
    await kvPut(env, cooldownKey, new Date().toISOString());
  }
  const challenger = await kvGet(env, `team:${challenge.challengerTeamId}`);
  await pushNotification(env, challenger?.captainDiscordId, {
    type: 'challenge_response',
    title: accept ? 'Challenge Accepted' : 'Challenge Declined',
    body: accept ? `${challenged.name} accepted your challenge!` : `${challenged.name} declined your challenge`,
    challengeId,
  });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleChallengesGet(teamId, env, cors) {
  const ids = await kvGet(env, `challenges:${teamId}`) || [];
  const challenges = (await Promise.all(ids.map(id => kvGet(env, `challenge:${id}`)))).filter(Boolean);
  return jsonResponse({ challenges }, 200, cors);
}

// ─── Notifications Routes ─────────────────────────────────────────────────────

async function handleNotificationsGet(userId, env, cors) {
  const notifs = await kvGet(env, `notifs:${userId}`) || [];
  return jsonResponse({ notifications: notifs }, 200, cors);
}

async function handleNotificationsRead(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { userId, ids } = body;
  const notifs = await kvGet(env, `notifs:${userId}`) || [];
  const updated = notifs.map(n => ids ? (ids.includes(n.id) ? { ...n, read: true } : n) : { ...n, read: true });
  await kvPut(env, `notifs:${userId}`, updated);
  return jsonResponse({ success: true }, 200, cors);
}

// ─── Announcements (Discord Channel) ─────────────────────────────────────────

const ANNOUNCEMENTS_CHANNEL_ID = '1461811148482412835';
const ANNOUNCEMENTS_CACHE_TTL = 5 * 60 * 1000; // 5 min

async function handleAnnouncementsGet(env, cors) {
  if (!env.DISCORD_BOT_TOKEN) return jsonResponse({ error: 'Bot token not configured' }, 500, cors);

  // Try cache first
  const cached = await kvGet(env, 'announcements:cache');
  if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < ANNOUNCEMENTS_CACHE_TTL)
    return jsonResponse({ announcements: cached.messages }, 200, cors);

  try {
    const res = await fetch(`${DISCORD_API}/channels/${ANNOUNCEMENTS_CHANNEL_ID}/messages?limit=15`, {
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
    });
    if (!res.ok) return jsonResponse({ error: 'Discord fetch failed' }, 500, cors);
    const raw = await res.json();

    // Filter: only messages with at least one image attachment or embed image
    const filtered = raw
      .filter(m => (m.attachments?.some(a => a.content_type?.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(a.filename))) || m.embeds?.some(e => e.image || e.thumbnail))
      .filter(m => m.content && m.content.length > 100) // only substantial messages
      .map(m => ({
        id: m.id,
        content: m.content,
        timestamp: m.timestamp,
        author: { username: m.author.username, avatar: m.author.avatar ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.webp?size=128` : null },
        attachments: m.attachments.filter(a => a.content_type?.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(a.filename)).map(a => ({ url: a.url, filename: a.filename, width: a.width, height: a.height })),
        embedImages: m.embeds.filter(e => e.image || e.thumbnail).map(e => ({ url: (e.image || e.thumbnail)?.url })),
      }));

    await kvPut(env, 'announcements:cache', { messages: filtered, fetchedAt: new Date().toISOString() });
    return jsonResponse({ announcements: filtered }, 200, cors);
  } catch (err) {
    console.error('Announcements fetch error:', err);
    return jsonResponse({ error: 'Failed to fetch announcements' }, 500, cors);
  }
}

// ─── Admin Routes ─────────────────────────────────────────────────────────────

async function requireAdmin(request, env) {
  const auth = request.headers.get('X-Admin-Discord-Id');
  if (!auth) return false;
  const player = await kvGet(env, `player:${auth}`);
  return player?.appRole === 'admin' || player?.appRole === 'mod';
}

async function handleAdminTeam(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { adminDiscordId, teamId, updates } = body;
  const team = await kvGet(env, `team:${teamId}`);
  if (!team) return jsonResponse({ error: 'Team not found' }, 404, cors);
  const allowed = ['name', 'tag', 'tier', 'elo', 'logoUrl', 'bannerUrl', 'region'];
  for (const key of allowed) { if (updates[key] !== undefined) team[key] = updates[key]; }
  await kvPut(env, `team:${teamId}`, team);
  await appendAuditLog(env, { action: 'admin_team_update', actorId: adminDiscordId, teamId, updates });
  return jsonResponse({ success: true, team }, 200, cors);
}

async function handleAdminPlayer(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { adminDiscordId, targetDiscordId, action, reason } = body;
  const player = await kvGet(env, `player:${targetDiscordId}`);
  if (!player) return jsonResponse({ error: 'Player not found' }, 404, cors);
  if (action === 'ban') { player.banned = true; player.banReason = reason || 'Admin action'; }
  else if (action === 'unban') { player.banned = false; player.banReason = null; }
  await kvPut(env, `player:${targetDiscordId}`, player);
  await appendAuditLog(env, { action: `admin_player_${action}`, actorId: adminDiscordId, targetDiscordId, reason });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleAdminMatch(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { adminDiscordId, matchId, action, winner, note } = body;
  const key = `matchreport:${matchId}`;
  const match = await kvGet(env, key) || { matchId, reports: [], status: 'pending' };
  if (action === 'forfeit') { match.status = 'forfeited'; match.forfeitWinner = winner; match.adminNote = note; }
  else if (action === 'force_report') { match.status = 'resolved'; match.adminWinner = winner; match.adminNote = note; }
  else if (action === 'swap_teams') { const t = match.team1; match.team1 = match.team2; match.team2 = t; }
  await kvPut(env, key, match);
  await appendAuditLog(env, { action: `admin_match_${action}`, actorId: adminDiscordId, matchId, winner, note });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleAuditLog(env, cors) {
  const log = await kvGet(env, 'audit_log') || [];
  return jsonResponse({ log }, 200, cors);
}

// ─── Caster Routes ────────────────────────────────────────────────────────────

async function handleCasterClaim(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { matchId, discordId, username, twitchChannel } = body;
  const key = `casterclaim:${matchId}`;
  const existing = await kvGet(env, key);
  if (existing && existing.discordId !== discordId) return jsonResponse({ error: 'Match already claimed' }, 409, cors);
  await kvPut(env, key, { matchId, discordId, username, twitchChannel: twitchChannel || '', claimedAt: new Date().toISOString() });
  return jsonResponse({ success: true }, 200, cors);
}

async function handleCasterUnclaim(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { matchId, discordId } = body;
  const key = `casterclaim:${matchId}`;
  const existing = await kvGet(env, key);
  if (existing?.discordId !== discordId) return jsonResponse({ error: 'Not your claim' }, 403, cors);
  await kv(env).delete(key);
  return jsonResponse({ success: true }, 200, cors);
}

async function handleCasterMatches(env, cors) {
  // List all casterclaim:* keys — scan (limited by CF KV list)
  const list = await kv(env).list({ prefix: 'casterclaim:' });
  const matches = await Promise.all(list.keys.map(k => kvGet(env, k.name)));
  return jsonResponse({ matches: matches.filter(Boolean) }, 200, cors);
}

// ─── History Routes ───────────────────────────────────────────────────────────

async function handlePlayerHistory(discordId, env, cors) {
  const key = `rosterlog:player:${discordId}`;
  const history = await kvGet(env, key) || [];
  return jsonResponse({ history }, 200, cors);
}

async function handleRosterLog(teamId, env, cors) {
  const log = await kvGet(env, `rosterlog:${teamId}`) || [];
  return jsonResponse({ log }, 200, cors);
}

// ─── Team Assets Routes ───────────────────────────────────────────────────────

async function handleTeamAssetsGet(teamSlug, env, cors) {
  const assets = await kvGet(env, `team_assets:${teamSlug}`);
  return jsonResponse({ assets: assets || { logoUrl: null, bannerUrl: null } }, 200, cors);
}

async function handleTeamAssetsSet(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { teamSlug, captainDiscordId, logoUrl, bannerUrl } = body;
  if (!teamSlug || !captainDiscordId) return jsonResponse({ error: 'Missing required fields' }, 400, cors);

  const isValidDataUri = (uri) =>
    uri.startsWith('data:image/png;base64,') || uri.startsWith('data:image/jpeg;base64,');

  if (logoUrl && !isValidDataUri(logoUrl)) return jsonResponse({ error: 'Only PNG and JPG images are allowed' }, 400, cors);
  if (bannerUrl && !isValidDataUri(bannerUrl)) return jsonResponse({ error: 'Only PNG and JPG images are allowed' }, 400, cors);

  // Rough size check (base64 chars * 0.75 ≈ bytes)
  if (logoUrl && logoUrl.length * 0.75 > 2 * 1024 * 1024) return jsonResponse({ error: 'Logo too large (max 2MB)' }, 400, cors);
  if (bannerUrl && bannerUrl.length * 0.75 > 5 * 1024 * 1024) return jsonResponse({ error: 'Banner too large (max 5MB)' }, 400, cors);

  const existing = await kvGet(env, `team_assets:${teamSlug}`) || {};
  const assets = {
    ...existing,
    teamSlug,
    logoUrl: logoUrl !== undefined ? logoUrl : (existing.logoUrl || null),
    bannerUrl: bannerUrl !== undefined ? bannerUrl : (existing.bannerUrl || null),
    updatedAt: new Date().toISOString(),
    updatedBy: captainDiscordId,
  };
  await kvPut(env, `team_assets:${teamSlug}`, assets);
  return jsonResponse({ success: true, assets }, 200, cors);
}

// ─── Player Banner Routes ─────────────────────────────────────────────────────

async function handlePlayerBannerGet(discordId, env, cors) {
  const data = await kvGet(env, `player_banner:${discordId}`);
  return jsonResponse({ bannerUrl: data?.bannerUrl || null }, 200, cors);
}

async function handlePlayerBannerSet(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }
  const { discordId, bannerUrl } = body;
  if (!discordId) return jsonResponse({ error: 'Missing discordId' }, 400, cors);

  if (bannerUrl && !bannerUrl.startsWith('data:image/png;base64,') && !bannerUrl.startsWith('data:image/jpeg;base64,'))
    return jsonResponse({ error: 'Only PNG and JPG images are allowed' }, 400, cors);
  if (bannerUrl && bannerUrl.length * 0.75 > 5 * 1024 * 1024)
    return jsonResponse({ error: 'Banner too large (max 5MB)' }, 400, cors);

  await kvPut(env, `player_banner:${discordId}`, { discordId, bannerUrl: bannerUrl || null, updatedAt: new Date().toISOString() });
  return jsonResponse({ success: true }, 200, cors);
}

export default {
  async fetch(request, env) {
    const cors = buildCorsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname;

    // Auth
    if (request.method === 'POST' && path === '/auth/callback') return handleAuthCallback(request, env, cors);

    // Signups (caster legacy)
    if (request.method === 'POST' && path === '/signups/add') return handleSignupAdd(request, env, cors);
    if (request.method === 'POST' && path === '/signups/remove') return handleSignupRemove(request, env, cors);
    const signupGetMatch = path.match(/^\/signups\/(.+)$/);
    if (request.method === 'GET' && signupGetMatch) return handleSignupGet(decodeURIComponent(signupGetMatch[1]), env, cors);

    // Production
    if (request.method === 'POST' && path === '/production/ticket') return handleCreateTicket(request, env, cors);
    if (request.method === 'POST' && path === '/production/caster-stats') return handleUpdateCasterStats(request, env, cors);
    if (request.method === 'POST' && path === '/production/camera-stats') return handleUpdateCameraStats(request, env, cors);

    // Players
    if (request.method === 'POST' && path === '/player/register') return handlePlayerRegister(request, env, cors);
    const playerGet = path.match(/^\/player\/([^/]+)$/);
    if (request.method === 'GET' && playerGet) return handlePlayerGet(playerGet[1], env, cors);

    // Teams
    if (request.method === 'POST' && path === '/team/create') return handleTeamCreate(request, env, cors);
    const teamGet = path.match(/^\/team\/([^/]+)$/);
    if (request.method === 'GET' && teamGet && teamGet[1] !== 'assets') return handleTeamGet(teamGet[1], env, cors);
    if (request.method === 'POST' && path === '/team/invite') return handleTeamInvite(request, env, cors);
    if (request.method === 'POST' && path === '/team/invite/respond') return handleInviteRespond(request, env, cors);
    if (request.method === 'POST' && path === '/team/kick') return handleTeamKick(request, env, cors);
    if (request.method === 'POST' && path === '/team/leave') return handleTeamLeave(request, env, cors);
    if (request.method === 'POST' && path === '/team/transfer') return handleTeamTransfer(request, env, cors);
    if (request.method === 'POST' && path === '/team/disband') return handleTeamDisband(request, env, cors);
    // Team assets (logo/banner upload by captain)
    const teamAssetsGet = path.match(/^\/team\/assets\/([^/]+)$/);
    if (request.method === 'GET' && teamAssetsGet) return handleTeamAssetsGet(decodeURIComponent(teamAssetsGet[1]), env, cors);
    if (request.method === 'POST' && path === '/team/assets') return handleTeamAssetsSet(request, env, cors);

    // Match reporting
    if (request.method === 'POST' && path === '/match/report') return handleMatchReport(request, env, cors);
    if (request.method === 'POST' && path === '/match/dispute') return handleMatchDispute(request, env, cors);
    if (request.method === 'POST' && path === '/match/resolve') return handleMatchResolve(request, env, cors);

    // Challenges
    if (request.method === 'POST' && path === '/challenge/send') return handleChallengeSend(request, env, cors);
    if (request.method === 'POST' && path === '/challenge/respond') return handleChallengeRespond(request, env, cors);
    const challengesGet = path.match(/^\/challenges\/([^/]+)$/);
    if (request.method === 'GET' && challengesGet) return handleChallengesGet(challengesGet[1], env, cors);

    // Notifications
    const notifsGet = path.match(/^\/notifications\/([^/]+)$/);
    if (request.method === 'GET' && notifsGet) return handleNotificationsGet(notifsGet[1], env, cors);
    if (request.method === 'POST' && path === '/notifications/read') return handleNotificationsRead(request, env, cors);

    // Announcements
    if (request.method === 'GET' && path === '/announcements') return handleAnnouncementsGet(env, cors);

    // Admin
    if (request.method === 'POST' && path === '/admin/team') return handleAdminTeam(request, env, cors);
    if (request.method === 'POST' && path === '/admin/player') return handleAdminPlayer(request, env, cors);
    if (request.method === 'POST' && path === '/admin/match') return handleAdminMatch(request, env, cors);
    if (request.method === 'GET' && path === '/audit-log') return handleAuditLog(env, cors);

    // Caster
    if (request.method === 'POST' && path === '/caster/claim') return handleCasterClaim(request, env, cors);
    if (request.method === 'POST' && path === '/caster/unclaim') return handleCasterUnclaim(request, env, cors);
    if (request.method === 'GET' && path === '/caster/matches') return handleCasterMatches(env, cors);

    // History
    const playerHistory = path.match(/^\/history\/player\/([^/]+)$/);
    if (request.method === 'GET' && playerHistory) return handlePlayerHistory(playerHistory[1], env, cors);
    const rosterLog = path.match(/^\/history\/roster\/([^/]+)$/);
    if (request.method === 'GET' && rosterLog) return handleRosterLog(rosterLog[1], env, cors);

    return jsonResponse({ error: 'Not found' }, 404, cors);
  },
};
