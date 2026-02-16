import { Box, Container, HStack, Button, Menu, Portal, Image, Text } from '@chakra-ui/react';
import { ChevronDown, Trophy, Calendar, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { emlColors } from '../theme/colors';
import AnnouncementsView from './AnnouncementsView';
import AboutView from './AboutView';
import CalendarView from './CalendarView';
import StandingsView from './StandingsView';
import MatchesView from './MatchesView';
import MembersView from './MembersView';
import TeamsView from './TeamsView';
import RulesView from './RulesView';
import BotView from './BotView';
import MediaView from './MediaView';

const Navigation = ({
  theme,
  onThemeToggle,
  teamsOpen,
  setTeamsOpen,
  membersOpen,
  setMembersOpen,
  membersCategory,
  setMembersCategory,
  standingsOpen,
  setStandingsOpen
}) => {
  const isDark = theme === 'dark';
  const [announcementsOpen, setAnnouncementsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [matchesOpen, setMatchesOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg={`${emlColors.bgPrimary}99`}
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor={emlColors.borderMedium}
        boxShadow={`0 8px 32px ${emlColors.bgPrimary}80`}
      >
        <Container maxW="7xl" py="3">
          <HStack justify="space-between" gap="4">
            {/* EML Dropdown */}
            <Menu.Root positioning={{ placement: 'bottom-start' }}>
              <Menu.Trigger asChild>
                <Button
                  size="md"
                  variant="ghost"
                  fontWeight="800"
                  fontSize="xl"
                  color={emlColors.textPrimary}
                  _hover={{ bg: emlColors.bgHover }}
                  _open={{
                    color: emlColors.accentOrange,
                    bg: emlColors.bgHover
                  }}
                >
                  EML <ChevronDown size={18} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW="200px"
                    bg={emlColors.bgSecondary}
                    border="1px solid"
                    borderColor={emlColors.borderMedium}
                    rounded="xl"
                    boxShadow="2xl"
                    p="2"
                  >
                    <Menu.Item
                      value="announcements"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setAnnouncementsOpen(true)}
                    >
                      Announcements & Updates
                    </Menu.Item>
                    <Menu.Item
                      value="about"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setAboutOpen(true)}
                    >
                      About EML
                    </Menu.Item>
                    <Menu.Item
                      value="calendar"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setCalendarOpen(true)}
                    >
                      Calendar
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      value="teams"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setTeamsOpen(true)}
                    >
                      League Teams
                    </Menu.Item>
                    <Menu.Item
                      value="rules"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setRulesOpen(true)}
                    >
                      League Rules
                    </Menu.Item>
                    <Menu.Item
                      value="bot"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setBotOpen(true)}
                    >
                      EML Discord Bot
                    </Menu.Item>
                    <Menu.Item
                      value="media"
                      rounded="lg"
                      color={emlColors.textPrimary}
                      _hover={{ bg: emlColors.bgHover }}
                      onClick={() => setMediaOpen(true)}
                    >
                      Highlights & Content
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* Main Navigation - Desktop Only */}
            <HStack gap="2" display={{ base: 'none', md: 'flex' }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStandingsOpen(true)}
                color={emlColors.textSecondary}
                _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
              >
                <Trophy size={14} /> Standings
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMatchesOpen(true)}
                color={emlColors.textSecondary}
                _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
              >
                <Calendar size={14} /> Matches
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMembersOpen(true)}
                color={emlColors.textSecondary}
                _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
              >
                <Users size={14} /> Members
              </Button>
            </HStack>

            {/* Right Side Actions */}
            <HStack gap="2">
              {/* Discord Links Dropdown - Desktop */}
              <Menu.Root positioning={{ placement: 'bottom-end' }}>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    color={emlColors.accentPurple}
                    _hover={{ bg: emlColors.bgHover, color: emlColors.accentBlue }}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <MessageCircle size={14} /> Discord Links <ChevronDown size={14} />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="220px"
                      bg={emlColors.bgSecondary}
                      border="1px solid"
                      borderColor={emlColors.borderMedium}
                      rounded="xl"
                      boxShadow="2xl"
                      p="2"
                    >
                      <Menu.Item
                        value="eml-discord"
                        rounded="lg"
                        color={emlColors.textPrimary}
                        _hover={{ bg: emlColors.bgHover }}
                        onClick={() => window.open('https://discord.gg/YhKGzPhaUw', '_blank')}
                      >
                        <HStack gap="3">
                          <Image
                            src="https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024"
                            alt="EML"
                            w="6"
                            h="6"
                            rounded="full"
                          />
                          <Text fontWeight="500">EML Discord</Text>
                        </HStack>
                      </Menu.Item>
                      <Menu.Item
                        value="lounge-discord"
                        rounded="lg"
                        color={emlColors.textPrimary}
                        _hover={{ bg: emlColors.bgHover }}
                        onClick={() => window.open('https://discord.gg/yG6speErHC', '_blank')}
                      >
                        <HStack gap="3">
                          <Image
                            src="https://cdn.discordapp.com/icons/779349159852769310/d3f47955fc2d4558a5351a12a3502eea.webp?size=480"
                            alt="Echo VR Lounge"
                            w="6"
                            h="6"
                            rounded="full"
                          />
                          <Text fontWeight="500">Echo VR Lounge</Text>
                        </HStack>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Overlay Views */}
      <AnnouncementsView theme={theme} open={announcementsOpen} onClose={() => setAnnouncementsOpen(false)} />
      <AboutView theme={theme} open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CalendarView theme={theme} open={calendarOpen} onClose={() => setCalendarOpen(false)} />
      <StandingsView theme={theme} open={standingsOpen} onClose={() => setStandingsOpen(false)} />
      <MatchesView theme={theme} open={matchesOpen} onClose={() => setMatchesOpen(false)} />
      <MembersView theme={theme} open={membersOpen} onClose={() => setMembersOpen(false)} initialCategory={membersCategory} />
      <TeamsView theme={theme} open={teamsOpen} onClose={() => setTeamsOpen(false)} />
      <RulesView theme={theme} open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <BotView theme={theme} open={botOpen} onClose={() => setBotOpen(false)} />
      <MediaView theme={theme} open={mediaOpen} onClose={() => setMediaOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg={`${emlColors.bgPrimary}99`}
        backdropFilter="blur(20px)"
        borderTop="1px solid"
        borderColor={emlColors.borderMedium}
        boxShadow={`0 -8px 32px ${emlColors.bgPrimary}80`}
        pb="env(safe-area-inset-bottom)"
      >
        <Container maxW="full" px="4" py="2">
          <HStack justify="center" gap="8">
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="4"
              onClick={() => setStandingsOpen(true)}
              color={emlColors.textSecondary}
              _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
            >
              <Trophy size={20} />
              <Box fontSize="xs" mt="1">Standings</Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="4"
              onClick={() => setMatchesOpen(true)}
              color={emlColors.textSecondary}
              _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
            >
              <Calendar size={20} />
              <Box fontSize="xs" mt="1">Matches</Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="4"
              onClick={() => setMembersOpen(true)}
              color={emlColors.textSecondary}
              _hover={{ bg: emlColors.bgHover, color: emlColors.accentOrange }}
            >
              <Users size={20} />
              <Box fontSize="xs" mt="1">Members</Box>
            </Button>
          </HStack>
        </Container>
      </Box>
    </>
  );
};

export default Navigation;
