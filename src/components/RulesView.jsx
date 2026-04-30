import { useState, useMemo } from 'react';
import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Input, Badge, Accordion } from '@chakra-ui/react';
import { FileText, ExternalLink, Search, X, ChevronDown } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const RULES_SECTIONS = [
  {
    title: 'League Member Code of Conduct',
    items: [
      'Play fairly and within the rules of the Echo Master League.',
      'Treat your fellow gamers, teammates, competitors, spectators, and League officials with respect and dignity.',
      'Discriminatory language, hate speech, threats, doxxing, and other forms of harassment or unlawful behavior will not be tolerated.',
      'Team Captains may be held responsible for their team\'s behavior.',
      'Accusations of impropriety or foul play are taken seriously and should be brought to the attention of the league administration.',
      'The minimum age requirement is 13.',
    ],
  },
  {
    title: 'Regions & Participation Requirements',
    items: [
      'EML does not have region requirements to play.',
      'In the event of disagreement, scheduling and server priority will be given to the North America players.',
      'Ping cap is set at 150 for all players.',
      'If a player\'s ping is continually higher than the ping cap, they are no longer eligible to play in the match, and must be replaced with another player (either a different rostered player or a League Substitute) whose ping is within acceptable limits. If both teams agree, the match may be played on a different server in order to lower the offending player\'s ping to within acceptable limits.',
      'When the situation is unclear, the pause button should be pressed and a League Moderator invited to the match to make a ruling. If the teams continue to play without informing a League Moderator, the conditions under which the match is played are considered to be accepted by both team captains and the result will be valid.',
      'If a player on a team is in violation of the ping cap, they should pause the match and fix the issue. If the team with high ping does not pause, the other team may pause and request a Moderator be brought into the match. In this case, the team with high ping will use their mid-round pause.',
      'If a moderator is brought in to assess ping complaints and finds no problems, the pause used to call the mod will be counted as the legal pause for the team that brought the moderator in.',
      'League mods may not arbitrate or spectate a match without permission if they are a member of one of the teams.',
      'If a League Moderator does not respond to your ticket request for ping monitoring within 15 minutes, continue play.',
      'To contest the results of a match after it ends, evidence will need to be provided in a ticket.',
      'Tickets of this nature will only be considered if an official request was made for a League Moderator to come into the match to monitor ping, by the members of the competing teams, while the match was being played, and no League Moderator responded within 15 minutes of the posting of the request.',
      'If evidence does not indicate a ping problem (e.g. a screenshot of high ping is insufficient, and could just be a spike), the pause taken to address this issue is still permitted. However, if the opposing team opens a ticket and is able to show evidence that the reporting team paused under the pretense of needing mod assistance but actually just wanted an extra pause, AP will be assigned for the illegal pause(s).',
      'If play was paused to address ping cap issues and no action was taken by the teams to either substitute out the offending player(s) or switch servers, points penalties may be assigned for each instance of lag the League Moderators deem to have affected play, based on any relevant video evidence provided.',
      'If a player has to be replaced during a match due to a violation of the Ping Cap rule, the team needing a replacement must use a timeout. The pause in this instance may be extended up to 15 minutes. If the allotted 15 minutes passes without a replacement player having joined the match, the round must resume with 3 or the offending team forfeits one round. If another 15 minutes passes without play resuming, the offending team forfeits two rounds.',
      'Once a match has entered the arena, ping-related pauses supersede no-show timing rules.',
    ],
  },
  {
    title: 'Matches Organization',
    items: [
      'The League will publish the week\'s matches on or around each Sunday about midnight Eastern Time of each week of the regular season.',
      'When weekly matches are generated, any active team with fewer than four (4) rostered players will not receive assigned matches.',
      'Teams are responsible for scheduling their matches. EML recommends the use of a scheduling tool like LettuceMeet or When2Meet.',
      'Once assigned matches are given, teams must communicate using Discord (EML server, team servers, DMs) to schedule their matches. If the match date and time have not been agreed to by Friday 12:00 pm EST, they must start a League Ticket for moderator assistance.',
      'Teams must agree to the date and time in writing AND enter the match with the EML bot before the match.',
      'Matches (and any league substitutes used) must be scheduled via the bot.',
      'Matches must be scheduled prior to their start time.',
      'A match\'s scores must be submitted within 24 hours of its scheduled start time. If a team is unresponsive after 24 hours then staff may enter the match as a forfeit against the unresponsive team.',
      'All matches must be played and have the scores submitted by Sunday Midnight Eastern Time.',
      'Teams are responsible for reporting the correct scores on the website. Mistakes made when reporting scores will not be corrected by Moderators unless both teams agree to the change.',
      'Teams will play two matches per week during the season.',
      'Ladder teams may request to be set inactive at any time. Inactive teams are still expected to complete matches that have already been assigned and/or scheduled.',
      'Match Postponements: Once per season one of the two teams may use their "team postponement" to postpone one match without penalty, to be scheduled and played the following week. Master teams may not postpone.',
      'A match may not be postponed more than once.',
      'Postponement requests must be made by opening a support ticket.',
      'Once a match is agreed in writing and scheduled using the EML bot, it may not be rescheduled or postponed to another week. It may be rescheduled to a different time within the same week if both teams agree.',
    ],
  },
  {
    title: 'Challenges',
    items: [
      'The League offers a "Challenge" option which allows teams to play additional matches in a given week. Challenges must be agreed to by both teams.',
      'Challenge matches must be scheduled, played, and have their scores recorded on the website no later than Sunday midnight Eastern Time.',
      'Ladder teams have unlimited challenges to use. Master teams and Ladder teams may not challenge each other.',
    ],
  },
  {
    title: 'Matches Format',
    items: [
      'Once a match begins, it must be completed in one session if possible.',
      'The maximum amount of time between rounds is five minutes. If one team is searching for a substitute because of the ping cap rule, the pause can be extended up to 15 minutes.',
      'A match is to be played as best-of-3 (Bo3) rounds.',
      'Matches are expected to be played 4v4, but in unfortunate circumstances may also be 3v4 or 3v3.',
      'Teams must start each round with four players (either all four rostered or three rostered players and a League Substitute). Teams may not use a league sub if they only have 2 members available.',
      'If a team has 3 rostered players they may use a League Sub to play a league match.',
      'A team cannot play with more than one League Substitute at a time.',
      'If a team drops below four/three rostered players during a round, that team may use their timeout (if available) to get the player back. Otherwise, they must continue the round with the team members they still have.',
      'From the time a match begins until it ends, at no point are there allowed to be five people on one team while the game clock is running.',
      'During a Game Clock stoppage mid-round, teams may have five players in the arena for up to 30 seconds, solely for the purpose of making a substitution.',
      'If a substitution needs to be made while the Game Clock is running mid-round, the player leaving must be completely out of the server before the replacement player may join.',
      'Reports pertaining to violations of this rule need to be filed within 48 hours of the scheduled start time of the match.',
      'Teams must not intentionally or voluntarily forfeit any match.',
      'Engaging in any anticompetitive action that influences the outcome of a game or match by any means is strictly prohibited.',
      'Noncompetitive action requires either clear intent or repeated behavior after warning.',
    ],
  },
  {
    title: 'Scoring System',
    items: [
      'Teams enter the score themselves using the league bot. One team enters the match results and the other team verifies and accepts.',
      'For a match score to be corrected after submission, solid evidence needs to be submitted or both teams need to agree to the change.',
      'In the case where a forfeit is necessary, start a match ticket.',
    ],
  },
  {
    title: 'Matches Forfeits',
    items: [
      'In the event that a team is late to a match and does not start the match within 10 minutes of the scheduled time, the team that was late will be charged with using their mid-round pause.',
      'Teams have a 15-minute buffer from the scheduled match start time to be in the arena with their team members and ready to start the match.',
      'If one team is waiting for another team, the waiting team must show other proof to League Moderators that they were ready at the scheduled time.',
      'Once the 15-minute buffer has elapsed, the team that is responsible for the delay forfeits the first round.',
      'If a further 15 minutes elapses without match commencement, the offending team is officially declared a \'no-show\' and a forfeit should be submitted against the offending team.',
      'In the case of a forfeit, start a match ticket.',
    ],
  },
  {
    title: 'Server Score Procedure',
    items: [
      'If a team anticipates a server disadvantage ahead of time and the teams don\'t agree on which server to use, the Server Score Calculator must be used to decide which server to play on.',
      'Refusal to participate in the resolution will result in a forfeit of the match.',
      'To help mitigate server disputes, teams who can\'t agree on which server to use should run the Server Score Calculation on NA players only (if mixed region).',
      'Find the average ping for Teams A and B on Server A. Find the average ping for Teams A and B on Server B.',
      'Subtract the higher of Team A and B\'s average ping from the other Team\'s average ping for both servers. The server with the lower server score shall be chosen for the match.',
      'If a match has been started and a team suspects they are at a ping disadvantage, the game should be paused between rounds and the Server Score Calculation should be run between two candidate servers.',
      'The intent of this calculation is not to prioritize the server with lower ping for one team, but rather to find the server with the most fair ping for both teams.',
    ],
  },
  {
    title: 'Pauses',
    items: [
      'Mid-Round Pauses: If a team needs a pause for any reason players can press the "pause" button after the next goal. A mid-round pause can only be used once per team, per match.',
      'If the pause ends before a team is ready, the players must decide to either continue the round with the players they have left or forfeit the round.',
      'If a pause is used illegally, or if one team\'s pause lasts longer than allowed by the rules, the other team may unpause the match to resume play.',
      'If a player dropped but is able to rejoin the match they can do so at any time, as long as there are never more than four players in the arena per team at the same time.',
      'Any illegal pause will result in a scoring penalty. For every 20 seconds the match is paused as a result of an illegal pause, 2 points will be deducted from the offending team.',
      'Between-Round Pauses: Between any two rounds, either team may initiate an extended break of up to five minutes before the start of the next round. This does not count against the "Mid-Round Pauses" rule.',
      'The total break between rounds shall not exceed a total of five minutes; since the default rules already have a one-minute break between rounds, that means the added pause time should not exceed four minutes.',
      'A round begins once the game clock displays "10:00". Pausing or restarting the round during the initial joust timer countdown is considered to be a use of a team\'s timeout.',
    ],
  },
  {
    title: 'Teams & Players',
    items: [
      'Players are not allowed to play under more than one EML account, must not have more than one account registered with EML.',
      'All team members are required to be in the EML Discord server.',
      'Players and teams must play using their registered EML name and it must match their server nickname. Players using an in-game name not matching their EML rostered name may be considered ineligible for EML matches.',
      'All content on a player\'s profile, and all content on a team\'s profile, must abide by applicable rules including no copyrighted material, no offensive content, and no deceptive names.',
      'Team names must be unique and are first come, first serve.',
      'If a team is retired for the length of a full cycle their claim to the name is forfeit.',
      'If you change your team\'s name, you forfeit all rights and claims to your team\'s previous names.',
      'The League Moderators reserve the right to suspend or ban any non-complying player or team.',
      'Players must be a minimum of 13 years of age.',
      'In order for a team to go "active", a minimum of four rostered members of the team must be members of the EML Discord server.',
      'The maximum number of rostered players per team is six.',
      'Players and substitutes rostered on one team cannot substitute for another team.',
      'Only registered League Substitutes can be used to fill empty slots in a match.',
      'Team rosters cannot change during a match.',
      'Players who are rostered on a team on any Sunday at midnight Eastern Time can play only for that team until the following Sunday at midnight Eastern Time.',
      'Cooldown is automatically applied every time a player leaves a team and automatically removed by the system on every Sunday night at midnight. A team member or League Substitute who is on cooldown is not eligible to play.',
    ],
  },
  {
    title: 'Master Tier',
    items: [
      'The Master Tier does not exist during the first four week cycle of a new season. At the conclusion of the first cycle, the top five teams from the Ladder standings will be promoted to form the Master Tier.',
      'The bottom two teams in the Master Tier standings will be relegated to the Ladder. The top two teams in the Ladder standings will be promoted to the Master Tier.',
      'Master teams may not postpone matches.',
      'Master teams may not disband during an active season cycle except with approval from League Moderators.',
      'If a Master team disbands without moderator approval, the team may receive an immediate inactive designation and the team captain may receive AP.',
      'Any new team formed by three or more players from the disbanded roster may inherit the competitive status or penalties of the original team.',
      'Master teams and Ladder teams may not challenge each other.',
      'All master teams are required to be able to use and/or provide Spark links to enter an arena.',
    ],
  },
  {
    title: 'Streaming, Media & Spectators',
    items: [
      'EML reserves exclusive rights to cast EML matches. EML can assign the casting rights of a match to a third party.',
      'Both teams must explicitly agree to spectators in writing for any unofficial observer.',
      'NO team is obligated to allow unofficial observers during their match.',
      'Teams must allow League Staff to join matches as spectators if requested (League Mod or higher).',
      'If EML is covering a match, no additional spectators are permitted, for any reason, in that match.',
      'Matches cast by EML must start on time. There is a grace period of 5 minutes.',
      'Publicly posting join links (Spark, Atlas, etc.) for an official EML match is forbidden.',
      'Using the "Spectate Me" function of Spark is considered an Unofficial Observer. However, using Spark to generate logs and replay files is allowed.',
      'Recording of your personal perspective is recommended, regardless of whether your match is cast or not.',
      'Official casts will be streamed via the designated League Twitch channels.',
    ],
  },
  {
    title: 'Cheating, Exploits & Breaches',
    items: [
      'Any cheating, exploiting, or contravention of the foregoing rules must be brought to the attention of the League Moderators.',
      'Offering, receiving, or agreeing to give or receive any sort of compensation related to improperly influencing the outcome of a match is strictly prohibited.',
      'Any attempts to intentionally and improperly manipulate the ladder standings or MMR system through any means is strictly prohibited.',
      '"Cheating" includes the intentional or reckless manipulation of the game or its code in such a way as to confer an unfair advantage.',
      '"Exploit" includes the intentional or reckless triggering of any code, attribute or in-game function not envisaged as a legitimate feature by Ready At Dawn.',
      'Intentional use of a VPN to alter routing or conceal location is not allowed.',
      'To provide a buffer zone for unintentional movement, a physical playspace of 4 feet by 4 feet is allowed.',
      'Any use of the spectate function by participants during official matches to obtain an advantage of any kind is classified as cheating.',
      'The use of any object (except the floor, ground, or a playspace mat) to aid in physical motion is strictly prohibited.',
      'Half-cycling is now illegal in general.',
      'API use is permitted only if the data being collected is not being processed in real time (other than for Spark or positional audio), not being used to gain a real-time in-game advantage, and disclosed between both teams before the start of the match.',
    ],
  },
  {
    title: 'Decisions & Sanctions',
    items: [
      'The Board of Directors serves as the final authority on governance, structure, and ruleset approval.',
      'All League Moderator rulings must be made in a EML-official Discord server, or the ruling may be considered invalid.',
      'League moderator staff may not adjudicate league match matters regarding the team they are on.',
      'League Moderators reserve the right to void or change scores, enact disciplinary procedures, interpret the intent of the rules, settle disputes, and make decisions on any subject not explicitly allowed or disallowed in these rules.',
      'Formal disputes are to be lodged directly with League Moderators via Discord.',
      'Reports made regarding rule violations during a match must be submitted within 24 hours of the match\'s scheduled start time.',
      'In the event a player receives a disciplinary action such as AP and would like to appeal, they must do so by making a ticket.',
      'AP can be appealed as soon as it is applied and at any time after.',
      'Bans may only be appealed during a declared Clemency Week (2 weeks before a season).',
    ],
  },
  {
    title: 'Escalation Beyond League Commissioners',
    items: [
      'EML is structured so that most issues are resolved at the Moderator or Commissioner level.',
      'Escalation to the Board of Directors is permitted only when: all League Commissioners are recused, a ruling involves league governance or structural matters, there is a credible claim that established escalation procedures were not followed, or new material evidence has emerged.',
      'Escalation is not intended to re-argue factual determinations, judgment calls, or discretionary rulings made in good faith.',
      'Requests for escalation will not be considered for: disagreement with competitive outcomes, dissatisfaction with severity of a ruling, or attempts to bypass Moderators or Commissioners.',
      'All escalation requests must be submitted via an official League ticket and must clearly state the basis for escalation.',
      'Abuse of the escalation process, including repeated or bad-faith requests, may itself be treated as misconduct.',
      'Board decisions issued through escalation are final.',
    ],
  },
];

function highlightText(text, query) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ backgroundColor: '#f97316', color: '#fff', borderRadius: '2px', padding: '0 2px' }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

const RulesView = ({ theme, open, onClose }) => {
  const emlColors = getThemedColors(theme);
  const [search, setSearch] = useState('');

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return RULES_SECTIONS.map((section, idx) => ({ ...section, originalIndex: idx }));
    return RULES_SECTIONS.map((section, idx) => {
      const titleMatch = section.title.toLowerCase().includes(q);
      const matchedItems = section.items.filter((item) => item.toLowerCase().includes(q));
      if (titleMatch || matchedItems.length > 0) {
        return { ...section, originalIndex: idx, items: titleMatch ? section.items : matchedItems };
      }
      return null;
    }).filter(Boolean);
  }, [search]);

  const totalMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return 0;
    return filteredSections.reduce((acc, s) => acc + s.items.filter((i) => i.toLowerCase().includes(q)).length, 0);
  }, [search, filteredSections]);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="820px"
            maxH="90vh"
            bg={emlColors.bgSecondary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium} flexShrink={0}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <FileText size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    League Rules
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" color={emlColors.textPrimary} _hover={{ color: emlColors.accentOrange }} />
                </Dialog.CloseTrigger>
              </HStack>

              {/* Search bar */}
              <Box mt="3" position="relative">
                <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" pointerEvents="none" zIndex={1}>
                  <Search size={16} color={emlColors.textMuted} />
                </Box>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rules..."
                  pl="9"
                  pr={search ? '9' : '3'}
                  bg={emlColors.bgSecondary}
                  border="1px solid"
                  borderColor={emlColors.borderMedium}
                  color={emlColors.textPrimary}
                  _placeholder={{ color: emlColors.textMuted }}
                  _focus={{ borderColor: emlColors.accentOrange, boxShadow: `0 0 0 1px ${emlColors.accentOrange}` }}
                  rounded="lg"
                  size="sm"
                />
                {search && (
                  <Box
                    position="absolute"
                    right="3"
                    top="50%"
                    transform="translateY(-50%)"
                    cursor="pointer"
                    onClick={() => setSearch('')}
                    color={emlColors.textMuted}
                    _hover={{ color: emlColors.textPrimary }}
                  >
                    <X size={14} />
                  </Box>
                )}
              </Box>

              {/* Match count */}
              {search.trim() && (
                <HStack mt="2" gap="2">
                  <Badge colorPalette="orange" size="sm">
                    {totalMatches} result{totalMatches !== 1 ? 's' : ''} in {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''}
                  </Badge>
                </HStack>
              )}
            </Dialog.Header>

            {/* Scrollable body */}
            <Box
              overflowY="auto"
              flex="1"
              px="6"
              py="5"
              css={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: emlColors.borderMedium, borderRadius: '3px' },
              }}
            >
              <VStack gap="5" align="stretch">
                <Button
                  colorPalette="orange"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://echomasterleague.com/eml-league-rules/', '_blank')}
                  alignSelf="flex-end"
                >
                  <ExternalLink size={14} />
                  View on EML Website
                </Button>

                {filteredSections.length === 0 ? (
                  <Box textAlign="center" py="12">
                    <Text color={emlColors.textMuted} fontSize="sm">No rules match your search.</Text>
                  </Box>
                ) : (
                  <Accordion.Root
                    collapsible
                    multiple
                    defaultValue={search.trim() ? filteredSections.map((_, i) => `section-${i}`) : []}
                  >
                    {filteredSections.map((section, sIdx) => {
                      const sectionNum = section.originalIndex + 1;
                      return (
                        <Accordion.Item
                          key={sIdx}
                          value={`section-${sIdx}`}
                          bg={emlColors.bgTertiary}
                          rounded="xl"
                          border="1px solid"
                          borderColor={emlColors.borderMedium}
                          mb="3"
                          overflow="hidden"
                        >
                          <Accordion.ItemTrigger
                            px="5"
                            py="4"
                            bg={`${emlColors.accentOrange}14`}
                            _hover={{ bg: `${emlColors.accentOrange}22` }}
                            cursor="pointer"
                            transition="background 0.15s"
                          >
                            <HStack justify="space-between" flex="1">
                              <HStack gap="2" align="center">
                                <Text fontWeight="800" fontSize="sm" color={emlColors.accentOrange} fontFamily="mono" flexShrink={0}>
                                  {sectionNum}.0
                                </Text>
                                <Text fontWeight="700" fontSize="sm" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                                  {highlightText(section.title, search)}
                                </Text>
                              </HStack>
                              <HStack gap="2" flexShrink={0}>
                                <Badge size="xs" variant="subtle" colorPalette="orange">
                                  {section.items.length}
                                </Badge>
                                <Accordion.ItemIndicator>
                                  <ChevronDown size={16} color={emlColors.accentOrange} />
                                </Accordion.ItemIndicator>
                              </HStack>
                            </HStack>
                          </Accordion.ItemTrigger>
                          <Accordion.ItemContent>
                            <VStack align="stretch" gap="0">
                              {section.items.map((item, iIdx) => (
                                <Box
                                  key={iIdx}
                                  px="5"
                                  py="3"
                                  borderTop="1px solid"
                                  borderColor={emlColors.borderMedium}
                                >
                                  <HStack gap="3" align="start">
                                    <Text
                                      fontSize="xs"
                                      fontWeight="600"
                                      color={emlColors.accentOrange}
                                      fontFamily="mono"
                                      flexShrink={0}
                                      mt="0.5"
                                      opacity={0.7}
                                    >
                                      {sectionNum}.{iIdx + 1}
                                    </Text>
                                    <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="tall">
                                      {highlightText(item, search)}
                                    </Text>
                                  </HStack>
                                </Box>
                              ))}
                            </VStack>
                          </Accordion.ItemContent>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion.Root>
                )}

                <Box
                  bg={`${emlColors.accentOrange}10`}
                  border="1px solid"
                  borderColor={`${emlColors.accentOrange}40`}
                  rounded="xl"
                  px="5"
                  py="4"
                  mt="2"
                >
                  <Text fontSize="xs" color={emlColors.textMuted} fontStyle="italic" textAlign="center">
                    Echo Master League is a community-run, volunteer-driven league built by players who enjoy competitive Echo VR. These rules are meant to provide clarity and structure, not to replace sportsmanship or common sense.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RulesView;
