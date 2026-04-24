import { Box, Container, HStack, Button, Menu, Portal, Image, Text, Badge } from '@chakra-ui/react';
import { ChevronDown, Trophy, Calendar, Users, MessageCircle, Shield, Tv, Bell, Swords, ClipboardList, Megaphone, Info, CalendarDays, BookOpen, Bot, Film, BarChart2 } from 'lucide-react';
import { useState, useEffect, lazy, Suspense } from 'react';
import ThemeToggle from './ThemeToggle';
import ThemePicker from './ThemePicker';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';

// Lazy-load all modal/panel/view components so they don't bloat the initial bundle
const ProductionSignup = lazy(() => import('./ProductionSignup'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const AnnouncementsView = lazy(() => import('./AnnouncementsView'));
const AboutView = lazy(() => import('./AboutView'));
const CalendarView = lazy(() => import('./CalendarView'));
const StandingsView = lazy(() => import('./StandingsView'));
const MatchesView = lazy(() => import('./MatchesView'));
const MembersView = lazy(() => import('./MembersView'));
const TeamsView = lazy(() => import('./TeamsView'));
const RulesView = lazy(() => import('./RulesView'));
const BotView = lazy(() => import('./BotView'));
const MediaView = lazy(() => import('./MediaView'));
const LeaderboardView = lazy(() => import('./LeaderboardView'));
const CaptainsDashboard = lazy(() => import('./CaptainsDashboard'));
const CasterGreenRoom = lazy(() => import('./CasterGreenRoom'));
const NotificationsPanel = lazy(() => import('./NotificationsPanel'));
const TeamCreationModal = lazy(() => import('./TeamCreationModal'));
const TeamManagementPanel = lazy(() => import('./TeamManagementPanel'));
const PlayerRegistrationModal = lazy(() => import('./PlayerRegistrationModal'));
const ChallengeSystem = lazy(() => import('./ChallengeSystem'));
const MatchReportModal = lazy(() => import('./MatchReportModal'));
import { useNotifications } from '../hooks/useNotifications';

const Navigation = ({
  theme,
  onThemeToggle,
  colorScheme,
  mode,
  onColorSchemeChange,
  onModeChange,
  teamsOpen,
  setTeamsOpen,
  membersOpen,
  setMembersOpen,
  membersCategory,
  setMembersCategory,
  standingsOpen,
  setStandingsOpen
}) => {
  const colors = getThemedColors(theme);
  const { isLoggedIn, isCaster, isAdmin, isMod, user, error: authError } = useAuth();
  const { unreadCount } = useNotifications();
  const [announcementsOpen, setAnnouncementsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [matchesOpen, setMatchesOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [productionSignupOpen, setProductionSignupOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [captainsDashOpen, setCaptainsDashOpen] = useState(false);
  const [casterGreenRoomOpen, setCasterGreenRoomOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [teamCreateOpen, setTeamCreateOpen] = useState(false);
  const [teamManageOpen, setTeamManageOpen] = useState(false);
  const [playerRegOpen, setPlayerRegOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [matchReportOpen, setMatchReportOpen] = useState(false);
  const [myTeamId, setMyTeamId] = useState(null);

  useEffect(() => {
    if (authError) console.error('[EML Auth]', authError);
  }, [authError]);

  // Auto-open registration modal on first login
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const key = `eml_registered_${user.id}`;
      if (!localStorage.getItem(key)) {
        setPlayerRegOpen(true);
      }
    }
  }, [isLoggedIn, user?.id]);

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg={`${colors.bgPrimary}99`}
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor={colors.borderMedium}
        boxShadow={`0 8px 32px ${colors.bgPrimary}80`}
      >
        <Container maxW="7xl" py="3" px={{ base: '3', md: '6' }}>
          <HStack justify="space-between" gap={{ base: '2', md: '4' }}>
            {/* EML Dropdown */}
            <Menu.Root positioning={{ placement: 'bottom-start' }}>
              <Menu.Trigger asChild>
                <Button
                  size="md"
                  variant="ghost"
                  fontWeight="800"
                  fontSize="xl"
                  color={colors.textPrimary}
                  _hover={{ bg: colors.bgHover }}
                  _open={{
                    color: colors.accentOrange,
                    bg: colors.bgHover
                  }}
                >
                  EML <ChevronDown size={18} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW="200px"
                    bg={colors.bgSecondary}
                    border="1px solid"
                    borderColor={colors.borderMedium}
                    rounded="xl"
                    boxShadow="2xl"
                    p="2"
                    style={{ animation: 'fadeIn 0.15s ease' }}
                  >
                    <Menu.Item
                      value="announcements"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setAnnouncementsOpen(true)}
                    >
                      <HStack gap="2"><Megaphone size={14} /><span>Announcements</span></HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="about"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setAboutOpen(true)}
                    >
                      <HStack gap="2"><Info size={14} /><span>About EML</span></HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="calendar"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setCalendarOpen(true)}
                    >
                      <HStack gap="2"><CalendarDays size={14} /><span>Calendar</span></HStack>
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      value="teams"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setTeamsOpen(true)}
                    >
                      <HStack gap="2"><Users size={14} /><span>League Teams</span></HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="rules"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setRulesOpen(true)}
                    >
                      <HStack gap="2"><BookOpen size={14} /><span>League Rules</span></HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="bot"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setBotOpen(true)}
                    >
                      <HStack gap="2"><Bot size={14} /><span>EML Discord Bot</span></HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="media"
                      rounded="lg"
                      py="1" px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => setMediaOpen(true)}
                    >
                      <HStack gap="2"><Film size={14} /><span>Highlights & Content</span></HStack>
                    </Menu.Item>
                    {(isAdmin || isMod) && <Menu.Separator />}
                    {(isAdmin || isMod) && (
                      <Menu.Item
                        value="leaderboard"
                        rounded="lg"
                        py="1" px="3"
                        fontSize="sm"
                        color={colors.accentOrange}
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => setLeaderboardOpen(true)}
                      >
                        <HStack gap="2"><BarChart2 size={14} /><span>Player Leaderboard</span></HStack>
                      </Menu.Item>
                    )}
                    {isLoggedIn && <Menu.Separator />}
                    {isLoggedIn && (
                      <Menu.Item
                        value="captains-dashboard"
                        rounded="lg"
                        py="1" px="3"
                        fontSize="sm"
                        color="#fbbf24"
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => setCaptainsDashOpen(true)}
                      >
                        <HStack gap="2"><Shield size={14} /><span>Captain's Dashboard</span></HStack>
                      </Menu.Item>
                    )}
                    {isLoggedIn && (
                      <Menu.Item
                        value="challenge"
                        rounded="lg"
                        py="1" px="3"
                        fontSize="sm"
                        color={colors.accentOrange}
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => setChallengeOpen(true)}
                      >
                        <HStack gap="2"><Swords size={14} /><span>Challenge Teams</span></HStack>
                      </Menu.Item>
                    )}
                    {isLoggedIn && (
                      <Menu.Item
                        value="match-report"
                        rounded="lg"
                        py="1" px="3"
                        fontSize="sm"
                        color={colors.accentCyan}
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => setMatchReportOpen(true)}
                      >
                        <HStack gap="2"><ClipboardList size={14} /><span>Report Match</span></HStack>
                      </Menu.Item>
                    )}
                    {(isCaster || isAdmin) && (
                      <Menu.Item
                        value="caster-greenroom"
                        rounded="lg"
                        py="1" px="3"
                        fontSize="sm"
                        color="#00bfff"
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => setCasterGreenRoomOpen(true)}
                      >
                        <HStack gap="2"><Tv size={14} /><span>Caster Green Room</span></HStack>
                      </Menu.Item>
                    )}
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
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{ bg: colors.bgHover, color: colors.accentOrange, transform: 'scale(1.02)' }}
              >
                <Trophy size={14} /> Standings
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMatchesOpen(true)}
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{ bg: colors.bgHover, color: colors.accentOrange, transform: 'scale(1.02)' }}
              >
                <Calendar size={14} /> Matches
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMembersOpen(true)}
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{ bg: colors.bgHover, color: colors.accentOrange, transform: 'scale(1.02)' }}
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
                    color={colors.accentPurple}
                    _hover={{ bg: colors.bgHover, color: colors.accentBlue }}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <MessageCircle size={14} /> Discord Links <ChevronDown size={14} />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="220px"
                      bg={colors.bgSecondary}
                      border="1px solid"
                      borderColor={colors.borderMedium}
                      rounded="xl"
                      boxShadow="2xl"
                      p="2"
                    >
                      <Menu.Item
                        value="eml-discord"
                        rounded="lg"
                        color={colors.textPrimary}
                        _hover={{ bg: colors.bgHover }}
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
                        color={colors.textPrimary}
                        _hover={{ bg: colors.bgHover }}
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

              {/* Auth: Login button or User menu */}
              {isLoggedIn ? (
                <UserMenu
                  theme={theme}
                  onProductionSignupClick={() => setProductionSignupOpen(true)}
                  onAdminPanelClick={() => setAdminPanelOpen(true)}
                  onMyTeamClick={() => myTeamId ? setTeamManageOpen(true) : setTeamCreateOpen(true)}
                  onNotificationsClick={() => setNotificationsOpen(true)}
                  onChallengeClick={() => setChallengeOpen(true)}
                  onMatchReportClick={() => setMatchReportOpen(true)}
                />
              ) : (
                <LoginButton />
              )}

              <ThemePicker
                theme={theme}
                colorScheme={colorScheme}
                mode={mode}
                onSchemeChange={onColorSchemeChange}
                onModeChange={onModeChange}
              />
              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Overlay Views — wrapped in Suspense so lazy chunks load on demand */}
      <Suspense fallback={null}>
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
        {(isAdmin || isMod) && (
          <LeaderboardView theme={theme} open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
        )}
        {isLoggedIn && (
          <CaptainsDashboard theme={theme} open={captainsDashOpen} onClose={() => setCaptainsDashOpen(false)} />
        )}
        {(isCaster || isAdmin) && (
          <CasterGreenRoom theme={theme} open={casterGreenRoomOpen} onClose={() => setCasterGreenRoomOpen(false)} />
        )}
        {isLoggedIn && (
          <NotificationsPanel theme={theme} open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        )}
        {isLoggedIn && (
          <TeamCreationModal theme={theme} open={teamCreateOpen} onClose={() => setTeamCreateOpen(false)} onCreated={(t) => { setMyTeamId(t.id); setTeamCreateOpen(false); }} />
        )}
        {isLoggedIn && myTeamId && (
          <TeamManagementPanel theme={theme} open={teamManageOpen} onClose={() => setTeamManageOpen(false)} teamId={myTeamId} />
        )}
        {isLoggedIn && (
          <PlayerRegistrationModal
            theme={theme}
            open={playerRegOpen}
            onClose={() => {
              setPlayerRegOpen(false);
              if (user?.id) localStorage.setItem(`eml_registered_${user.id}`, '1');
            }}
          />
        )}
        {isLoggedIn && (
          <ChallengeSystem theme={theme} open={challengeOpen} onClose={() => setChallengeOpen(false)} />
        )}
        {isLoggedIn && (
          <MatchReportModal theme={theme} open={matchReportOpen} onClose={() => setMatchReportOpen(false)} />
        )}

        {/* Auth-gated Modals */}
        {isCaster && (
          <ProductionSignup
            theme={theme}
            open={productionSignupOpen}
            onClose={() => setProductionSignupOpen(false)}
          />
        )}
        {(isAdmin || isMod) && (
          <AdminPanel
            theme={theme}
            open={adminPanelOpen}
            onClose={() => setAdminPanelOpen(false)}
          />
        )}
      </Suspense>

      {/* Mobile Bottom Navigation */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg={`${colors.bgPrimary}99`}
        backdropFilter="blur(20px)"
        borderTop="1px solid"
        borderColor={colors.borderMedium}
        boxShadow={`0 -8px 32px ${colors.bgPrimary}80`}
        pb="env(safe-area-inset-bottom)"
      >
        <Container maxW="full" px="2" py="2">
          <HStack justify="space-around" gap="1">
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="2"
              onClick={() => setStandingsOpen(true)}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Trophy size={18} />
              <Box fontSize="xs" mt="1">Standings</Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="2"
              onClick={() => setMatchesOpen(true)}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Calendar size={18} />
              <Box fontSize="xs" mt="1">Matches</Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="2"
              onClick={() => setMembersOpen(true)}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Users size={18} />
              <Box fontSize="xs" mt="1">Members</Box>
            </Button>
            <Menu.Root positioning={{ placement: 'top-end' }}>
              <Menu.Trigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  flexDirection="column"
                  h="auto"
                  py="2"
                  px="2"
                  color={colors.accentPurple}
                  _hover={{ bg: colors.bgHover, color: colors.accentBlue }}
                >
                  <MessageCircle size={18} />
                  <Box fontSize="xs" mt="1">Discord</Box>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW="200px"
                    bg={colors.bgSecondary}
                    border="1px solid"
                    borderColor={colors.borderMedium}
                    rounded="xl"
                    boxShadow="2xl"
                    p="2"
                  >
                    <Menu.Item
                      value="eml-discord-mobile"
                      rounded="lg"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
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
                      value="lounge-discord-mobile"
                      rounded="lg"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
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
          </HStack>
        </Container>
      </Box>
    </>
  );
};

export default Navigation;
