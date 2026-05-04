import React, { useState } from 'react';
import { Box, HStack, VStack, Text, Button, Image, Badge } from '@chakra-ui/react';
import { Calculator, BookOpen, Bot, CalendarDays, Users, Shield, ExternalLink, Terminal, FileText, Archive, Trophy, GitBranch } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

// ─────────────────────────────────────────────────────────────────
// DATA CONSTANTS
// ─────────────────────────────────────────────────────────────────

const BOT_INSTRUCTIONS = [
  {
    section: 'TO REGISTER OR UNREGISTER AS A PLAYER',
    items: [
      { cmd: '/playerregister', desc: 'Register to be eligible to play in EML. The bot will register you under your current server nickname — make sure it matches your in-game name.' },
      { cmd: '/playerunregister', desc: 'Remove yourself from the league.' },
    ],
  },
  {
    section: 'TO REGISTER OR UNREGISTER AS A LEAGUE SUB',
    items: [
      { cmd: '/leaguesubregister', desc: 'Register as a league sub.' },
      { cmd: '/leaguesubunregister', desc: 'Unregister yourself as a sub.' },
    ],
  },
  {
    section: 'TO CREATE OR DISBAND A TEAM',
    items: [
      { cmd: '/teamcreate [name]', desc: 'Create a team. Team names cannot be changed after creation — make sure it meets the EML CoC and you\'ll be happy with it for the season.' },
      { cmd: '/teamdisband', desc: 'Disband a team.' },
    ],
  },
  {
    section: 'TO ADD OR REMOVE PLAYERS TO/FROM YOUR TEAM',
    items: [
      { cmd: '/teamplayeradd [player name]', desc: 'Add a player to your team using their exact name.' },
      { cmd: '/teamplayerkick [player name]', desc: 'Remove a player from the team. Cooldown will apply to that player until the following Sunday.' },
    ],
  },
  {
    section: 'TO PROMOTE OR DEMOTE PLAYERS ON YOUR TEAM',
    items: [
      { cmd: '/teamplayerpromote', desc: 'Give a team Player the Co-Captain role. The Co-Captain can run match commands and will inherit the team if the Captain leaves.' },
      { cmd: '/teamplayerdemote', desc: 'Remove the Co-Captain role from the current Co-Captain.' },
    ],
  },
  {
    section: 'TO ACCEPT AN INVITATION TO JOIN A TEAM',
    items: [
      { cmd: '/teaminviteaccept', desc: 'Select the name of the team you want to join. Select "Clear Invitation" to decline.' },
    ],
  },
  {
    section: 'TO LEAVE A TEAM',
    items: [
      { cmd: '/teamleave', desc: 'Leave your team. If you are Captain, ownership transfers to the Co-Captain. Cooldown applies until the following Sunday night.' },
    ],
  },
  {
    section: 'TO SCHEDULE OR ACCEPT/REJECT A MATCH',
    items: [
      { cmd: '/matchdatepropose', desc: 'Propose a match date and time. Add the other team\'s exact name, match type (Assigned, Challenge, Postponed), and date format: YYYY/MM/DD HH:MM am/pm — e.g. 2024-05-25 8:00 pm.' },
      { cmd: '/matchdateaccept → ACCEPT', desc: 'Accept the proposed match date and time.' },
      { cmd: '/matchdateaccept → CLEAR ALL INVITES', desc: 'Reject the proposed date and time.' },
    ],
  },
  {
    section: 'TO ENTER OR ACCEPT MATCH RESULTS',
    items: [
      { cmd: '/matchresultpropose', desc: 'Enter match results and send to the other team. Add scores with your team\'s score first for each round like: 12-7,15-10.' },
      { cmd: '/matchresultaccept', desc: 'Accept match results proposed by the other team.' },
    ],
  },
  {
    section: 'TO PLAY WITH A LEAGUE SUB IN A MATCH',
    items: [
      { cmd: 'Step 1', desc: 'Make sure the match has been proposed and accepted by both teams.' },
      { cmd: 'Step 2', desc: 'The Captain or Co-Captain of the team using the league sub runs /leaguesubmatchpropose, then the league sub accepts with /leaguesubmatchaccept.' },
    ],
  },
  {
    section: 'TO LOOK UP PLAYER OR TEAM INFORMATION',
    items: [
      { cmd: '/lookupplayer [name]', desc: 'See player information.' },
      { cmd: '/lookupteam [name]', desc: 'See team information.' },
    ],
  },
  {
    section: 'TO SEE PLAYERS ON COOLDOWN',
    items: [{ cmd: '/listcooldownplayers', desc: 'See a list of current players on cooldown.' }],
  },
];

const CHANGE_NAME_CAPTAIN = [
  'Promote a trusted player to Co-Captain.',
  'Leave your team, which promotes the Co-Captain to Captain. (Cooldown will immediately apply to your account, and come off the following Sunday night.)',
  'Unregister from the EML League.',
  'Change your In Game Name (IGN) at the Echo Lounge.',
  'Change your EML Server Nickname to match your new IGN.',
  'Register for the EML League.',
  'Request the Captain or Co-Captain add you to the team with the command.',
  'Have the Captain promote you to Co-Captain.',
  'Have the Captain leave the team, giving you the Captain role.',
  'Invite the player back.',
];

const CHANGE_NAME_PLAYER = [
  'Leave your team. (Cooldown will immediately apply to your account, and come off the following Sunday night.)',
  'Unregister from the EML League.',
  'Change your In Game Name (IGN) at the Echo Lounge.',
  'Change your EML Server Nickname to match your new IGN.',
  'Register for the EML League.',
  'Request the Captain or Co-Captain add you to the team with the command.',
];

const CHANGE_TEAM_NAME_STEPS = [
  'Disband your team.',
  'Create the new team with the new name.',
  'Invite the players back.',
];

const GENERAL_COMMANDS = [
  { cmd: '/actionlist', desc: 'Gives a link to the Action List of players that have had league action taken due to CoC or Rule violation(s).' },
  { cmd: '/ap', desc: 'Gives a link to the Accumulated Points system.' },
  { cmd: '/calendar NA/EU', desc: 'Produces a graphic of the details for the entire current league calendar year.' },
  { cmd: '/coc', desc: 'Gives a link to the EML Discord server channel with the Code of Conduct.' },
  { cmd: '/help', desc: 'Gives a list of all commands with abbreviated descriptions.' },
  { cmd: '/leaguerules', desc: 'Gives a link to the League Rules on the website.' },
  { cmd: '/rolelookup', desc: 'Looks up and displays all members with a specific role or set of roles.' },
  { cmd: '/loungereport', desc: 'Gives a link to the Echo VR Lounge (ECL) Discord to make a ticket.' },
  { cmd: '/matches', desc: 'Gives a link to the website Upcoming Matches List.' },
  { cmd: '/ranks', desc: 'Gives a link to the website Team Rank List.' },
  { cmd: '/registration', desc: 'Gives a link to the website NA Team Registration Form.' },
  { cmd: '/rosters', desc: 'Gives a link to the website Roster List.' },
  { cmd: '/staffapp', desc: 'Gives a link to the EML website Staff Application.' },
  { cmd: '/support', desc: 'Gives a link to the EML Discord server #general-faq channel.' },
  { cmd: '/ticket', desc: 'Gives a link to the EML Discord server ticket channel.' },
  { cmd: '/website', desc: 'Gives a link to the EML website main page.' },
  { cmd: '/commands', desc: 'Gives a link to the EML website page showing the list of all bot commands.' },
  { cmd: '/instructions', desc: 'Gives a link to the EML website page showing a list of command instructions.' },
];

const LEAGUE_COMMANDS = [
  { cmd: '/lookupplayer', desc: 'Allows anyone to look up the details of a Player.' },
  { cmd: '/lookupteam', desc: 'Allows anyone to look up the details of a Team.' },
  { cmd: '/matchdateaccept', desc: 'Allows a Captain or Co-Captain to accept a match date and time proposed by the other Team.' },
  { cmd: '/matchdatepropose', desc: 'Allows a Captain or Co-Captain to propose a match type, date and time. Format: match_type (Assigned/Challenge), opponent_name [TEAM NAME], date YYYY/MM/DD HH:MM am/pm.' },
  { cmd: '/matchresultaccept', desc: 'Allows a Captain or Co-Captain to accept match results proposed by the other team.' },
  { cmd: '/matchresultpropose', desc: 'Allows a Captain or Co-Captain to propose match results. Format: match_type, opponent_name, outcome (Win/Loss), round_1_us ##, round_1_them ##, round_2_us ##, round_2_them ##.' },
  { cmd: '/playerregister', desc: 'Allows a Player to register to be available to join teams.' },
  { cmd: '/playerunregister', desc: 'Allows a Player to unregister and leave the league.' },
  { cmd: '/teamcreate', desc: 'Allows a Registered Player to create a Team.' },
  { cmd: '/teamdisband', desc: 'Allows a Captain to disband a team.' },
  { cmd: '/teaminviteaccept', desc: 'Allows a Player to accept an invitation to join a team.' },
  { cmd: '/teamplayeradd', desc: 'Allows a Captain or Co-Captain to invite a Registered Player to their team.' },
  { cmd: '/teamleave', desc: 'Allows a Player to leave their team.' },
  { cmd: '/teamplayerdemote', desc: 'Allows a Captain to demote a Co-Captain to Player.' },
  { cmd: '/teamplayerpromote', desc: 'Allows a Captain to promote a Player to Co-Captain.' },
  { cmd: '/teamplayerkick', desc: 'Allows a Captain to remove ANY Player from the team.' },
  { cmd: '/listcooldownplayers', desc: 'Shows a list of players on cooldown until the following Monday.' },
  { cmd: '/leaguesubregister', desc: 'Allows a Registered Player to register as a League Sub.' },
  { cmd: '/leaguesubunregister', desc: 'Allows a Registered Player to unregister as a League Sub.' },
  { cmd: '/leaguesubmatchpropose', desc: 'Allows a Captain, Co-Captain or League Sub to register a specific League Sub to play in a League Match.' },
  { cmd: '/leaguesubmatchaccept', desc: 'Allows a Captain, Co-Captain or League Sub to confirm a specific League Sub to play in a League Match.' },
];

const AP_GAMEPLAY = [
  { tier: '1', punishment: 'Warning', explanation: 'Indisputably could not have affected volley/round/match outcome, but technically illegal.', comments: 'Technically a violation, but all League Mods agree it did not and could not affect actual outcome.', apValue: '0–2', responsible: 'P' },
  { tier: '2', punishment: 'Score Penalty', explanation: 'Any violations of the rules during a match that do not escalate to a higher tier.', comments: 'A 4-point score penalty for each volley affected by a violation of any kind, as long as it is not Tier 1 or Tier 3+.', apValue: '2', responsible: 'P' },
  { tier: '3', punishment: 'Round Forfeit', explanation: 'Indisputably affected outcome of an entire round, or accrued score penalties exceed 20 points (capped at 10 per round).', comments: 'Violations that indisputably affect an entire match result in a full match forfeit of 10-0.', apValue: '4', responsible: 'P' },
  { tier: '4', punishment: 'Match Forfeit', explanation: 'Indisputably affected outcome of an entire match, score penalties exceed 20 points, or player used a non-registered name.', comments: 'Full match forfeit of 10-0, 10-0.', apValue: '5', responsible: 'P' },
  { tier: '5', punishment: 'Suspension', explanation: 'Repeated violations and/or violations severe enough to elevate to League Directors.', comments: 'Up to Directors, can happen in conjunction with lower tier punishments. Also includes 10-0, 10-0 match forfeit.', apValue: '10+', responsible: 'P' },
  { tier: '6', punishment: 'Ban', explanation: 'Many repeated violations and/or extremely severe violations, elevated to Directors.', comments: 'Up to League Directors, can happen in conjunction with lower tier punishments.', apValue: '30', responsible: 'P' },
  { tier: 'SC', punishment: 'Match Forfeit (31–30)', explanation: 'Match cannot be played and outcome needs to be determined by League Moderators. Neither team is at fault or both are.', comments: 'Ex. Teams did not contact each other until Saturday, no common times found, postponing not an option.', apValue: '0+', responsible: 'C' },
];

const AP_NON_GAMEPLAY_TIERS = [
  {
    label: 'Tier 1',
    rows: [
      { offense: 'Player with nonmatching In Game Name / Server Nickname', rule: '10', ap: '2', who: 'P' },
      { offense: 'Not submitting score by deadline (unless teams are disputing result)', rule: '3', ap: '2', who: 'C' },
      { offense: 'Failure to schedule or accept a match on/before scheduling deadline', rule: '3', ap: '2', who: 'P C' },
      { offense: 'Roster adjustments during an active match', rule: '10', ap: '2', who: 'P C' },
      { offense: 'Having inactive alt account (e.g. for placeholding team names)', rule: '10', ap: '2', who: 'P' },
      { offense: 'Switching teams in game for an unapproved reason', rule: '8', ap: '2+', who: 'P' },
      { offense: 'Incorrect results submitted', rule: '6/7', ap: '2', who: 'P' },
      { offense: 'Submitting incorrect league sub or failure to submit', rule: '10', ap: '2', who: 'C' },
      { offense: 'Leaving the EML Discord server without unregistering or disbanding a team', rule: '—', ap: '0–2', who: '—' },
    ],
  },
  {
    label: 'Tier 2',
    rows: [
      { offense: 'Failure to schedule a match before next match generation', rule: '3', ap: '5', who: 'P C' },
      { offense: 'Delay in getting EML casters in a match / starting a casted match', rule: '11', ap: '5 (after 5 min grace)', who: 'C' },
      { offense: 'League sub agrees to play and no-shows with less than 4 hours notice', rule: '10', ap: '5', who: 'P' },
      { offense: 'Failure to show up for scheduled match (4 hours notice / no notice)', rule: '7', ap: '5 (2/5)', who: 'P C' },
      { offense: 'Inappropriate conduct while streamed / live game / event', rule: '1', ap: '5+', who: 'P' },
      { offense: 'Inappropriate conduct while interacting with EML staff', rule: '1', ap: '5+', who: 'P' },
      { offense: 'Poor sportsmanship (self-goaling, dinging disc, etc.)', rule: '1, 5.8', ap: '5+', who: 'P C' },
      { offense: 'Nonapproved spectator in match', rule: '11', ap: '5+', who: 'P C' },
      { offense: 'Using alt accounts to manipulate functions of the league', rule: '10', ap: '5+', who: 'P' },
      { offense: 'Minor CoC violation', rule: '1', ap: '5+', who: 'P' },
    ],
  },
  {
    label: 'Tier 3',
    rows: [
      { offense: 'Offensive / inappropriate team name or logo', rule: '10', ap: '10+', who: 'P' },
      { offense: 'Offensive / inappropriate player name or logo', rule: '10', ap: '10+', who: 'P' },
      { offense: 'Circumventing a mute in an EML server or assisting someone circumvent their mute', rule: '1', ap: '10+', who: 'P' },
      { offense: 'Team uses ineligible substitute or player', rule: '10', ap: '10+', who: 'P C' },
      { offense: 'Refusal to allow casters into match', rule: '11', ap: '15+', who: 'P' },
      { offense: 'Serious CoC infraction', rule: '1', ap: '10+', who: 'P' },
      { offense: 'Master team disband without moderator approval', rule: '12', ap: '10', who: 'C' },
    ],
  },
  {
    label: 'Tier 4',
    rows: [
      { offense: 'Intentionally forfeit a match', rule: '5', ap: '10–30', who: 'P C' },
      { offense: 'Master team abusing forfeits and postponements', rule: '5', ap: '10–30', who: 'C' },
      { offense: 'Attempting to or assisting to circumvent a suspension (i.e. by alt)', rule: '11', ap: '10–30', who: 'P' },
      { offense: 'Team uses banned or suspended player', rule: '10', ap: '10–30', who: 'P C' },
      { offense: 'Having multiple active accounts', rule: '10', ap: '10–30', who: 'P' },
      { offense: 'Code of Conduct violation', rule: '1', ap: '10–30', who: 'P' },
      { offense: 'Serious Code of Conduct violation', rule: '1', ap: '15–50', who: 'P' },
      { offense: 'Serious exploiting / circumventing game mechanics', rule: '14', ap: '15–30', who: 'P' },
    ],
  },
];

const AP_THRESHOLDS = [
  { points: '10', punishment: 'One week suspension applied through the following match week' },
  { points: '15', punishment: 'Three week suspension applied through the following match week' },
  { points: '20', punishment: '50% of total season length suspension applied through the following match week' },
  { points: '30', punishment: '75% of total season length suspension applied through the following match week' },
  { points: '40', punishment: '100% of total season length suspension applied through the following match week' },
  { points: '50', punishment: 'Permanent ban' },
];

// ─────────────────────────────────────────────────────────────────
// CALCULATOR COMPONENTS
// ─────────────────────────────────────────────────────────────────

const TeamForfeitCalc = ({ colors }) => {
  const sel = (bg) => ({
    background: bg,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: '6px',
    padding: '3px 7px',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  });
  const numStyle = (bg) => ({
    ...sel(bg),
    width: '58px',
    textAlign: 'center',
  });

  const [s, setS] = useState({
    reachedOut: { a: 'yes', b: 'no' },
    communicated: { a: 'yes', b: 'yes' },
    generalDates: { a: '0', b: '0' },
    specificDates: { a: '3', b: '0' },
    moreAvailable: { a: 'no', b: 'yes' },
    usedPostpone: { a: 'no', b: 'yes' },
    noSub: { a: 'no', b: 'no' },
  });

  const upd = (field, team, val) => setS(prev => ({ ...prev, [field]: { ...prev[field], [team]: val } }));
  const yn = (field, team) => s[field][team] === 'yes';

  const mkSel = (field, team, bg) => (
    <select value={s[field][team]} onChange={e => upd(field, team, e.target.value)} style={sel(bg)}>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  );
  const mkNum = (field, team, bg) => (
    <input type="number" min="0" value={s[field][team]} onChange={e => upd(field, team, e.target.value)} style={numStyle(bg)} />
  );

  const rows = [
    { label: 'Reached out first with an offer (choose one team)', weight: 2, aEl: 'sel:reachedOut', bEl: 'sel:reachedOut', aScore: yn('reachedOut', 'a') ? 2 : 0, bScore: yn('reachedOut', 'b') ? 2 : 0 },
    { label: 'Communicated before the scheduling deadline', weight: 1, aEl: 'sel:communicated', bEl: 'sel:communicated', aScore: yn('communicated', 'a') ? 1 : 0, bScore: yn('communicated', 'b') ? 1 : 0 },
    { label: 'How many general date/time ranges offered more than a day ahead', weight: 1, aEl: 'num:generalDates', bEl: 'num:generalDates', aScore: Number(s.generalDates.a), bScore: Number(s.generalDates.b) },
    { label: 'How many specific dates and times offered more than a day ahead', weight: 2, aEl: 'num:specificDates', bEl: 'num:specificDates', aScore: Number(s.specificDates.a) * 2, bScore: Number(s.specificDates.b) * 2 },
    { label: 'More available than the other team over the whole week', weight: 2, aEl: 'sel:moreAvailable', bEl: 'sel:moreAvailable', aScore: yn('moreAvailable', 'a') ? 2 : 0, bScore: yn('moreAvailable', 'b') ? 2 : 0 },
    { label: 'Team used a postpone the previous week', weight: -1, aEl: 'sel:usedPostpone', bEl: 'sel:usedPostpone', aScore: yn('usedPostpone', 'a') ? -1 : 0, bScore: yn('usedPostpone', 'b') ? -1 : 0 },
    { label: 'Had 3 team members and chose not to play with a sub', weight: -3, aEl: 'sel:noSub', bEl: 'sel:noSub', aScore: yn('noSub', 'a') ? -3 : 0, bScore: yn('noSub', 'b') ? -3 : 0 },
  ];

  const renderEl = (code, team, bg) => {
    const [type, field] = code.split(':');
    return type === 'sel' ? mkSel(field, team, bg) : mkNum(field, team, bg);
  };

  const scoreA = rows.reduce((acc, r) => acc + r.aScore, 0);
  const scoreB = rows.reduce((acc, r) => acc + r.bScore, 0);

  return (
    <Box>
      <Text fontSize="md" fontWeight="800" color={colors.accentOrange} mb="3">Team Forfeit Calculator</Text>
      <Box overflowX="auto">
        <Box minW="640px">
          <HStack gap="0" mb="2px">
            <Box flex="1" bg={colors.bgSecondary} px="3" py="2" roundedTopLeft="lg" />
            <Box w="90px" textAlign="center" bg={colors.bgSecondary} px="1" py="2" fontSize="xs" fontWeight="700" color={colors.textPrimary}>Team A</Box>
            <Box w="90px" textAlign="center" bg={colors.bgSecondary} px="1" py="2" fontSize="xs" fontWeight="700" color={colors.textPrimary}>Team B</Box>
            <Box w="64px" textAlign="center" bg={colors.bgSecondary} px="1" py="2" fontSize="xs" fontWeight="700" color={colors.textMuted}>Weight</Box>
            <Box w="72px" textAlign="center" bg={colors.bgSecondary} px="1" py="2" fontSize="xs" fontWeight="700" color={colors.accentOrange}>A Pts</Box>
            <Box w="72px" textAlign="center" bg={colors.bgSecondary} px="1" py="2" fontSize="xs" fontWeight="700" color={colors.accentBlue} roundedTopRight="lg">B Pts</Box>
          </HStack>
          {rows.map((row, i) => {
            const bg = i % 2 === 0 ? colors.bgElevated : colors.bgSecondary;
            return (
              <HStack key={i} gap="0" mb="2px" align="stretch">
                <Box flex="1" bg={bg} px="3" py="2" display="flex" alignItems="center">
                  <Text fontSize="xs" color={colors.textSecondary}>{row.label}</Text>
                </Box>
                <Box w="90px" bg={bg} display="flex" alignItems="center" justifyContent="center">{renderEl(row.aEl, 'a', bg)}</Box>
                <Box w="90px" bg={bg} display="flex" alignItems="center" justifyContent="center">{renderEl(row.bEl, 'b', bg)}</Box>
                <Box w="64px" bg={bg} display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="sm" fontWeight="600" color={row.weight < 0 ? '#ef4444' : colors.textMuted}>{row.weight}</Text>
                </Box>
                <Box w="72px" bg={bg} display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="sm" fontWeight="700" color={colors.accentOrange}>{row.aScore}</Text>
                </Box>
                <Box w="72px" bg={bg} display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="sm" fontWeight="700" color={colors.accentBlue}>{row.bScore}</Text>
                </Box>
              </HStack>
            );
          })}
          <HStack gap="0" mt="2" align="stretch">
            <Box flex="1" px="3" py="2" display="flex" alignItems="center">
              <Text fontSize="sm" fontWeight="800" color={colors.textPrimary}>Totals</Text>
            </Box>
            <Box w="90px" /><Box w="90px" /><Box w="64px" />
            <Box w="72px" textAlign="center" bg={scoreA > scoreB ? '#16a34a' : colors.bgElevated} py="2" rounded="md" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xl" fontWeight="800" color={scoreA > scoreB ? '#fff' : colors.accentOrange}>{scoreA}</Text>
            </Box>
            <Box w="72px" textAlign="center" bg={scoreB > scoreA ? '#16a34a' : colors.bgElevated} py="2" rounded="md" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xl" fontWeight="800" color={scoreB > scoreA ? '#fff' : colors.accentBlue}>{scoreB}</Text>
            </Box>
          </HStack>
        </Box>
      </Box>
      {scoreA !== scoreB && (
        <Box mt="3" p="3" bg={colors.bgElevated} rounded="lg" border="1px solid" borderColor={`${colors.accentOrange}44`}>
          <Text fontSize="sm" color={colors.textSecondary}>
            <Text as="span" fontWeight="700" color={scoreA > scoreB ? colors.accentOrange : colors.accentBlue}>
              {scoreA > scoreB ? 'Team A' : 'Team B'}
            </Text>{' '}
            has a higher fault score and may be considered more responsible for the forfeit.
          </Text>
        </Box>
      )}
    </Box>
  );
};

const ServerScoreCalc = ({ colors }) => {
  const fieldStyle = (bg) => ({
    background: bg,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: '6px',
    padding: '3px 6px',
    fontSize: '13px',
    width: '64px',
    textAlign: 'center',
    outline: 'none',
  });

  const [pings, setPings] = useState({
    s1: { t1: ['20', '19', '18', '42'], t2: ['40', '70', '40', '40'] },
    s2: { t1: ['1', '99', '99', '99'], t2: ['250', '16', '16', '999'] },
  });

  const updPing = (server, team, idx, val) =>
    setPings(p => ({ ...p, [server]: { ...p[server], [team]: p[server][team].map((v, i) => i === idx ? val : v) } }));

  const avg = (vals) => {
    const nums = vals.map(v => v.trim()).filter(v => v !== '' && !isNaN(Number(v))).map(Number);
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
  };

  const serverScore = (srv) => {
    const a1 = avg(pings[srv].t1), a2 = avg(pings[srv].t2);
    return a1 !== null && a2 !== null ? Math.abs(a2 - a1) : null;
  };

  const s1 = serverScore('s1'), s2 = serverScore('s2');
  const recommended = s1 !== null && s2 !== null ? (s1 <= s2 ? 's1' : 's2') : null;

  const PingGrid = ({ server, team }) => {
    const bg = colors.bgSecondary;
    const a = avg(pings[server][team]);
    return (
      <VStack gap="1" align="center">
        {[0, 1, 2, 3].map(i => (
          <HStack key={i} gap="2">
            <Text fontSize="xs" color={colors.textMuted} w="32px">P {i + 1}</Text>
            <input
              type="text"
              placeholder="—"
              value={pings[server][team][i]}
              onChange={e => updPing(server, team, i, e.target.value)}
              style={fieldStyle(bg)}
            />
          </HStack>
        ))}
        <Text fontSize="xs" fontWeight="700" color={colors.textPrimary} mt="1">
          Avg: {a !== null ? a.toFixed(2) : '—'}
        </Text>
      </VStack>
    );
  };

  const ServerBlock = ({ srv, label }) => {
    const score = serverScore(srv);
    const isRec = recommended === srv;
    return (
      <Box flex="1" bg={colors.bgElevated} border="2px solid" borderColor={isRec ? '#16a34a' : colors.borderMedium} rounded="xl" p="4">
        <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} mb="3" textAlign="center">{label}</Text>
        <HStack gap="6" justify="center" align="start">
          <Box>
            <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="2" textAlign="center">Team 1</Text>
            <PingGrid server={srv} team="t1" />
          </Box>
          <Box>
            <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="2" textAlign="center">Team 2</Text>
            <PingGrid server={srv} team="t2" />
          </Box>
        </HStack>
        <Box mt="4" textAlign="center">
          <Text fontSize="xs" color={colors.textMuted}>Server Score</Text>
          <Text fontSize="2xl" fontWeight="900" color={isRec ? '#16a34a' : '#ef4444'}>
            {score !== null ? score.toFixed(2) : '—'}
          </Text>
          <Text fontSize="xs" fontWeight="700" color={isRec ? '#16a34a' : '#ef4444'}>
            {isRec ? '✓ Use this server' : '✗ Don\'t use this server'}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Text fontSize="md" fontWeight="800" color={colors.accentOrange} mb="1">Server Score Calculator</Text>
      <Text fontSize="xs" color={colors.textMuted} mb="3">Lower server score = more balanced pings = recommended server. Leave EU player pings blank.</Text>
      <HStack gap="4" align="start" flexWrap="wrap">
        <ServerBlock srv="s1" label="Server 1" />
        <ServerBlock srv="s2" label="Server 2" />
      </HStack>
    </Box>
  );
};

const MMRCalc = ({ colors }) => {
  const inputStyle = {
    background: colors.bgElevated,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: '6px',
    padding: '5px 8px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  };
  const smallInput = { ...inputStyle, width: '64px', textAlign: 'center' };

  const [settings, setSettings] = useState({ ls: 100, ss: 300, rs: 600 });
  const [ratings, setRatings] = useState({ a: 893, b: 892 });
  const [winner, setWinner] = useState('A');
  const [rounds, setRounds] = useState([
    { a: '13', b: '12' },
    { a: '12', b: '13' },
    { a: '13', b: '12' },
  ]);

  const updRound = (i, team, val) => setRounds(r => r.map((row, idx) => idx === i ? { ...row, [team]: val } : row));

  const calc = () => {
    const pA = 1 / (1 + Math.pow(10, (ratings.b - ratings.a) / (settings.rs / 10)));
    const validRounds = rounds.filter(r => r.a !== '' && r.b !== '');
    const avgDiff = validRounds.length
      ? validRounds.reduce((acc, r) => acc + Math.abs(Number(r.a) - Number(r.b)), 0) / validRounds.length
      : 0;
    const diffRatio = Math.min(avgDiff / 22, 1);
    const K = (settings.ls / 5) * diffRatio + (settings.ss / 15) * (1 - diffRatio);
    const aWin = winner === 'A' ? 1 : 0;
    const deltaA = Math.round(K * (aWin - pA));
    return {
      pA: Math.round(pA * 100),
      pB: Math.round((1 - pA) * 100),
      finalA: ratings.a + deltaA,
      finalB: ratings.b - deltaA,
      deltaA,
      deltaB: -deltaA,
    };
  };

  const res = calc();
  const lbl = { fontSize: '11px', color: colors.textMuted, marginBottom: '2px' };

  return (
    <Box>
      <Text fontSize="md" fontWeight="800" color={colors.accentOrange} mb="3">EML MMR Calculator</Text>
      <HStack gap="3" align="start" flexWrap="wrap">
        {/* Season Settings */}
        <Box minW="180px" flex="1" bg={colors.bgElevated} rounded="xl" p="4" border="1px solid" borderColor={colors.borderMedium}>
          <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="3" textTransform="uppercase" letterSpacing="wide">Season Settings</Text>
          {[
            { label: 'Large Score Diff Sensitivity', key: 'ls' },
            { label: 'Small Score Diff Sensitivity', key: 'ss' },
            { label: 'Rating Sensitivity Factor', key: 'rs' },
          ].map(({ label, key }) => (
            <Box key={key} mb="2">
              <p style={lbl}>{label}</p>
              <input type="number" value={settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: Number(e.target.value) }))} style={inputStyle} />
            </Box>
          ))}
          <HStack gap="1" mt="3">
            {[['S2', { ls: 100, ss: 300, rs: 600 }], ['S1', { ls: 100, ss: 300, rs: 900 }], ['BT', { ls: 100, ss: 400, rs: 2880 }]].map(([lbl2, cfg]) => (
              <Button key={lbl2} size="xs" variant="outline" color={colors.textMuted} borderColor={colors.borderMedium} onClick={() => setSettings(cfg)}>{lbl2}</Button>
            ))}
          </HStack>
        </Box>

        {/* Match Info */}
        <Box minW="180px" flex="1" bg={colors.bgElevated} rounded="xl" p="4" border="1px solid" borderColor={colors.borderMedium}>
          <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="3" textTransform="uppercase" letterSpacing="wide">Match Info</Text>
          <Box mb="2"><p style={lbl}>Team A Initial Rating</p><input type="number" value={ratings.a} onChange={e => setRatings(r => ({ ...r, a: Number(e.target.value) }))} style={inputStyle} /></Box>
          <Box mb="2"><p style={lbl}>Team B Initial Rating</p><input type="number" value={ratings.b} onChange={e => setRatings(r => ({ ...r, b: Number(e.target.value) }))} style={inputStyle} /></Box>
          <Box mb="3">
            <p style={lbl}>Team That Won</p>
            <select value={winner} onChange={e => setWinner(e.target.value)} style={inputStyle}>
              <option value="A">Team A</option>
              <option value="B">Team B</option>
            </select>
          </Box>
          <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="2" textTransform="uppercase" letterSpacing="wide">Round Scores</Text>
          {rounds.map((r, i) => (
            <HStack key={i} mb="2" gap="2" align="center">
              <Text fontSize="xs" color={colors.textMuted} minW="52px">Round {i + 1}</Text>
              <input type="number" min="0" max="25" placeholder="A" value={r.a} onChange={e => updRound(i, 'a', e.target.value)} style={smallInput} />
              <Text fontSize="xs" color={colors.textMuted}>—</Text>
              <input type="number" min="0" max="25" placeholder="B" value={r.b} onChange={e => updRound(i, 'b', e.target.value)} style={smallInput} />
              <Text fontSize="xs" color={colors.textMuted}>(optional)</Text>
            </HStack>
          ))}
        </Box>

        {/* Results */}
        <Box minW="180px" flex="1" bg={colors.bgElevated} rounded="xl" p="4" border="1px solid" borderColor={`${colors.accentOrange}66`}>
          <Text fontSize="xs" fontWeight="700" color={colors.textMuted} mb="3" textTransform="uppercase" letterSpacing="wide">Results</Text>
          <HStack justify="space-around" mb="4">
            <Box textAlign="center">
              <Text fontSize="xs" color={colors.textMuted}>P(A wins)</Text>
              <Text fontSize="3xl" fontWeight="900" color={colors.accentOrange}>{res.pA}%</Text>
            </Box>
            <Text fontSize="sm" color={colors.textMuted}>vs</Text>
            <Box textAlign="center">
              <Text fontSize="xs" color={colors.textMuted}>P(B wins)</Text>
              <Text fontSize="3xl" fontWeight="900" color={colors.accentBlue}>{res.pB}%</Text>
            </Box>
          </HStack>
          <Box p="3" bg={colors.bgSecondary} rounded="lg" mb="3">
            <HStack justify="space-between">
              <Box>
                <Text fontSize="xs" color={colors.textMuted}>Team A Final</Text>
                <Text fontSize="2xl" fontWeight="900" color={colors.accentOrange}>{res.finalA}</Text>
                <Text fontSize="sm" fontWeight="700" color={res.deltaA >= 0 ? '#16a34a' : '#ef4444'}>
                  {res.deltaA >= 0 ? '+' : ''}{res.deltaA}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" color={colors.textMuted}>Team B Final</Text>
                <Text fontSize="2xl" fontWeight="900" color={colors.accentBlue}>{res.finalB}</Text>
                <Text fontSize="sm" fontWeight="700" color={res.deltaB >= 0 ? '#16a34a' : '#ef4444'}>
                  {res.deltaB >= 0 ? '+' : ''}{res.deltaB}
                </Text>
              </Box>
            </HStack>
          </Box>
          <Text fontSize="10px" color={colors.textMuted}>
            Uses ELO-based formula. P = win probability. K scales with score difference and sensitivity factors.
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────
// TAB CONTENT COMPONENTS
// ─────────────────────────────────────────────────────────────────

const LeagueCalculatorsTab = ({ colors }) => (
  <VStack gap="8" align="stretch">
    <TeamForfeitCalc colors={colors} />
    <Box h="1px" bg={colors.borderMedium} />
    <ServerScoreCalc colors={colors} />
    <Box h="1px" bg={colors.borderMedium} />
    <MMRCalc colors={colors} />
  </VStack>
);

const BotInstructionsTab = ({ colors }) => (
  <VStack gap="0" align="stretch">
    <Box p="3" mb="4" bg={`${colors.accentOrange}18`} border="1px solid" borderColor={`${colors.accentOrange}44`} rounded="lg">
      <Text fontSize="sm" fontWeight="700" color={colors.accentOrange}>
        All commands should be run in the <Text as="span" fontFamily="mono">#bot-commands</Text> channel
      </Text>
    </Box>

    {BOT_INSTRUCTIONS.map((section, si) => (
      <Box key={si} mb="4" bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
        <Box px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
          <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wide">{section.section}</Text>
        </Box>
        <VStack gap="0" align="stretch">
          {section.items.map((item, ii) => (
            <HStack key={ii} gap="3" px="4" py="3" borderBottom={ii < section.items.length - 1 ? '1px solid' : 'none'} borderColor={colors.borderMedium} align="start">
              <Box
                bg={`${colors.accentOrange}22`}
                color={colors.accentOrange}
                px="2"
                py="0.5"
                rounded="md"
                fontSize="xs"
                fontWeight="700"
                fontFamily="mono"
                flexShrink="0"
                minW="max-content"
              >
                {item.cmd}
              </Box>
              <Text fontSize="sm" color={colors.textSecondary}>{item.desc}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    ))}

    {/* Change Player Name */}
    <Box mb="4" bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
      <Box px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
        <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wide">TO CHANGE YOUR PLAYER NAME</Text>
      </Box>
      <Box px="4" py="3" borderBottom="1px solid" borderColor={colors.borderMedium}>
        <Text fontSize="xs" fontWeight="700" color={colors.accentBlue} mb="2">For Captains:</Text>
        <VStack gap="1" align="stretch">
          {CHANGE_NAME_CAPTAIN.map((step, i) => (
            <HStack key={i} gap="2" align="start">
              <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} minW="18px">{i + 1}.</Text>
              <Text fontSize="sm" color={colors.textSecondary}>{step}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box px="4" py="3">
        <Text fontSize="xs" fontWeight="700" color={colors.accentBlue} mb="2">For Players:</Text>
        <VStack gap="1" align="stretch">
          {CHANGE_NAME_PLAYER.map((step, i) => (
            <HStack key={i} gap="2" align="start">
              <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} minW="18px">{i + 1}.</Text>
              <Text fontSize="sm" color={colors.textSecondary}>{step}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>

    {/* Change Team Name */}
    <Box mb="4" bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
      <Box px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
        <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wide">TO CHANGE YOUR TEAM NAME</Text>
      </Box>
      <Box px="4" py="3">
        <Text fontSize="xs" fontWeight="700" color={colors.accentBlue} mb="2">For Captains:</Text>
        <VStack gap="1" align="stretch">
          {CHANGE_TEAM_NAME_STEPS.map((step, i) => (
            <HStack key={i} gap="2" align="start">
              <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} minW="18px">{i + 1}.</Text>
              <Text fontSize="sm" color={colors.textSecondary}>{step}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  </VStack>
);

const CommandRow = ({ cmd, desc, colors, even }) => (
  <HStack gap="3" px="3" py="2.5" bg={even ? colors.bgElevated : colors.bgSecondary} align="start" borderBottom="1px solid" borderColor={`${colors.borderMedium}44`}>
    <Box
      bg={`${colors.accentOrange}22`}
      color={colors.accentOrange}
      px="2"
      py="0.5"
      rounded="md"
      fontSize="xs"
      fontWeight="700"
      fontFamily="mono"
      flexShrink="0"
      minW="max-content"
    >
      {cmd}
    </Box>
    <Text fontSize="sm" color={colors.textSecondary}>{desc}</Text>
  </HStack>
);

const BotCommandsTab = ({ colors }) => (
  <VStack gap="5" align="stretch">
    <Box bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
      <Box px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
        <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wide">General Commands</Text>
      </Box>
      {GENERAL_COMMANDS.map((c, i) => <CommandRow key={c.cmd} cmd={c.cmd} desc={c.desc} colors={colors} even={i % 2 === 0} />)}
    </Box>
    <Box bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
      <Box px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
        <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wide">League Management Commands</Text>
      </Box>
      {LEAGUE_COMMANDS.map((c, i) => <CommandRow key={c.cmd} cmd={c.cmd} desc={c.desc} colors={colors} even={i % 2 === 0} />)}
    </Box>
  </VStack>
);

const NACalendarTab = ({ colors }) => (
  <Box>
    <Box
      w="full"
      bg={colors.bgElevated}
      border="2px solid"
      borderColor={colors.accentOrange}
      rounded="xl"
      overflow="hidden"
      boxShadow={`0 0 24px ${colors.accentOrange}33`}
    >
      <Image
        src="https://echomasterleague.com/wp-content/uploads/2026/01/nacalendar.png"
        alt="EML NA League Calendar"
        w="full"
        h="auto"
        objectFit="contain"
      />
    </Box>
  </Box>
);

const StaffAppTab = ({ colors }) => (
  <Box maxW="480px" mx="auto" mt="8">
    <VStack gap="6" align="center" textAlign="center">
      <Box
        w="80px"
        h="80px"
        bg={`${colors.accentOrange}22`}
        rounded="2xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Users size={40} color={colors.accentOrange} />
      </Box>
      <VStack gap="2">
        <Text fontSize="2xl" fontWeight="900" color={colors.textPrimary}>EML Staff Application</Text>
        <Text fontSize="sm" color={colors.textMuted}>Interested in joining the EML staff team? Fill out the application form below.</Text>
      </VStack>
      <Box
        as="a"
        href="https://docs.google.com/forms/d/e/1FAIpQLSdSL3O9n-f4xYscugqHIhHOpvSLX-iKweQrogT3UX7MQkUCtQ/viewform?fbzx=-3252251367800928101&pli=1"
        target="_blank"
        rel="noopener noreferrer"
        display="block"
        w="full"
      >
        <Button
          w="full"
          size="lg"
          bg={colors.accentOrange}
          color="#fff"
          fontWeight="800"
          fontSize="md"
          _hover={{ bg: colors.accentOrange, opacity: 0.85, transform: 'scale(1.02)' }}
          transition="all 0.15s ease"
        >
          <ExternalLink size={18} />
          Open Staff Application Form
        </Button>
      </Box>
      <Text fontSize="xs" color={colors.textMuted}>Opens in Google Forms</Text>
    </VStack>
  </Box>
);

const TierBadge = ({ tier, colors }) => {
  const colorMap = {
    '1': '#6b7280', '2': '#f59e0b', '3': '#f97316',
    '4': '#ef4444', '5': '#dc2626', '6': '#7f1d1d', 'SC': '#8b5cf6',
  };
  return (
    <Box
      bg={`${colorMap[tier] || colors.accentOrange}22`}
      color={colorMap[tier] || colors.accentOrange}
      px="2"
      py="0.5"
      rounded="md"
      fontSize="xs"
      fontWeight="800"
      textAlign="center"
      minW="36px"
      flexShrink="0"
    >
      {tier === 'SC' ? 'SC' : `T${tier}`}
    </Box>
  );
};

const APSystemTab = ({ colors }) => (
  <VStack gap="6" align="stretch">
    {/* Intro */}
    <Box p="4" bg={colors.bgElevated} rounded="xl" border="1px solid" borderColor={colors.borderMedium}>
      <Text fontSize="sm" fontWeight="800" color={colors.accentOrange} mb="2">About the AP System</Text>
      <VStack gap="2" align="stretch">
        <Text fontSize="sm" color={colors.textSecondary}>
          League and gameplay violations are handled through an Accumulated Points (AP) system, where violations add up to different levels of action. Minor violations carry low point values; more serious violations carry higher values.
        </Text>
        <Text fontSize="sm" color={colors.textSecondary}>
          Gameplay violations such as halfcycling or cheat engine use will be reported to the Echo VR Lounge. Any action taken by EVRL will be considered for action in the EML AP system.
        </Text>
        <HStack gap="4" flexWrap="wrap" mt="1">
          <Text fontSize="xs" color={colors.textMuted}><Text as="span" fontWeight="700" color={colors.accentOrange}>AP Gameplay Violations</Text> — violations during active league game play or an official event.</Text>
          <Text fontSize="xs" color={colors.textMuted}><Text as="span" fontWeight="700" color={colors.accentBlue}>AP Non-Gameplay Violations</Text> — violations outside of active league game play.</Text>
        </HStack>
        <Text fontSize="xs" color={colors.textMuted} mt="1">
          Points expire in <Text as="span" fontWeight="700">180 days</Text>, but the action resulting from them continues until complete. Suspensions carry out for their full term and bans remain in place.
        </Text>
      </VStack>
    </Box>

    {/* Gameplay Violations */}
    <Box>
      <Text fontSize="sm" fontWeight="800" color={colors.accentOrange} mb="2">AP Gameplay Violations</Text>
      <Box bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
        <HStack gap="0">
          <Box w="52px" bg={colors.bgSecondary} px="2" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">Tier</Box>
          <Box w="120px" bg={colors.bgSecondary} px="2" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted}>Punishment</Box>
          <Box flex="1" bg={colors.bgSecondary} px="2" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted}>Explanation</Box>
          <Box w="50px" bg={colors.bgSecondary} px="2" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">AP</Box>
          <Box w="44px" bg={colors.bgSecondary} px="2" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">Who</Box>
        </HStack>
        {AP_GAMEPLAY.map((row, i) => (
          <HStack key={i} gap="0" borderTop="1px solid" borderColor={`${colors.borderMedium}66`} bg={i % 2 === 0 ? colors.bgElevated : colors.bgSecondary} align="start">
            <Box w="52px" px="2" py="2.5" display="flex" alignItems="flex-start" justifyContent="center" pt="3">
              <TierBadge tier={row.tier} colors={colors} />
            </Box>
            <Box w="120px" px="2" py="2.5">
              <Text fontSize="xs" fontWeight="700" color={colors.textPrimary}>{row.punishment}</Text>
            </Box>
            <Box flex="1" px="2" py="2.5">
              <Text fontSize="xs" color={colors.textSecondary}>{row.explanation}</Text>
              {row.comments && <Text fontSize="10px" color={colors.textMuted} mt="1" fontStyle="italic">{row.comments}</Text>}
            </Box>
            <Box w="50px" px="2" py="2.5" textAlign="center">
              <Text fontSize="xs" fontWeight="700" color={colors.accentOrange}>{row.apValue}</Text>
            </Box>
            <Box w="44px" px="2" py="2.5" textAlign="center">
              <Text fontSize="xs" color={colors.textMuted}>{row.responsible}</Text>
            </Box>
          </HStack>
        ))}
      </Box>
      <HStack gap="4" mt="2" flexWrap="wrap">
        <Text fontSize="10px" color={colors.textMuted}><Text as="span" fontWeight="700">+</Text> = minimum AP, additional AP likely</Text>
        <Text fontSize="10px" color={colors.textMuted}><Text as="span" fontWeight="700">P</Text> = Player(s) involved</Text>
        <Text fontSize="10px" color={colors.textMuted}><Text as="span" fontWeight="700">C</Text> = Captain/Co-captain</Text>
      </HStack>
    </Box>

    {/* Non-Gameplay Violations */}
    <Box>
      <Text fontSize="sm" fontWeight="800" color={colors.accentBlue} mb="2">AP Non-Gameplay Violations</Text>
      <VStack gap="3" align="stretch">
        {AP_NON_GAMEPLAY_TIERS.map((tier) => (
          <Box key={tier.label} bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
            <Box px="3" py="2" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium}>
              <Text fontSize="xs" fontWeight="800" color={colors.accentBlue}>{tier.label}</Text>
            </Box>
            <HStack gap="0">
              <Box flex="1" px="3" py="1.5" fontSize="10px" fontWeight="700" color={colors.textMuted}>Offense</Box>
              <Box w="50px" px="2" py="1.5" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">Rule</Box>
              <Box w="50px" px="2" py="1.5" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">AP</Box>
              <Box w="44px" px="2" py="1.5" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">Who</Box>
            </HStack>
            {tier.rows.map((row, i) => (
              <HStack key={i} gap="0" borderTop="1px solid" borderColor={`${colors.borderMedium}44`} bg={i % 2 === 0 ? colors.bgElevated : colors.bgSecondary} align="stretch">
                <Box flex="1" px="3" py="2.5"><Text fontSize="xs" color={colors.textSecondary}>{row.offense}</Text></Box>
                <Box w="50px" px="2" py="2.5" textAlign="center"><Text fontSize="xs" color={colors.textMuted}>{row.rule}</Text></Box>
                <Box w="50px" px="2" py="2.5" textAlign="center"><Text fontSize="xs" fontWeight="700" color={colors.accentOrange}>{row.ap}</Text></Box>
                <Box w="44px" px="2" py="2.5" textAlign="center"><Text fontSize="xs" color={colors.textMuted}>{row.who}</Text></Box>
              </HStack>
            ))}
          </Box>
        ))}
      </VStack>
      <Box mt="2" p="3" bg={`${colors.accentBlue}11`} rounded="lg" border="1px solid" borderColor={`${colors.accentBlue}33`}>
        <Text fontSize="10px" color={colors.textMuted}>All points values are subject to moderator discretion based on offense tier. If it cannot be determined which players on a roster were involved, the entire roster will be assigned AP.</Text>
      </Box>
    </Box>

    {/* AP Player Thresholds */}
    <Box>
      <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} mb="2">AP Player Thresholds</Text>
      <Box bg={colors.bgElevated} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderMedium}>
        <HStack gap="0">
          <Box w="72px" bg={colors.bgSecondary} px="3" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted} textAlign="center">Total AP</Box>
          <Box flex="1" bg={colors.bgSecondary} px="3" py="2" fontSize="10px" fontWeight="700" color={colors.textMuted}>Punishment</Box>
        </HStack>
        {AP_THRESHOLDS.map((row, i) => (
          <HStack key={i} gap="0" borderTop="1px solid" borderColor={`${colors.borderMedium}66`} bg={i % 2 === 0 ? colors.bgElevated : colors.bgSecondary}>
            <Box w="72px" px="3" py="2.5" textAlign="center">
              <Text fontSize="sm" fontWeight="900" color={row.points === '50' ? '#ef4444' : colors.accentOrange}>{row.points}</Text>
            </Box>
            <Box flex="1" px="3" py="2.5">
              <Text fontSize="sm" color={colors.textSecondary}>{row.punishment}</Text>
            </Box>
          </HStack>
        ))}
      </Box>
      <VStack gap="1" align="stretch" mt="3">
        {[
          'AP from an infraction expires 180 days after the time of the infraction.',
          'AP value increases by 2 for each repeat offense (e.g. base + 2 for 2nd offense, base + 4 for 3rd, etc.).',
          'If a moderator accumulates five AP, their moderator privileges will be revoked.',
        ].map((note, i) => (
          <Text key={i} fontSize="xs" color={colors.textMuted}>• {note}</Text>
        ))}
      </VStack>
    </Box>
  </VStack>
);

// ─────────────────────────────────────────────────────────────────
// ARCHIVED SEASONS DATA & COMPONENT
// ─────────────────────────────────────────────────────────────────

// Rank badge color helper
const getRankColor = (rank) => {
  if (!rank) return '#9ca3af';
  if (rank === 'Master') return '#fbbf24';
  if (rank.startsWith('Diamond')) return '#67e8f9';
  if (rank.startsWith('Platinum')) return '#c084fc';
  if (rank.startsWith('Gold')) return '#fb923c';
  return '#9ca3af';
};

const BTMMR_RANKINGS = [
  {rank:1,team:'Ignite',rating:1068,tier:'Master'},{rank:2,team:'200',rating:1004,tier:'Master'},{rank:3,team:'Redshift Esports',rating:951,tier:'Master'},{rank:4,team:'Yam Time',rating:940,tier:'Master'},{rank:5,team:'Frug',rating:932,tier:'Master'},
  {rank:6,team:'FLAPS',rating:930,tier:'Diamond 4'},{rank:7,team:'syzygy',rating:916,tier:'Diamond 4'},{rank:8,team:'W_Motion',rating:908,tier:'Diamond 4'},{rank:9,team:'GDK',rating:905,tier:'Diamond 4'},{rank:10,team:'Lightbulwb',rating:905,tier:'Diamond 4'},
  {rank:11,team:'Steez',rating:896,tier:'Diamond 3'},{rank:12,team:'unreliable',rating:885,tier:'Diamond 3'},{rank:13,team:'Disc Functional Halos',rating:871,tier:'Diamond 2'},{rank:14,team:'Plan C',rating:864,tier:'Diamond 1'},{rank:15,team:'Cherries On Top',rating:864,tier:'Diamond 1'},
  {rank:16,team:'Toxic',rating:858,tier:'Diamond 1'},{rank:17,team:'Pocket',rating:857,tier:'Diamond 1'},{rank:18,team:'Royal Ducks',rating:855,tier:'Diamond 1'},{rank:19,team:'Site 13',rating:848,tier:'Platinum 4'},{rank:20,team:'Bloom',rating:847,tier:'Platinum 4'},
  {rank:21,team:'Cerberus',rating:841,tier:'Platinum 4'},{rank:22,team:'X2A',rating:840,tier:'Platinum 4'},{rank:23,team:'Coast',rating:840,tier:'Platinum 4'},{rank:24,team:'Entropic Force',rating:837,tier:'Platinum 4'},{rank:25,team:'Embers',rating:830,tier:'Platinum 3'},
  {rank:26,team:'Cutest Telecommuters',rating:827,tier:'Platinum 3'},{rank:27,team:'MEN',rating:824,tier:'Platinum 3'},{rank:28,team:'Awaken',rating:819,tier:'Platinum 3'},{rank:29,team:'Armada',rating:817,tier:'Platinum 2'},{rank:30,team:'gods',rating:812,tier:'Platinum 2'},
  {rank:31,team:'Evolve',rating:807,tier:'Platinum 2'},{rank:32,team:'Trendsetters',rating:807,tier:'Platinum 2'},{rank:33,team:'Dragonfly',rating:806,tier:'Platinum 2'},{rank:34,team:'Crawl-Space',rating:805,tier:'Platinum 2'},{rank:35,team:'nebula',rating:804,tier:'Platinum 2'},
  {rank:36,team:'Fallen',rating:800,tier:'Platinum 1'},{rank:37,team:'Ace',rating:799,tier:'Platinum 1'},{rank:38,team:'Silly Billies',rating:798,tier:'Platinum 1'},{rank:39,team:'Rose',rating:798,tier:'Platinum 1'},{rank:40,team:'Tilted Towers',rating:796,tier:'Platinum 1'},
  {rank:41,team:'No Gravity',rating:792,tier:'Platinum 1'},{rank:42,team:'Nutter Butters',rating:792,tier:'Platinum 1'},{rank:43,team:'Destruction',rating:789,tier:'Platinum 1'},{rank:44,team:'Unstoppabulls',rating:785,tier:'Gold 4'},{rank:45,team:'Fallen Kings',rating:783,tier:'Gold 4'},
  {rank:46,team:'slap happy',rating:780,tier:'Gold 4'},{rank:47,team:'Till the End',rating:778,tier:'Gold 4'},{rank:48,team:'The Top Bananas',rating:777,tier:'Gold 4'},{rank:49,team:'Divine',rating:777,tier:'Gold 4'},{rank:50,team:'Lyfe',rating:777,tier:'Gold 4'},
  {rank:51,team:'Zero-G',rating:776,tier:'Gold 4'},{rank:52,team:'Serendipity',rating:775,tier:'Gold 4'},{rank:53,team:'Nameless',rating:774,tier:'Gold 4'},{rank:54,team:'25',rating:767,tier:'Gold 4'},{rank:55,team:'Firetruck',rating:763,tier:'Gold 4'},
  {rank:56,team:'Checkmate',rating:759,tier:'Gold 3'},{rank:57,team:'LOOKSMAXXERS',rating:753,tier:'Gold 3'},{rank:58,team:'Frost',rating:752,tier:'Gold 3'},{rank:59,team:'IRONY',rating:751,tier:'Gold 3'},{rank:60,team:'Vengeance',rating:751,tier:'Gold 3'},
  {rank:61,team:'Origin',rating:750,tier:'Gold 3'},{rank:62,team:'Reel 2 Reel',rating:747,tier:'Gold 3'},{rank:63,team:'REFLEX',rating:745,tier:'Gold 3'},{rank:64,team:'Rift',rating:744,tier:'Gold 3'},{rank:65,team:'Praise the Lord',rating:742,tier:'Gold 3'},
  {rank:66,team:'Paradox',rating:740,tier:'Gold 3'},{rank:67,team:'Swing or Get Swung',rating:739,tier:'Gold 3'},{rank:68,team:'Porch Pirates',rating:733,tier:'Gold 2'},{rank:69,team:"Kamiawookie's",rating:727,tier:'Gold 2'},{rank:70,team:'GRIM REAPERS',rating:725,tier:'Gold 2'},
  {rank:71,team:'Grim Tide',rating:724,tier:'Gold 2'},{rank:72,team:"Pick N' Flick",rating:721,tier:'Gold 2'},{rank:73,team:'Potentia',rating:717,tier:'Gold 2'},{rank:74,team:'Dragon Ball Z',rating:714,tier:'Gold 2'},{rank:75,team:'HORIZON',rating:708,tier:'Gold 2'},
  {rank:76,team:'The Cole4989',rating:693,tier:'Gold 1'},{rank:77,team:'Spacial Fusion',rating:689,tier:'Gold 1'},{rank:78,team:'VOLTAGE',rating:684,tier:'Gold 1'},{rank:79,team:'Kronos',rating:676,tier:'Gold 1'},{rank:80,team:"Slingin' Biscuits",rating:660,tier:'Gold 1'},{rank:81,team:"Etern1ty",rating:559,tier:'Gold 1'},
];

const BTMMR_ROSTERS = [
  {team:'Cerberus',captain:'Orthrua',members:['Feels_','Want','Funeral','Jakee-','OpaL1ght']},
  {team:'Ignite',captain:'Matheu',members:['Dwagin','KjtimpA','cole','Time-','Prize']},
  {team:'Ace',captain:'arcticsplash-',members:['Phantom','Highway-','CxshCarti']},
  {team:'W_Motion',captain:'BallinDawg34',members:['Balinbabs69','TickleJerk','BallinGecko69','BallinJJTripleOG']},
  {team:'Redshift Esports',captain:'TheLaw-',members:['Chrome','Swagwor_','Mozzy-','BigBOT_','Nips']},
  {team:'200',captain:'Ohnstuds',members:['n4rwh4le','Jaxxjh','ComradeMrBacon','Krogers','Camspin12']},
  {team:'Yam Time',captain:'Toki',members:['aero','Tusuna','Solarp','Milkyway','wa']},
  {team:'VOLTAGE',captain:'MOB_GUY',members:['Farsight_','Moxxie-','spaz','QuieT','Awesome_Abola']},
  {team:'Reel 2 Reel',captain:'Chowtown93',members:['Talldude1080','Odin0314','Everrest','SirBlur','Decay']},
  {team:'Till the End',captain:'The_precise1',members:['Jmbjmb98','Romeo','Kay_1220','alx_14','ophiuroid']},
  {team:'Trendsetters',captain:'Deadline',members:['LEFTNOSTRILL-','shake','Quanxi','Logic_','yesmarkramsey']},
  {team:'slap happy',captain:'kingkrip-',members:['boom-_','ZuckitZuckerberg','B00BIS','Bmo','person']},
  {team:'Embers',captain:'Cool-Whip',members:['Wiggles-','Paronym','Sam_0.0-','X','b love']},
  {team:'Frug',captain:'Raptured9',members:['Suprum','Beot','Ryanjs1020','Emptyi','PrinceXizor']},
  {team:'Dragon Ball Z',captain:'Gamma2-',members:['Casyn_06','Invincible-','Burnt-','moky','flighty']},
  {team:'Entropic Force',captain:'Snek-',members:['xyzzy-','Arch','MrMarcus04','WhiteDragon','TheOccamy']},
  {team:'Silly Billies',captain:'adore',members:['blackshoe4','Voltage Gaming','guinea2018','Maxieboi014','Mitchlle']},
  {team:'Lightbulwb',captain:'Shorty',members:['Razor','BrainBot07','babytru3','Layla','ducknub']},
  {team:'Armada',captain:'mrcake-',members:['Sinnoh','ItzDevil','Sova-_','alienq','Ion_ic']},
  {team:'unreliable',captain:'judah',members:['brady','chubs','randalff','Icy']},
  {team:'Grim Tide',captain:'GT_Ceriel',members:['BigTeo','Doon_']},
  {team:'Spacial Fusion',captain:'Spike4887',members:['Quackless','kornywitch','southernlydiscomfort','Panda_Cub25','falconjaksi']},
  {team:'Porch Pirates',captain:'Biggie-_',members:['Sock','Lilwimp-','Oasis-_-','Noctem','Broofy-']},
  {team:'Evolve',captain:'halfcourt',members:['Inferno-_','JJ_Lock','xKrispier_Friesx','SweetLyfe']},
  {team:'gods',captain:'ExSalaryMan',members:['HonoredOne','SorcererKiller','KingOfCurses']},
  {team:'Site 13',captain:'Semple',members:['Vix','Hyzer-','lightskinmurderman','Requiem','Daity']},
  {team:'Tilted Towers',captain:'Gooseskywalker',members:['MyGuyChromium','Publix','vrguy-']},
];

const S1_RANKINGS = [
  {rank:1,team:'Ignite',rating:1060,tier:'Master'},{rank:2,team:'Ghostmen',rating:944,tier:'Master'},{rank:3,team:'200',rating:941,tier:'Master'},{rank:4,team:'Forged',rating:937,tier:'Master'},{rank:5,team:'Goon Squad',rating:926,tier:'Master'},
  {rank:6,team:'quest',rating:917,tier:'Master'},{rank:7,team:'apples',rating:899,tier:'Diamond 4'},{rank:8,team:'Entropic Force',rating:892,tier:'Diamond 4'},{rank:9,team:'Yam Time',rating:881,tier:'Diamond 3'},{rank:10,team:'Redshift',rating:879,tier:'Diamond 3'},
  {rank:11,team:'Lurk',rating:878,tier:'Diamond 3'},{rank:12,team:'MitchIles EKittens',rating:871,tier:'Diamond 3'},{rank:13,team:'USAF',rating:866,tier:'Diamond 2'},{rank:14,team:'Awaken',rating:866,tier:'Diamond 2'},{rank:15,team:'Cerberus',rating:860,tier:'Diamond 2'},
  {rank:16,team:'syzygy',rating:856,tier:'Diamond 2'},{rank:17,team:'Frug',rating:851,tier:'Diamond 1'},{rank:18,team:'Brick',rating:843,tier:'Platinum 4'},{rank:19,team:'kitty meow meows',rating:841,tier:'Platinum 4'},{rank:20,team:'Disc Functional Halos',rating:839,tier:'Platinum 4'},
  {rank:21,team:'Blue Lock',rating:833,tier:'Platinum 4'},{rank:22,team:'Ball Barbers',rating:831,tier:'Platinum 4'},{rank:23,team:'The Wolfpack',rating:829,tier:'Platinum 4'},{rank:24,team:'Solar Strikers',rating:826,tier:'Platinum 3'},{rank:25,team:'GDK',rating:823,tier:'Platinum 3'},
  {rank:26,team:'zero',rating:823,tier:'Platinum 3'},{rank:27,team:'Ace',rating:819,tier:'Platinum 3'},{rank:28,team:'Tickle Time',rating:818,tier:'Platinum 3'},{rank:29,team:'Petting Zoo',rating:815,tier:'Platinum 3'},{rank:30,team:'Kittens',rating:815,tier:'Platinum 2'},
  {rank:31,team:'Infinity',rating:812,tier:'Platinum 2'},{rank:32,team:'Enigma',rating:807,tier:'Platinum 2'},{rank:33,team:'VOLTAGE',rating:806,tier:'Platinum 2'},{rank:34,team:'nuttybuddies',rating:806,tier:'Platinum 2'},{rank:35,team:'Trendsetters',rating:805,tier:'Platinum 2'},
  {rank:36,team:'Santas Little Helpers',rating:804,tier:'Platinum 2'},{rank:37,team:'Astro',rating:803,tier:'Platinum 2'},{rank:38,team:'The Powerpuff Girls',rating:800,tier:'Platinum 1'},{rank:39,team:'Paragon',rating:799,tier:'Platinum 1'},{rank:40,team:'No Gravity V2',rating:797,tier:'Platinum 1'},
  {rank:41,team:'Rebirth',rating:795,tier:'Platinum 1'},{rank:42,team:'Kangorillaz',rating:795,tier:'Platinum 1'},{rank:43,team:'Extra',rating:793,tier:'Platinum 1'},{rank:44,team:'AMR House',rating:790,tier:'Platinum 1'},{rank:45,team:'Electrolytes',rating:790,tier:'Platinum 1'},
  {rank:46,team:'On The Spot',rating:788,tier:'Gold 4'},{rank:47,team:'Hitbox',rating:787,tier:'Gold 4'},{rank:48,team:'PowerRangwers',rating:786,tier:'Gold 4'},{rank:49,team:'Spectral Surge',rating:786,tier:'Gold 4'},
];

const S1_ROSTERS = [
  {team:'200',captain:'Jaxxjh',members:['Krogers','Rias','aiden','mikey','n4rwh4le']},
  {team:'Apples',captain:'Lukeski',members:['Feels_','Jay','zekey']},
  {team:'Awaken',captain:'zMarc',members:['K1N3-','Augmenter','Enz','Lecaner']},
  {team:'Ball Barbers',captain:'Nanox',members:['iRazor','Sigma123','Vision','asphu']},
  {team:'Cerberus',captain:'Orthrua',members:['Alien','Ohnstuds','OpaL1ght']},
  {team:'Cringe',captain:'The_precise1',members:['Jmbjmb98','Alx_14','jag7274','ophiuroid','romeo']},
  {team:'Echoalition',captain:'Chuklz_Olot',members:['Nagini_-','BTHawk','MartianManTN','Panda_Cub25','dastammen']},
  {team:'Echoholics',captain:'SirCaptainSpoon',members:['Smoothridin','Bay53','abchew2','bracara','victoriashton']},
  {team:'Entourage',captain:'abcdefgh1jklmnop',members:['Bartstar','Jacob','hunterwildin','lxfny']},
  {team:'Entropic Force',captain:'MrMarcus04',members:['Snek-','Amanda_-','TheOccamy','WhiteDragon','xyzzy-']},
  {team:'FLAM35',captain:'Sloth',members:['Scootin_bootin','Brady','SOLO','yusuf']},
  {team:'Forged',captain:'X',members:['Coastermaster77','EpicSauce-','Paronym','Unknown-','sinnoh']},
  {team:'Formula 3',captain:'Kai',members:['Angel','BOT','BerZerK']},
  {team:'Frug',captain:'Raptured9',members:['ryanjs4','Beot','PrinceXizor','Suprumbuns']},
  {team:'Goon Squad',captain:'Dwagin',members:['Vipen','cole','oc','ryan.norton']},
  {team:'Ignite',captain:'matheu',members:['TheLaw-','KjtimpA','Swagwor_']},
  {team:'Lurk',captain:'whak',members:['Funeral','Spy','hunter','ko']},
  {team:'Mictlan',captain:'ItSilverZ',members:['w3lden5','DavLoy','GabAiz','UltraTMZ']},
  {team:'Mitchiles Ekittens',captain:'guinea2018',members:['Goofyy-','Moxxie-','requis']},
  {team:'Moonlit Black Cats',captain:'KyoKitsuneTenshi',members:['FROSTY_mbc','De-Focus','ItchyNutz','Smi1es-','rileywinter']},
  {team:'Parallax',captain:'sh0es-',members:['Synx','CanadianViper-','Mcdonalds']},
  {team:'RESTART',captain:'Wand_of_Sparking',members:['Igris','Juy_Guy','Shiloh']},
  {team:'REVIVE',captain:'The-Royal-Chef',members:['Langer','Gears','HeyyNayy','InDev-','smith']},
  {team:'Roid Rage',captain:'Kibo827',members:['Beast-','Brae-','elias']},
  {team:'Santas Little Helpers',captain:'biggiejones',members:['doofusinc','Billy','Dragon','jaws-']},
];

const S2_RANKINGS = [
  {rank:1,team:'200',rating:1005,tier:'Master'},{rank:2,team:'whatever',rating:931,tier:'Master'},{rank:3,team:'AETHER',rating:907,tier:'Diamond 4'},{rank:4,team:'Ignite',rating:905,tier:'Diamond 4'},{rank:5,team:'USAF',rating:891,tier:'Master'},
  {rank:6,team:'ALDI',rating:886,tier:'Diamond 4'},{rank:7,team:'Blunt Rollaz',rating:883,tier:'Diamond 4'},{rank:8,team:'Anomalington',rating:878,tier:'Diamond 4'},{rank:9,team:'mhm',rating:873,tier:'Diamond 3'},{rank:10,team:'GirlBoss',rating:866,tier:'Master'},
  {rank:11,team:'Mitchiles Ekittens',rating:860,tier:'Diamond 2'},{rank:12,team:'Blue-x',rating:860,tier:'Diamond 2'},{rank:13,team:'Cerberus',rating:856,tier:'Diamond 2'},{rank:14,team:'quest 2',rating:850,tier:'Diamond 1'},{rank:15,team:'Forged',rating:847,tier:'Master'},
  {rank:16,team:'Santas Little Helpers',rating:847,tier:'Diamond 1'},{rank:17,team:'buns',rating:837,tier:'Platinum 4'},{rank:18,team:'Chrome heart',rating:837,tier:'Platinum 4'},{rank:19,team:'creemie milk',rating:836,tier:'Platinum 4'},{rank:20,team:'V-2',rating:835,tier:'Platinum 4'},
  {rank:21,team:'W Motion',rating:833,tier:'Platinum 4'},{rank:22,team:'Gooses_N_Nooses',rating:831,tier:'Platinum 4'},{rank:23,team:'Mechanical brilliance',rating:818,tier:'Platinum 3'},{rank:24,team:'Grilled Cheese Obama Sandwich',rating:817,tier:'Platinum 3'},{rank:25,team:'Tech Support',rating:815,tier:'Platinum 3'},
  {rank:26,team:'Blue Lock',rating:806,tier:'Platinum 2'},{rank:27,team:'Interfectors',rating:806,tier:'Platinum 2'},{rank:28,team:'GDK',rating:806,tier:'Platinum 2'},{rank:29,team:'VOLTAGE',rating:805,tier:'Platinum 2'},{rank:30,team:'laststand',rating:804,tier:'Platinum 2'},
  {rank:31,team:'AOE',rating:804,tier:'Platinum 2'},{rank:32,team:'Silly Billies',rating:802,tier:'Platinum 2'},{rank:33,team:'Cringe',rating:798,tier:'Platinum 1'},{rank:34,team:'P5RCENT',rating:792,tier:'Platinum 1'},{rank:35,team:'Fabulous Flamingos',rating:791,tier:'Platinum 1'},
  {rank:36,team:'utopia',rating:786,tier:'Gold 4'},{rank:37,team:'etc',rating:781,tier:'Gold 4'},{rank:38,team:'mf doom',rating:779,tier:'Gold 4'},{rank:39,team:'ragebait',rating:778,tier:'Gold 4'},{rank:40,team:'Haven',rating:772,tier:'Gold 4'},
  {rank:41,team:'The Munchies',rating:771,tier:'Gold 3'},{rank:42,team:'Euphoria',rating:771,tier:'Gold 3'},{rank:43,team:'etc dot',rating:771,tier:'Gold 3'},{rank:44,team:'Dawnbringers',rating:770,tier:'Gold 3'},{rank:45,team:'Xforce',rating:768,tier:'Gold 3'},
  {rank:46,team:'Lethal Company Employees',rating:768,tier:'Gold 3'},{rank:47,team:'The Titanic Swim Team',rating:768,tier:'Gold 3'},{rank:48,team:'Entourage',rating:767,tier:'Gold 3'},{rank:49,team:'Corvus',rating:766,tier:'Gold 3'},{rank:50,team:'Lurk',rating:765,tier:'Gold 3'},
  {rank:51,team:'Formula 3',rating:765,tier:'Gold 3'},{rank:52,team:'Hadzabe Tribe',rating:764,tier:'Gold 3'},{rank:53,team:'X3D',rating:763,tier:'Gold 3'},{rank:54,team:'X-Men',rating:763,tier:'Gold 3'},{rank:55,team:'Cv1 Poopers',rating:762,tier:'Gold 3'},
  {rank:56,team:'Echoalition',rating:761,tier:'Gold 3'},{rank:57,team:'YNS',rating:758,tier:'Gold 3'},{rank:58,team:'Ancient Athletes',rating:756,tier:'Gold 3'},{rank:59,team:'fists of fury',rating:754,tier:'Gold 3'},{rank:60,team:'Naruto',rating:751,tier:'Gold 2'},
  {rank:61,team:'Echos Finest',rating:748,tier:'Gold 2'},{rank:62,team:'The Sunsets',rating:745,tier:'Gold 2'},{rank:63,team:'ONYX',rating:741,tier:'Gold 2'},{rank:64,team:'Spacial Fusion',rating:733,tier:'Gold 2'},{rank:65,team:'Low Expectations',rating:730,tier:'Gold 2'},
  {rank:66,team:'Echoteers',rating:727,tier:'Gold 2'},{rank:67,team:'Origin',rating:721,tier:'Gold 1'},{rank:68,team:'Parallax',rating:705,tier:'Gold 1'},{rank:69,team:'Dark Inferno',rating:671,tier:'Gold 1'},{rank:70,team:'SANTAS RIZZING LEGO BIKER GANG',rating:665,tier:'Gold 1'},
];

const S2_ROSTERS = [
  {team:'200',captain:'Jaxxjh',members:['Krogers','ComradeMrBacon','Carti','aiden','mikey']},
  {team:'Blue-x',captain:'Brady',members:['Aiden-x','Hyzer','Requiem','Rhinopillrager','Semple']},
  {team:'buns',captain:'JuicyFr',members:['Tyler','Finn-','Mas','Mountainous']},
  {team:'Cerberus',captain:'Orthrua',members:['Doon','Feels_','Festive','Funeral','OpaL1ght']},
  {team:'Chrome heart',captain:'Luv',members:['nya','Nagi','jack']},
  {team:'Cringe',captain:'Jmbjmb98',members:['romeo','Abel156','Alx_14','ophiuroid','shakeNbakeN-']},
  {team:'Echoalition',captain:'Chuklz_Olot',members:['Nagini_-','BTHawk','MartianManTN','Panda_Cub25','dastammen']},
  {team:'Echoteers',captain:'ryrytheflyguy',members:['BroxSlev','8B1t_Blitz-','ManWithNoName','Park','iSuBiEz']},
  {team:'etc dot',captain:'Ins1ght_',members:['Jor','fallaw','hunter']},
  {team:'Fabulous Flamingos',captain:'Encara-',members:['Ohnstuds','Scavar','iso','mahker']},
  {team:'Forged',captain:'XRawrs',members:['Coastermaster77','BigBOT_','Matt-','Paronym','acorn302']},
  {team:'GirlBoss',captain:'Cat',members:['dippedpotato','caroline','cole']},
  {team:'Gooses_N_Nooses',captain:'DuckwithDownSyndrome',members:['Juy_Guy','SYNOHawk','Wand_of_Sparking','groupofnuns']},
  {team:'Hadzabe Tribe',captain:'Bob',members:['Slothy','Darkscope5','Nocturne','splat261']},
  {team:'Interfectors',captain:'MilkyBoiVR',members:['Goessl','Parsec','mad','santi gimenez']},
  {team:'Mitchiles Ekittens',captain:'RicochetRobert94',members:['GangsterGeorge27','Band1t','Moxxie-','imgonnadoit','placementpeter70']},
  {team:'Parallax',captain:'Lowes-',members:['Synx','Home Depot','Pariah','niva-']},
  {team:'Santas Little Helpers',captain:'biggiejones',members:['doofusinc','Billy','Dragon','jaws-']},
  {team:'SANTAS RIZZING LEGO BIKER GANG',captain:'medium_fry',members:['myfriends_freakyy','Kibo827','Patriotic ghost']},
  {team:'Silly Billies',captain:'adore',members:['blackshoe4','Voltage Gaming','guinea2018','Maxieboi014','Mitchlle']},
  {team:'Spacial Fusion',captain:'spike4887',members:['QuackLess','AngelicSn1per','Devquan','memeC50','yesmarkramsey']},
  {team:'Tech Support',captain:'Ins1ght_',members:['Jor','fallaw','hunter']},
  {team:'The Titanic Swim Team',captain:'ryrytheflyguy',members:['BroxSlev','8B1t_Blitz-','ManWithNoName','Park']},
  {team:'V-2',captain:'V1ZIX',members:['Mountainous','Daiki Aomine','FDA-','Frosty','mbck13']},
  {team:'whatever',captain:'matheu',members:['Dwagin','Decay','Rev','kj','lowz']},
];

const S3_RANKINGS = [
  {rank:1,team:'chaos',rating:997,tier:'Master'},{rank:2,team:'200',rating:996,tier:'Master'},{rank:3,team:'Riptide',rating:928,tier:'Diamond 4'},{rank:4,team:'frug',rating:916,tier:'Master'},{rank:5,team:'quest 3',rating:893,tier:'Diamond 4'},
  {rank:6,team:'Dragon Slayers',rating:893,tier:'Diamond 4'},{rank:7,team:'Astral',rating:891,tier:'Diamond 4'},{rank:8,team:'Sesquipedalian',rating:890,tier:'Diamond 4'},{rank:9,team:'WLDCRD',rating:885,tier:'Master'},{rank:10,team:'Forged',rating:879,tier:'Master'},
  {rank:11,team:'Velocity',rating:852,tier:'Diamond 1'},{rank:12,team:'Ragnarok',rating:850,tier:'Diamond 1'},{rank:13,team:'Deceit',rating:849,tier:'Diamond 1'},{rank:14,team:'Mitchiles Ekittens',rating:846,tier:'Diamond 1'},{rank:15,team:'Zone Echo',rating:845,tier:'Diamond 1'},
  {rank:16,team:'Ravens',rating:834,tier:'Platinum 4'},{rank:17,team:'SEN',rating:831,tier:'Platinum 4'},{rank:18,team:'Renamed',rating:822,tier:'Platinum 3'},{rank:19,team:'Green-Bean',rating:821,tier:'Platinum 3'},{rank:20,team:'Lethal',rating:821,tier:'Platinum 3'},
  {rank:21,team:'Cream Squad',rating:815,tier:'Platinum 3'},{rank:22,team:'Generation',rating:814,tier:'Platinum 3'},{rank:23,team:'WBW',rating:812,tier:'Platinum 2'},{rank:24,team:'G-3',rating:808,tier:'Platinum 2'},{rank:25,team:'Frontier',rating:808,tier:'Platinum 2'},
  {rank:26,team:'Surge',rating:807,tier:'Platinum 2'},{rank:27,team:'Gooses_N_Nooses',rating:806,tier:'Platinum 2'},{rank:28,team:'The Kardashians',rating:806,tier:'Platinum 2'},{rank:29,team:'team name',rating:798,tier:'Platinum 1'},{rank:30,team:'Cerberus',rating:795,tier:'Platinum 1'},
  {rank:31,team:'Floaties',rating:794,tier:'Platinum 1'},{rank:32,team:'Artificial',rating:794,tier:'Platinum 1'},{rank:33,team:'Dystopia',rating:789,tier:'Gold 4'},{rank:34,team:'Fineapples',rating:787,tier:'Gold 4'},{rank:35,team:'Triple A',rating:786,tier:'Gold 4'},
  {rank:36,team:'Gooney Toons',rating:786,tier:'Gold 4'},{rank:37,team:'Blue-x',rating:784,tier:'Gold 4'},{rank:38,team:'awaken',rating:784,tier:'Gold 4'},{rank:39,team:'Povek',rating:781,tier:'Gold 4'},{rank:40,team:'The Bone Dust Bandits',rating:780,tier:'Gold 4'},
  {rank:41,team:'Tech Support',rating:777,tier:'Gold 4'},{rank:42,team:'Ctrl',rating:775,tier:'Gold 4'},{rank:43,team:'rubberduckies',rating:770,tier:'Gold 3'},{rank:44,team:'ABL',rating:769,tier:'Gold 3'},{rank:45,team:'placement',rating:767,tier:'Gold 3'},
  {rank:46,team:'BTW',rating:766,tier:'Gold 3'},{rank:47,team:'rebirth',rating:766,tier:'Gold 3'},{rank:48,team:'applsaus',rating:764,tier:'Gold 3'},{rank:49,team:'Spacial Fusion',rating:764,tier:'Gold 3'},{rank:50,team:'HMmm',rating:763,tier:'Gold 3'},
  {rank:51,team:'flake by c418',rating:762,tier:'Gold 3'},{rank:52,team:'Crosshairs',rating:760,tier:'Gold 3'},{rank:53,team:'Blue Lock',rating:757,tier:'Gold 3'},{rank:54,team:'Vegas',rating:756,tier:'Gold 3'},{rank:55,team:'Koi Fish',rating:747,tier:'Gold 2'},
  {rank:56,team:'Balance',rating:745,tier:'Gold 2'},{rank:57,team:'cabin crew simulator',rating:740,tier:'Gold 2'},{rank:58,team:'Parallax',rating:738,tier:'Gold 2'},{rank:59,team:'Paragon',rating:736,tier:'Gold 2'},{rank:60,team:'Echoalition',rating:735,tier:'Gold 2'},
  {rank:61,team:'nexus',rating:731,tier:'Gold 2'},{rank:62,team:'Dark Samurais',rating:727,tier:'Gold 2'},{rank:63,team:'BOOOOOOOOOOOOMshakalaka',rating:726,tier:'Gold 2'},{rank:64,team:'The Sproutlings',rating:724,tier:'Gold 2'},{rank:65,team:'Celestial',rating:721,tier:'Gold 2'},
  {rank:66,team:'Silly Billies',rating:720,tier:'Gold 2'},{rank:67,team:'Miroh',rating:717,tier:'Gold 1'},{rank:68,team:'SANTAS RIZZING LEGO BIKER GANG',rating:701,tier:'Gold 1'},
];

const S3_ROSTERS = [
  {team:'200',captain:'Jaxxjh',members:['Krogers','ComradeMrBacon','Rin','mikey','n4rwh4le']},
  {team:'Astral',captain:'XKing-',members:['ioah','Uzu-','manta','weep']},
  {team:'BOOOOOOOOOOOOMshakalaka',captain:'Medium_Fry',members:['Small_Fry','LeftNostrill','Nokk','Yuki-']},
  {team:'Cerberus',captain:'Orthrua',members:['Doon','Brady','Killerduderob-','OpaL1ght']},
  {team:'chaos',captain:'only',members:['Milkyway','Prize','Zu-Ko','kj','shinrii']},
  {team:'Dragon Slayers',captain:'PureCosmo',members:['Shush','Spin','Vipen']},
  {team:'Echoalition',captain:'Nagini_-',members:['Bass5','Panda_Cub25','Purpl3Princ3','dastammen']},
  {team:'Floaties',captain:'Jmbjmb98',members:['The_precise1','Abel156','Amanda_-','everest','shakeNbakeN-']},
  {team:'Forged',captain:'Coastermaster77',members:['Pause-','Matt-','Paronym','acorn302']},
  {team:'frug',captain:'ryanjs4',members:['Beot','Emptyi','PrinceXizor','Raptured9','Suprumbuns']},
  {team:'G-3',captain:'biggiejones',members:['doofusinc','Awesome On A Toaster','Billy','Nibblez-','mahker']},
  {team:'Generation',captain:'Akashi-',members:['Daiki Aomine','Kuroko-','Murasakibara_','babytru3','linky']},
  {team:'Gooses_N_Nooses',captain:'DuckwithDownSyndrome',members:['Juy_Guy','Kibo827','Wand_of_Sparking','alyssaaaa','groupofnuns']},
  {team:'Green-Bean',captain:'KARA',members:['Bob','D4RK_VR666','Zain','crusader']},
  {team:'Interfectors',captain:'MilkyBoiVR',members:['Goessl','Parsec','mad','santi gimenez']},
  {team:'Koi Fish',captain:'Special-Man',members:['Slothy','D4rk','ZestyBoyAdam']},
  {team:'Lethal',captain:'lulu-',members:['DarkArrow-','Deadline','Seann-','bbtitan1','dumplin']},
  {team:'Miroh',captain:'ZombieMagikarp1',members:['Sam_00-','Chrxs','DaveJTuck']},
  {team:'Mitchiles Ekittens',captain:'ImportantIvan88',members:['Band1t','EssentialEvan70','FundamentalFinn61']},
  {team:'Riptide',captain:'Spirit',members:['cole','Chrome','Rivoltra','ryan.norton']},
  {team:'Sesquipedalian',captain:'Decay',members:['EpicDeathHawk55','EpicSauce-','GhostDuck','Hollow-','jack']},
  {team:'Spacial Fusion',captain:'spike4887',members:['QuackLess','AngelicSn1per','Devquan','memeC50','yesmarkramsey']},
  {team:'Surge',captain:'IceBergg12',members:['BaltiBro','Blitz_05','fasf_on_fent','legxnd']},
  {team:'Triple A',captain:'-Dem0n h3x-',members:['Synx','Pz','greflin','monarch','viva']},
  {team:'Velocity',captain:'Ry-',members:['Tylr','Aweigh','ConnerCC','Triumph']},
  {team:'WLDCRD',captain:'sinnoh',members:['Fletcherus','Ryruff','gtyler-','hunaveli','insight']},
  {team:'Zone Echo',captain:'DarTerrorPeanut',members:['sam','This Is A Joke','jag7274','waffledlife','zMarc']},
];

// ── Rankings Table ──
const RankingsTable = ({ data, colors }) => {
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? data : data.slice(0, 20);
  return (
    <Box>
      <Box overflowX="auto">
        <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
          <Box as="thead">
            <Box as="tr" bg={colors.bgSecondary}>
              {['#','Team','Rating','Rank'].map((h) => (
                <Box key={h} as="th" px="3" py="2" fontSize="10px" fontWeight="800" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider" textAlign={h === 'Rating' ? 'right' : 'left'}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box as="tbody">
            {visible.map((row, i) => (
              <Box as="tr" key={row.rank} bg={i < 3 ? `${colors.accentOrange}0d` : 'transparent'} _hover={{ bg: `${colors.textPrimary}08` }} style={{ transition: 'background 0.15s' }}>
                <Box as="td" px="3" py="2" fontSize="sm" fontWeight="700" color={colors.textMuted} w="40px">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : row.rank}
                </Box>
                <Box as="td" px="3" py="2" fontSize="sm" fontWeight="700" color={i < 3 ? colors.accentOrange : colors.textPrimary}>{row.team}</Box>
                <Box as="td" px="3" py="2" fontSize="sm" color={colors.textSecondary} textAlign="right">{row.rating}</Box>
                <Box as="td" px="3" py="2">
                  <Box as="span" px="2" py="0.5" rounded="full" fontSize="11px" fontWeight="700" style={{ background: `${getRankColor(row.tier)}22`, color: getRankColor(row.tier) }}>{row.tier}</Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {data.length > 20 && (
        <Box as="button" mt="2" mx="3" mb="1" px="3" py="1.5" fontSize="xs" fontWeight="600" color={colors.accentOrange} border="1px solid" borderColor={`${colors.accentOrange}44`} rounded="lg" bg="transparent" cursor="pointer" onClick={() => setShowAll(v => !v)}>
          {showAll ? `Show Top 20 ▲` : `Show All ${data.length} Teams ▼`}
        </Box>
      )}
    </Box>
  );
};

// ── Rosters Grid ──
const RostersGrid = ({ data, colors }) => {
  const active = data.filter(t => t.members.some(m => m));
  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap="3" p="3">
      {active.map((t) => (
        <Box key={t.team} bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium} rounded="xl" p="3">
          <Text fontSize="sm" fontWeight="800" color={colors.accentOrange} mb="1">{t.team}</Text>
          <Text fontSize="xs" color={colors.textMuted} mb="1.5">👑 {t.captain}</Text>
          <VStack align="stretch" gap="0.5">
            {t.members.filter(Boolean).map((m, i) => (
              <Text key={i} fontSize="xs" color={colors.textSecondary}>· {m.trim()}</Text>
            ))}
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

// ── Season data panel ──
const SeasonPanel = ({ season, colors }) => {
  const [view, setView] = React.useState(null);
  const tabs = [];
  if (season.rankings) tabs.push({ key: 'rankings', label: '🏆 Rankings' });
  if (season.rosters) tabs.push({ key: 'rosters', label: '👥 Rosters' });
  if (season.bracketUrl) tabs.push({ key: 'bracket', label: '🎯 Bracket' });

  return (
    <Box>
      <HStack gap="2" p="3" flexWrap="wrap">
        {tabs.map(tab => (
          <Box
            key={tab.key}
            as="button"
            px="3" py="1.5"
            bg={view === tab.key ? `${season.badgeColor}22` : colors.bgSecondary}
            border="1px solid"
            borderColor={view === tab.key ? season.badgeColor : colors.borderMedium}
            rounded="lg"
            fontSize="xs"
            fontWeight="600"
            color={view === tab.key ? season.badgeColor : colors.textSecondary}
            cursor="pointer"
            transition="all 0.15s"
            onClick={() => setView(v => v === tab.key ? null : tab.key)}
          >
            {tab.label}
          </Box>
        ))}
        {season.bracketUrl && (
          <Box
            as="a"
            href={season.bracketUrl}
            target="_blank"
            rel="noopener noreferrer"
            px="3" py="1.5"
            bg={colors.bgSecondary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="lg"
            fontSize="xs"
            fontWeight="600"
            color={colors.textSecondary}
            display="inline-flex"
            alignItems="center"
            gap="1"
          >
            <GitBranch size={12} /> View Bracket <ExternalLink size={10} />
          </Box>
        )}
      </HStack>
      {view === 'rankings' && season.rankings && (
        <Box borderTop="1px solid" borderColor={colors.borderMedium}>
          <RankingsTable data={season.rankings} colors={colors} />
        </Box>
      )}
      {view === 'rosters' && season.rosters && (
        <Box borderTop="1px solid" borderColor={colors.borderMedium}>
          <RostersGrid data={season.rosters} colors={colors} />
        </Box>
      )}
    </Box>
  );
};

const ARCHIVED_SEASONS = [
  {
    id: 'btmmr',
    label: 'BTMMR Preseason',
    year: '2024',
    badge: 'Preseason',
    badgeColor: '#8b5cf6',
    description: 'Break the MMR — the inaugural EML preseason tournament.',
    champion: '🥇 Ignite  ·  🥈 Redshift Esports',
    bracketUrl: 'https://challonge.com/iw14x5kx',
    rankings: BTMMR_RANKINGS,
    rosters: BTMMR_ROSTERS,
  },
  {
    id: 's1',
    label: 'Season 1 NA',
    year: '2024',
    badge: 'Season 1',
    badgeColor: '#f59e0b',
    description: 'The first official EML season.',
    champion: '🥇 Ignite',
    rankings: S1_RANKINGS,
    rosters: S1_ROSTERS,
  },
  {
    id: 's2',
    label: 'Season 2 NA',
    year: '2024',
    badge: 'Season 2',
    badgeColor: '#f97316',
    description: 'The second EML season.',
    champion: '🥇 200',
    bracketUrl: 'https://challonge.com/EML_Season_2_Finals',
    rankings: S2_RANKINGS,
    rosters: S2_ROSTERS,
  },
  {
    id: 's3',
    label: 'Season 3 NA',
    year: '2025',
    badge: 'Season 3',
    badgeColor: '#ef4444',
    description: 'The third EML season.',
    champion: '🥇 chaos  ·  🥈 200',
    rankings: S3_RANKINGS,
    rosters: S3_ROSTERS,
  },
];

const ArchivedSeasonsTab = ({ colors }) => (
  <VStack gap="5" align="stretch">
    <Box p="3" bg={`${colors.accentOrange}11`} border="1px solid" borderColor={`${colors.accentOrange}33`} rounded="lg">
      <Text fontSize="sm" color={colors.textMuted}>
        Browse rankings and rosters from all past EML seasons. Click the buttons to expand data inline.
      </Text>
    </Box>
    {ARCHIVED_SEASONS.map((season) => (
      <Box key={season.id} bg={colors.bgElevated} border="1px solid" borderColor={colors.borderMedium} rounded="xl" overflow="hidden">
        <HStack px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium} gap="3" flexWrap="wrap">
          <Box bg={`${season.badgeColor}22`} color={season.badgeColor} px="2.5" py="0.5" rounded="full" fontSize="xs" fontWeight="800" letterSpacing="wide" flexShrink="0">
            {season.badge}
          </Box>
          <Box flex="1">
            <Text fontSize="md" fontWeight="800" color={colors.textPrimary}>{season.label}</Text>
            <Text fontSize="xs" color={colors.textMuted}>{season.year} · {season.description}</Text>
            {season.champion && (
              <Text fontSize="xs" color={season.badgeColor} fontWeight="700" mt="0.5">{season.champion}</Text>
            )}
          </Box>
        </HStack>
        <SeasonPanel season={season} colors={colors} />
      </Box>
    ))}
  </VStack>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'calculators', label: 'League Calculators', icon: Calculator },
  { id: 'bot-instructions', label: 'EML Bot Instructions', icon: BookOpen },
  { id: 'bot-commands', label: 'EML Bot Commands', icon: Bot },
  { id: 'calendar', label: 'NA Calendar', icon: CalendarDays },
  { id: 'staff-app', label: 'Staff Application', icon: Users },
  { id: 'ap-system', label: 'AP System', icon: Shield },
  { id: 'archived', label: 'Archived Seasons', icon: Archive },
];

const ResourcesView = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const [activeTab, setActiveTab] = useState('calculators');

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="1200px"
            w="96vw"
            maxH="92vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Dialog.Header
              bg={`${colors.bgPrimary}ee`}
              borderBottom="1px solid"
              borderColor={colors.borderMedium}
              py="0"
              px="0"
              flexShrink="0"
            >
              {/* Title row */}
              <HStack justify="space-between" px="5" py="3" borderBottom="1px solid" borderColor={colors.borderMedium}>
                <HStack gap="2">
                  <FileText size={18} color={colors.accentOrange} />
                  <Dialog.Title fontSize="lg" fontWeight="800" color={colors.textPrimary}>
                    Resources
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={colors.textSecondary} _hover={{ color: colors.textPrimary }} />
                </Dialog.CloseTrigger>
              </HStack>

              {/* Tab buttons */}
              <HStack
                gap="0"
                overflowX="auto"
                px="2"
                py="1"
                style={{ scrollbarWidth: 'none' }}
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveTab(tab.id)}
                      color={isActive ? colors.accentOrange : colors.textSecondary}
                      bg={isActive ? `${colors.accentOrange}18` : 'transparent'}
                      borderBottom={isActive ? `2px solid ${colors.accentOrange}` : '2px solid transparent'}
                      borderRadius="0"
                      px="3"
                      py="2"
                      h="auto"
                      fontWeight={isActive ? '700' : '500'}
                      fontSize="xs"
                      flexShrink="0"
                      _hover={{ bg: `${colors.accentOrange}11`, color: colors.accentOrange }}
                      transition="all 0.15s ease"
                    >
                      <HStack gap="1.5">
                        <Icon size={13} />
                        <Text>{tab.label}</Text>
                      </HStack>
                    </Button>
                  );
                })}
              </HStack>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body p="5" overflowY="auto" flex="1">
              {activeTab === 'calculators' && <LeagueCalculatorsTab colors={colors} />}
              {activeTab === 'bot-instructions' && <BotInstructionsTab colors={colors} />}
              {activeTab === 'bot-commands' && <BotCommandsTab colors={colors} />}
              {activeTab === 'calendar' && <NACalendarTab colors={colors} />}
              {activeTab === 'staff-app' && <StaffAppTab colors={colors} />}
              {activeTab === 'ap-system' && <APSystemTab colors={colors} />}
              {activeTab === 'archived' && <ArchivedSeasonsTab colors={colors} />}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ResourcesView;
