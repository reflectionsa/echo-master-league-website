import React, { useState } from 'react';
import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Image, Badge } from '@chakra-ui/react';
import { Calculator, BookOpen, Bot, CalendarDays, Users, Shield, ExternalLink, Terminal, FileText, Archive, Trophy, BarChart2, ScrollText } from 'lucide-react';
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

const ARCHIVED_SEASONS = [
  {
    id: 'btmmr',
    label: 'BTMMR Preseason',
    year: '2024',
    badge: 'Preseason',
    badgeColor: '#8b5cf6',
    description: 'Break the MMR — the inaugural EML preseason tournament.',
    links: [
      { label: 'Season Hub', url: 'https://echomasterleague.com/2024-break-the-mmr-tournament-preseason/', icon: 'hub' },
      { label: 'Team Rankings', url: 'https://echomasterleague.com/2024-btmmr-team-rankings/', icon: 'rankings' },
      { label: 'Team Rosters', url: 'https://echomasterleague.com/2024-btmmr-team-rosters/', icon: 'rosters' },
      { label: 'Matches & Results', url: 'https://echomasterleague.com/2024-btmmr-season-matches-and-results/', icon: 'matches' },
    ],
  },
  {
    id: 's1',
    label: 'Season 1 NA',
    year: '2024',
    badge: 'Season 1',
    badgeColor: '#f59e0b',
    description: 'The first official EML season.',
    links: [
      { label: 'Season Hub', url: 'https://echomasterleague.com/season-1/', icon: 'hub' },
      { label: 'Team Rankings', url: 'https://echomasterleague.com/2024-season-1-team-rankings/', icon: 'rankings' },
      { label: 'Team Rosters', url: 'https://echomasterleague.com/2024-season-1-team-rosters/', icon: 'rosters' },
      { label: 'Team Statistics', url: 'https://echomasterleague.com/2024-season-1-team-statistics/', icon: 'stats' },
      { label: 'Registered Players', url: 'https://echomasterleague.com/2024-season-1-registered-players/', icon: 'players' },
      { label: 'League Subs', url: 'https://echomasterleague.com/2024-season-1-registered-league-subs/', icon: 'subs' },
    ],
  },
  {
    id: 's2',
    label: 'Season 2 NA',
    year: '2024',
    badge: 'Season 2',
    badgeColor: '#f97316',
    description: 'The second EML season.',
    links: [
      { label: 'Season Hub', url: 'https://echomasterleague.com/2024-season-2-na/', icon: 'hub' },
      { label: 'Team Rankings', url: 'https://echomasterleague.com/2024-season-2-team-rankings/', icon: 'rankings' },
      { label: 'Team Rosters', url: 'https://echomasterleague.com/2024-season-2-team-rosters/', icon: 'rosters' },
      { label: 'Team Statistics', url: 'https://echomasterleague.com/2024-season-2-team-statistics/', icon: 'stats' },
      { label: 'Registered Players', url: 'https://echomasterleague.com/2024-season-2-registered-players/', icon: 'players' },
      { label: 'League Subs', url: 'https://echomasterleague.com/2024-season-2-registered-league-subs/', icon: 'subs' },
    ],
  },
  {
    id: 's3',
    label: 'Season 3 NA',
    year: '2025',
    badge: 'Season 3',
    badgeColor: '#ef4444',
    description: 'The third EML season.',
    links: [
      { label: 'Season Hub', url: 'https://echomasterleague.com/2025-season-3-na/', icon: 'hub' },
      { label: 'Team Rankings', url: 'https://echomasterleague.com/2025-season-3-team-rankings/', icon: 'rankings' },
      { label: 'Team Rosters', url: 'https://echomasterleague.com/2025-season-3-team-rosters/', icon: 'rosters' },
      { label: 'Team Statistics', url: 'https://echomasterleague.com/2025-season-3-team-statistics/', icon: 'stats' },
      { label: 'Registered Players', url: 'https://echomasterleague.com/2025-season-3-registered-players/', icon: 'players' },
      { label: 'League Subs', url: 'https://echomasterleague.com/2025-season-3-registered-league-subs/', icon: 'subs' },
    ],
  },
];

const linkIcon = (icon, color) => {
  const size = 13;
  if (icon === 'hub') return <ScrollText size={size} color={color} />;
  if (icon === 'rankings') return <Trophy size={size} color={color} />;
  if (icon === 'rosters') return <Users size={size} color={color} />;
  if (icon === 'stats') return <BarChart2 size={size} color={color} />;
  if (icon === 'matches') return <CalendarDays size={size} color={color} />;
  return <ExternalLink size={size} color={color} />;
};

const ArchivedSeasonsTab = ({ colors }) => (
  <VStack gap="5" align="stretch">
    <Box p="3" bg={`${colors.accentOrange}11`} border="1px solid" borderColor={`${colors.accentOrange}33`} rounded="lg">
      <Text fontSize="sm" color={colors.textMuted}>
        Browse stats, rosters, and results from all past EML seasons. Links open on the official EML website.
      </Text>
    </Box>
    {ARCHIVED_SEASONS.map((season) => (
      <Box key={season.id} bg={colors.bgElevated} border="1px solid" borderColor={colors.borderMedium} rounded="xl" overflow="hidden">
        {/* Season header */}
        <HStack px="4" py="3" bg={colors.bgSecondary} borderBottom="1px solid" borderColor={colors.borderMedium} gap="3">
          <Box
            bg={`${season.badgeColor}22`}
            color={season.badgeColor}
            px="2.5"
            py="0.5"
            rounded="full"
            fontSize="xs"
            fontWeight="800"
            letterSpacing="wide"
          >
            {season.badge}
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="800" color={colors.textPrimary}>{season.label}</Text>
            <Text fontSize="xs" color={colors.textMuted}>{season.year} · {season.description}</Text>
          </Box>
        </HStack>
        {/* Links grid */}
        <Box p="3">
          <HStack gap="2" flexWrap="wrap">
            {season.links.map((link) => (
              <Box
                key={link.label}
                display="inline-flex"
                alignItems="center"
                gap="1.5"
                px="3"
                py="1.5"
                bg={colors.bgSecondary}
                border="1px solid"
                borderColor={colors.borderMedium}
                rounded="lg"
                fontSize="xs"
                fontWeight="600"
                color={colors.textSecondary}
              >
                {linkIcon(link.icon, 'currentColor')}
                {link.label}
              </Box>
            ))}
          </HStack>
        </Box>
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
