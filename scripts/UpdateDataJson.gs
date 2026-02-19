/**
 * EML — Auto-update data.json via Google Apps Script
 * =====================================================
 * This script reads all EML Google Sheet tabs, transforms them into the same
 * shapes the website hooks consume, and commits public/data.json to the GitHub
 * repository via the GitHub Contents API.
 *
 * SETUP (one-time):
 * -----------------
 * 1. Open this spreadsheet in Google Sheets.
 * 2. Go to Extensions → Apps Script.
 * 3. Paste this entire file as a new script file (e.g. UpdateDataJson.gs).
 * 4. In the Apps Script editor, click Project Settings (⚙) → Script Properties.
 *    Add three properties:
 *      GITHUB_TOKEN  → a GitHub Personal Access Token with "repo" scope
 *      GITHUB_OWNER  → your GitHub username or org (e.g. "aaliy")
 *      GITHUB_REPO   → repository name (e.g. "echo-master-league-website")
 * 5. Save the script.
 * 6. Run `updateDataJson` once manually (click ▶) to authorise OAuth scopes.
 * 7. Add a time-driven trigger:
 *      Triggers (clock icon) → Add Trigger
 *      Function: updateDataJson
 *      Event source: Time-driven
 *      Type: Minutes timer / Every 15 minutes  (or Every hour)
 *
 * HOW IT WORKS:
 * -------------
 * 1. Reads every sheet tab listed in SHEET_TABS.
 * 2. Transforms raw rows into the exact shapes useTeams/useStandings/etc. expect.
 * 3. Fetches the current SHA of public/data.json from GitHub (needed for the PUT).
 * 4. Commits new file content with a timestamped commit message.
 * 5. The commit to `main` triggers a GitHub Pages rebuild → live site is updated.
 *
 * DEPLOYMENT NOTE:
 * ----------------
 * The site deploys via `npm run build && gh-pages -d dist`.
 * A commit to `main` does NOT automatically trigger a rebuild unless you have a
 * GitHub Actions workflow configured (e.g. on push → build → deploy to gh-pages).
 * If you do not have that, set up `.github/workflows/deploy.yml` (see bottom of file).
 */

// ─── Constants ──────────────────────────────────────────────────────────────

var SPREADSHEET_ID = '1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc';

var SHEET_TABS = {
  rosterWide:           '_RosterWide',
  rankings:             'Rankings',
  upcomingMatches:      'Upcoming Matches',
  proposedMatchResults: 'Proposed Match Results',
  matchResults:         'Match Results',
  forfeits:             'Forfeits',
  cooldownList:         'Cooldown List',
  teamRoles:            'Team Roles',
  leagueSubs:           'Registered League Subs',
};

var GITHUB_FILE_PATH = 'public/data.json';
var GITHUB_BRANCH    = 'main';

// ─── Entry point ─────────────────────────────────────────────────────────────

function updateDataJson() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var data = {
    lastUpdated:    new Date().toISOString(),
    teams:          transformTeams(getSheetData(ss, SHEET_TABS.rosterWide)),
    teamRoles:      transformTeamRoles(
                      getSheetData(ss, SHEET_TABS.teamRoles),
                      getSheetData(ss, SHEET_TABS.rankings)
                    ),
    standings:      transformStandings(getSheetData(ss, SHEET_TABS.rankings)),
    rankings:       transformRankings(getSheetData(ss, SHEET_TABS.rankings)),
    matchResults:   transformMatchResults(getSheetData(ss, SHEET_TABS.matchResults)),
    forfeits:       transformMatchResults(getSheetData(ss, SHEET_TABS.forfeits)),
    proposedMatches: transformProposedMatches(getSheetData(ss, SHEET_TABS.proposedMatchResults)),
    cooldownPlayers: transformCooldownList(getSheetData(ss, SHEET_TABS.cooldownList)),
    leagueSubs:     transformLeagueSubs(getSheetData(ss, SHEET_TABS.leagueSubs)),
  };

  var json = JSON.stringify(data, null, 2);
  pushToGitHub(json);
  Logger.log('data.json updated successfully at ' + data.lastUpdated);
}

// ─── Sheet reader ─────────────────────────────────────────────────────────────

/**
 * Reads a sheet tab and returns an array of header-keyed objects.
 * Replicates the duplicate-header deduplication logic from useGoogleSheets.jsx:
 *   - Duplicate headers become "Header_2", "Header_3", etc.
 *   - Empty headers become "_empty_N" (where N is the 0-based column index).
 */
function getSheetData(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    Logger.log('Warning: sheet not found — ' + tabName);
    return [];
  }

  var range = sheet.getDataRange();
  var rows  = range.getValues();
  if (rows.length < 2) return [];

  var rawHeaders = rows[0];
  var headerCounts = {};
  var headers = rawHeaders.map(function(h, i) {
    var trimmed = String(h).trim();
    if (!trimmed) return '_empty_' + i;
    if (headerCounts[trimmed] === undefined) {
      headerCounts[trimmed] = 1;
      return trimmed;
    }
    headerCounts[trimmed]++;
    return trimmed + '_' + headerCounts[trimmed];
  });

  return rows.slice(1).map(function(row, idx) {
    var obj = { id: idx + 1 };
    headers.forEach(function(header, i) {
      var cell = row[i];
      obj[header] = (cell !== undefined && cell !== null) ? String(cell) : '';
    });
    return obj;
  });
}

// ─── Transforms (mirror the hook logic exactly) ──────────────────────────────

function transformTeams(data) {
  return data.map(function(row) {
    return {
      id:           row.id,
      name:         row['Team Name'] || row['Team'] || row.name || '',
      captain:      row['Captain']   || row.captain || '',
      coCaptain:    (row['Co-Captain (CC) Player'] || row['Co-Captain'] || row['Co Captain'] || row.coCaptain || '').replace(/^\(CC\)\s*/, ''),
      players:      [
                      row['Player 1'] || row['Player']   || '',
                      row['Player 2'] || row['Player_2'] || '',
                      row['Player 3'] || row['Player_3'] || '',
                      row['Player 4'] || row['Player_4'] || '',
                    ].filter(Boolean),
      tier:         row['Tier']   || row.tier   || '',
      region:       row['Region'] || row.region || 'NA',
      status:       row['Status'] || row.status || 'Active',
      leaguePoints: parseInt(row['League Points'] || row.leaguePoints || row.Points || 0) || 0,
      wins:         parseInt(row['Wins']   || row.wins   || 0) || 0,
      losses:       parseInt(row['Losses'] || row.losses || 0) || 0,
      teamLogo:     row['Team Logo'] || row.teamLogo || row.Logo || '',
    };
  }).filter(function(t) { return t.name; });
}

function transformTeamRoles(data, rankingsData) {
  // Build set of active team names from Rankings sheet
  var activeTeamNames = {};
  (rankingsData || []).forEach(function(row) {
    var name = row['Team'] || row['team name'] || row['Team Name'] || row.team || '';
    if (name.trim()) activeTeamNames[name.toLowerCase().trim()] = true;
  });

  var teamMap = {};
  var firstRow = data[0] || {};
  var hasPlayerNameColumn = ('Player Name' in firstRow) || ('Player' in firstRow) || ('player' in firstRow);

  if (hasPlayerNameColumn) {
    data.forEach(function(row) {
      var playerName  = row['Player Name'] || row.Player || row.player || '';
      var teamName    = row['Team Name']   || row.Team   || row.team   || '';
      var isCaptain   = (row['Captain']    || '').toLowerCase() === 'yes';
      var isCoCaptain = (row['Co-Captain'] || row['Co-Captain '] || '').toLowerCase() === 'yes';
      var rank        = row['Rank'] || '';
      if (!playerName || !teamName) return;
      if (!teamMap[teamName]) teamMap[teamName] = { name: teamName, captain: '', coCaptain: '', players: [], ranks: [] };
      var team = teamMap[teamName];
      if (isCaptain)        team.captain = playerName;
      else if (isCoCaptain) team.coCaptain = playerName;
      else                  team.players.push(playerName);
      if (rank) team.ranks.push(rank);
    });
  } else {
    data.forEach(function(row) {
      var values = Object.keys(row)
        .filter(function(k) { return k !== 'id' && row[k] && String(row[k]).trim(); })
        .map(function(k) { return row[k]; });
      if (!values.length) return;
      var teamName = String(values[0]).trim();
      if (!teamName || teamName === 'Active' || teamName === 'Inactive') return;
      var playerValues = values.slice(1).filter(function(v) {
        return v && String(v).trim() && v !== 'Active' && v !== 'Inactive';
      });
      if (!teamMap[teamName]) teamMap[teamName] = { name: teamName, captain: '', coCaptain: '', players: [], ranks: [] };
      var team = teamMap[teamName];
      var captainAssigned = false;
      playerValues.forEach(function(p) {
        var s = String(p).trim();
        if (s.startsWith('(CC)')) {
          team.coCaptain = s.replace('(CC)', '').trim();
        } else if (!captainAssigned) {
          team.captain = s;
          captainAssigned = true;
        } else {
          team.players.push(s);
        }
      });
    });
  }

  return Object.keys(teamMap).map(function(name, index) {
    var team        = teamMap[name];
    var memberList  = [team.captain, team.coCaptain].concat(team.players).filter(Boolean);
    var isActive    = !!activeTeamNames[team.name.toLowerCase().trim()];
    return {
      id:          index + 1,
      name:        team.name,
      captain:     team.captain,
      coCaptain:   team.coCaptain,
      players:     team.players.filter(Boolean),
      status:      isActive ? 'Active' : 'Inactive',
      totalPlayers: memberList.length,
      ranks:       team.ranks,
    };
  }).sort(function(a, b) { return a.name.localeCompare(b.name); });
}

function transformStandings(data) {
  return data.map(function(row, idx) {
    return {
      id:       row.id || idx,
      position: idx + 1,
      tier:     row['Rank']   || row.tier || row.Tier || '',
      team:     row['team name'] || row['Team'] || row.team || row['Team Name'] || '',
      region:   row['Region'] || row.region || 'NA',
      wins:     parseInt(row['Wins'] || row['W'] || row.wins || 0) || 0,
      losses:   parseInt(row['Losses'] || row['L'] || row.losses || 0) || 0,
      mmr:      parseInt(row['Rating'] || row['MMR'] || row.mmr || row.rating || 0) || 0,
      points:   parseInt(row['Points'] || row['League Points'] || row.points || 0) || 0,
      active:   row['Active'] || row.active || row.Status || 'Active',
    };
  }).filter(function(t) { return t.team; });
}

function parseRankTier_(tierString) {
  if (!tierString) return { rank: 'Unranked', division: null };
  var str   = String(tierString).trim();
  var match = str.match(/^(Master|M|Diamond|D|Platinum|P|Gold|G|Silver|S|Bronze|B)\s*(\d)?/i);
  if (!match) return { rank: str, division: null };
  var rankMap = {
    'M':'Master','MASTER':'Master','D':'Diamond','DIAMOND':'Diamond',
    'P':'Platinum','PLATINUM':'Platinum','G':'Gold','GOLD':'Gold',
    'S':'Silver','SILVER':'Silver','B':'Bronze','BRONZE':'Bronze',
  };
  return {
    rank:     rankMap[match[1].toUpperCase()] || match[1],
    division: match[2] ? parseInt(match[2]) : null,
  };
}

function transformRankings(data) {
  return data.map(function(row, idx) {
    var tierInfo = parseRankTier_(row['Rank'] || row['Tier'] || row.tier || row.rank);
    return {
      id:       row.id,
      position: idx + 1,
      name:     row['team name'] || row['Team'] || row.team || '',
      captain:  row['Captain']  || row.captain  || '',
      tier:     tierInfo.rank,
      division: tierInfo.division,
      mmr:      parseInt(row['Rating'] || row['MMR'] || row.mmr || 0) || 0,
      region:   row['Region']  || row.region  || 'North America',
      wins:     parseInt(row['Wins'] || row['W'] || row.wins || 0) || 0,
      losses:   parseInt(row['Losses'] || row['L'] || row.losses || 0) || 0,
      active:   row['Active'] || row.active || 'Yes',
      teamLogo: {
        url:   row['Logo'] || row.logo || 'https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024',
        label: row['team name'] || row.team || 'Team Logo',
      },
    };
  }).filter(function(r) { return r.name; });
}

function parseMatchScoreRow_(row) {
  var team1       = row['Team A'] || row.team1 || '';
  var team2       = row['Team B'] || row.team2 || '';
  var matchStatus = row['Match Status'] || row.matchStatus || '';
  var isForfeit   = matchStatus.toLowerCase().indexOf('forfeit') !== -1;

  var t1Total = (parseInt(row['Round 1'] || 0) || 0) +
                (parseInt(row['Round 2'] || 0) || 0) +
                (parseInt(row['Round 3'] || 0) || 0);
  var t2Total = (parseInt(row['_empty_8']  || 0) || 0) +
                (parseInt(row['_empty_10'] || 0) || 0) +
                (parseInt(row['_empty_12'] || 0) || 0);
  return {
    team1, team2,
    team1Score: t1Total,
    team2Score: t2Total,
    team1Won:   t1Total > t2Total,
    team2Won:   t2Total > t1Total,
    isForfeit,
    matchStatus,
  };
}

function transformMatchResults(data) {
  return data.map(function(row) {
    var scoreData = parseMatchScoreRow_(row);
    return Object.assign({
      id:        row.id,
      week:      row['Week']             || row.week      || '',
      matchDate: row['Match Date']       || row.date      || '',
      matchTime: row['Match Time (ET)']  || row.matchTime || '',
      matchType: row['Match Type']       || row.matchType || '',
    }, scoreData);
  }).filter(function(m) {
    return m.team1 && m.team2 && (m.team1Score > 0 || m.team2Score > 0 || m.isForfeit);
  });
}

function transformProposedMatches(data) {
  return data.map(function(row) {
    var team1      = row['Team Submitting Scores'] || row['Team 1'] || '';
    var team2      = row['Team Accepting Scores']  || row['Team 2'] || '';
    var t1Score    = (parseInt(row['Team A Round 1'] || 0) || 0) +
                     (parseInt(row['Team A Round 2'] || 0) || 0) +
                     (parseInt(row['Team A Round 3'] || 0) || 0);
    var t2Score    = (parseInt(row['Team B Round 1'] || 0) || 0) +
                     (parseInt(row['Team B Round 2'] || 0) || 0) +
                     (parseInt(row['Team B Round 3'] || 0) || 0);
    return {
      id:             row.id,
      team1,
      team2,
      matchDate:      null,
      matchTime:      '',
      score:          (t1Score || t2Score) ? (t1Score + ' - ' + t2Score) : '',
      status:         row['Match Status'] || row['Status'] || row.status || 'Pending',
      matchType:      row['Match Type']   || row.matchType || '',
      week:           row['Week']  || row.week  || '',
      round:          row['Round'] || row.round || '',
      proposedResult: row['Proposed Result'] || '',
      streamLink:     { url: '', platform: 'Twitch' },
    };
  }).filter(function(m) { return m.team1 && m.team2; });
}

function transformCooldownList(data) {
  return data.map(function(row) {
    var cooldownUntil = row['Expires'] || row['Cooldown Until'] || row['Until'] || row.cooldownUntil || '';
    return {
      id:           row.id,
      playerName:   row['Player Name'] || row['Player'] || row.playerName || row.player || '',
      team:         row['Team Left']   || row['Team']   || row['Team Name'] || row.team || '',
      cooldownUntil: cooldownUntil,
      reason:       row['Reason']  || row.reason  || 'Team Transfer',
      eligibleDate: row['Expires'] || row['Eligible Date'] || row['Eligible'] || row.eligibleDate || '',
    };
  }).filter(function(p) { return p.playerName; });
}

function transformLeagueSubs(data) {
  return data.map(function(row) {
    return (
      row['Player Name'] || row['Player'] || row['player'] ||
      row['name'] || row['Name'] || row['Substitute'] || row['Sub'] ||
      (Object.keys(row).map(function(k) { return row[k]; })
        .find(function(v) { return v && typeof v === 'string' && v.trim(); }) || '')
    ).trim();
  }).filter(Boolean);
}

// ─── GitHub push ─────────────────────────────────────────────────────────────

function pushToGitHub(jsonString) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('GITHUB_TOKEN');
  var owner = props.getProperty('GITHUB_OWNER');
  var repo  = props.getProperty('GITHUB_REPO');

  if (!token || !owner || !repo) {
    throw new Error('Missing Script Properties: GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO');
  }

  var apiBase = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + GITHUB_FILE_PATH;
  var headers = {
    'Authorization': 'token ' + token,
    'Accept':        'application/vnd.github.v3+json',
    'User-Agent':    'EML-Apps-Script',
  };

  // GET current file to obtain its SHA (required for updates)
  var getResp = UrlFetchApp.fetch(apiBase + '?ref=' + GITHUB_BRANCH, {
    method:             'get',
    headers:            headers,
    muteHttpExceptions: true,
  });

  var sha = null;
  if (getResp.getResponseCode() === 200) {
    sha = JSON.parse(getResp.getContentText()).sha;
  } else if (getResp.getResponseCode() !== 404) {
    throw new Error('GitHub GET failed: ' + getResp.getResponseCode() + ' ' + getResp.getContentText());
  }

  // PUT (create or update) the file
  var body = {
    message: 'chore: auto-update data.json [' + new Date().toISOString() + ']',
    content: Utilities.base64Encode(jsonString, Utilities.Charset.UTF_8),
    branch:  GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  var putResp = UrlFetchApp.fetch(apiBase, {
    method:             'put',
    headers:            headers,
    contentType:        'application/json',
    payload:            JSON.stringify(body),
    muteHttpExceptions: true,
  });

  var code = putResp.getResponseCode();
  if (code !== 200 && code !== 201) {
    throw new Error('GitHub PUT failed: ' + code + ' ' + putResp.getContentText());
  }

  Logger.log('GitHub commit successful: ' + code);
}

/*
 * ─── Optional: GitHub Actions deploy.yml ─────────────────────────────────────
 *
 * If you want commits to `main` to automatically rebuild and deploy the site,
 * create `.github/workflows/deploy.yml` in the repo with:
 *
 * name: Deploy to GitHub Pages
 * on:
 *   push:
 *     branches: [main]
 *     paths:
 *       - 'public/data.json'
 *       - 'src/**'
 * jobs:
 *   deploy:
 *     runs-on: ubuntu-latest
 *     steps:
 *       - uses: actions/checkout@v4
 *       - uses: actions/setup-node@v4
 *         with: { node-version: '20' }
 *       - run: npm ci
 *       - run: npm run build
 *       - uses: peaceiris/actions-gh-pages@v4
 *         with:
 *           github_token: ${{ secrets.GITHUB_TOKEN }}
 *           publish_dir: ./dist
 */
