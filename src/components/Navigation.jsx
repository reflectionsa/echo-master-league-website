import { Box, Container, HStack, Button, Menu, Portal, Image, Text, Badge } from '@chakra-ui/react';
import {
  ChevronDown,
  Home,
  Trophy,
  Calendar,
  Users,
  MessageCircle,
  Shield,
  Tv,
  Bell,
  Swords,
  ClipboardList,
  Megaphone,
  Info,
  CalendarDays,
  BookOpen,
  Bot,
  Film,
  BarChart2,
} from 'lucide-react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ThemePicker from './ThemePicker';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useNotifications } from '../hooks/useNotifications';
import { useMyTeam } from '../hooks/useMyTeam';
import { useSchedule } from '../hooks/useSchedule';
import { emlApi } from '../hooks/useEmlApi';

// Lazy-load modal-only panels so they don't bloat the initial bundle
const ProductionSignup = lazy(() => import('./ProductionSignup'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const CasterGreenRoom = lazy(() => import('./CasterGreenRoom'));
const NotificationsPanel = lazy(() => import('./NotificationsPanel'));
const TeamCreationModal = lazy(() => import('./TeamCreationModal'));
const TeamManagementPanel = lazy(() => import('./TeamManagementPanel'));
const PlayerRegistrationModal = lazy(() => import('./PlayerRegistrationModal'));
const ChallengeSystem = lazy(() => import('./ChallengeSystem'));
const MatchReportModal = lazy(() => import('./MatchReportModal'));
const MyTeamView = lazy(() => import('./MyTeamView'));
const MyProfileModal = lazy(() => import('./MyProfileModal'));
const CreateTicketModal = lazy(() => import('./CreateTicketModal'));

const Navigation = ({
  theme,
  onThemeToggle,
  colorScheme,
  mode,
  onColorSchemeChange,
  onModeChange,
}) => {
  const colors = getThemedColors(theme);
  const navigate = useNavigate();
  const {
    isLoggedIn,
    isCaster,
    isAdmin,
    isMod,
    isPlayer,
    user,
    error: authError,
    isRegistered,
    playerProfile,
    isOnTeam: authIsOnTeam,
    refreshProfile,
  } = useAuth();
  const { unreadCount } = useNotifications();
  const { team: myTeamData, isOnTeam: rosterIsOnTeam, loading: teamsLoading } = useMyTeam();
  const isOnTeam = authIsOnTeam || rosterIsOnTeam;
  const { matches: schedule } = useSchedule();
  const [productionSignupOpen, setProductionSignupOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [casterGreenRoomOpen, setCasterGreenRoomOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [teamCreateOpen, setTeamCreateOpen] = useState(false);
  const [teamManageOpen, setTeamManageOpen] = useState(false);
  const [playerRegOpen, setPlayerRegOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [matchReportOpen, setMatchReportOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [myTeamOpen, setMyTeamOpen] = useState(false);
  const [myProfileOpen, setMyProfileOpen] = useState(false);
  const [myTeamId, setMyTeamId] = useState(null);

  useEffect(() => {
    if (authError) console.error('[EML Auth]', authError);
  }, [authError]);

  // Auto-open registration modal only when profile is confirmed not found (false, not null=loading)
  // and the user is not already on a team per either auth profile or roster lookup
  useEffect(() => {
    if (isLoggedIn && playerProfile === false && !teamsLoading && !isOnTeam) {
      setPlayerRegOpen(true);
    }
  }, [isLoggedIn, playerProfile, teamsLoading, isOnTeam]);

  // Saturday 12pm EST reminder — notify captain if Mon–Fri matches are unsubmitted
  useEffect(() => {
    if (!isLoggedIn || !isPlayer || !user?.id || !myTeamData || !schedule?.length) return;

    const now = new Date();
    // Saturday = 6 in getDay(). Check time >= 12:00 EST (UTC-5 = 17:00 UTC, UTC-4 DST = 16:00 UTC).
    // Use simple UTC offset: 12pm EST = 17:00 UTC (standard) or 16:00 UTC (DST)
    const utcHour = now.getUTCHours();
    const isSaturday = now.getUTCDay() === 6;
    const isPast12EST = utcHour >= 16; // 12pm ET ≈ 16 UTC (DST) or 17 UTC (std)
    if (!isSaturday || !isPast12EST) return;

    // Don't send the same reminder twice in one day
    const reminderKey = `eml_sat_reminder_${user.id}_${now.toISOString().slice(0, 10)}`;
    try {
      if (localStorage.getItem(reminderKey)) return;
    } catch {
      return;
    }

    // Find this week's Mon–Fri matches involving my team that have no confirmed result
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - 6); // 6 days back from Saturday = Monday
    weekStart.setUTCHours(0, 0, 0, 0);

    const unsubmitted = schedule.filter(m => {
      const items = m.participatingTeams?.linkedItems || [];
      const involvesMe = items.some(t => t.name === myTeamData.name);
      if (!involvesMe) return false;
      if (['Completed', 'confirmed', 'resolved'].includes(m.status)) return false;
      const md = new Date(m.matchDate);
      const dayOfWeek = md.getDay();
      return md >= weekStart && dayOfWeek >= 1 && dayOfWeek <= 5; // Mon–Fri
    });

    if (unsubmitted.length === 0) return;

    // Push notification to this captain/co-captain
    emlApi('POST', '/notifications/push', {
      userId: user.id,
      notification: {
        type: 'score_reminder',
        title: '⏰ Score Submission Reminder',
        body: `You have ${unsubmitted.length} unsubmitted match result${unsubmitted.length > 1 ? 's' : ''} from this week. Please submit before Sunday 11:59 PM EST.`,
      },
    }).catch(() => {});

    try {
      localStorage.setItem(reminderKey, '1');
    } catch {
      /* ignore */
    }
  }, [isLoggedIn, isPlayer, user?.id, myTeamData, schedule]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
            <Button
              size="md"
              variant="ghost"
              color={colors.textPrimary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
              onClick={() => navigate('/')}
              aria-label="Home"
              px="2"
              mr="1"
            >
              <Home size={22} />
            </Button>
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
                    bg: colors.bgHover,
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
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/announcements')}
                    >
                      <HStack gap="2">
                        <Megaphone size={14} />
                        <span>Announcements</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="about"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/about')}
                    >
                      <HStack gap="2">
                        <Info size={14} />
                        <span>About EML</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="resources"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/resources')}
                    >
                      <HStack gap="2">
                        <CalendarDays size={14} />
                        <span>Resources</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      value="teams"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/teams')}
                    >
                      <HStack gap="2">
                        <Users size={14} />
                        <span>League Teams</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="rules"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/rules')}
                    >
                      <HStack gap="2">
                        <BookOpen size={14} />
                        <span>League Rules</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="bot"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/bot')}
                    >
                      <HStack gap="2">
                        <Bot size={14} />
                        <span>EML Discord Bot</span>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      value="media"
                      rounded="lg"
                      py="1"
                      px="3"
                      fontSize="sm"
                      color={colors.textPrimary}
                      _hover={{ bg: colors.bgHover }}
                      transition="all 0.15s ease"
                      onClick={() => navigate('/media')}
                    >
                      <HStack gap="2">
                        <Film size={14} />
                        <span>Highlights & Content</span>
                      </HStack>
                    </Menu.Item>
                    {(isAdmin || isMod) && <Menu.Separator />}
                    {(isAdmin || isMod) && (
                      <Menu.Item
                        value="leaderboard"
                        rounded="lg"
                        py="1"
                        px="3"
                        fontSize="sm"
                        color={colors.accentOrange}
                        _hover={{ bg: colors.bgHover }}
                        transition="all 0.15s ease"
                        onClick={() => navigate('/leaderboard')}
                      >
                        <HStack gap="2">
                          <BarChart2 size={14} />
                          <span>Player Leaderboard</span>
                        </HStack>
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
                onClick={() => navigate('/standings')}
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{
                  bg: colors.bgHover,
                  color: colors.accentOrange,
                  transform: 'scale(1.02)',
                }}
              >
                <Trophy size={14} /> Standings
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/matches')}
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{
                  bg: colors.bgHover,
                  color: colors.accentOrange,
                  transform: 'scale(1.02)',
                }}
              >
                <Calendar size={14} /> Matches
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/members')}
                color={colors.textSecondary}
                transition="all 0.15s ease"
                _hover={{
                  bg: colors.bgHover,
                  color: colors.accentOrange,
                  transform: 'scale(1.02)',
                }}
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
                  onMyTeamClick={() => setMyTeamOpen(true)}
                  onMyProfileClick={() => setMyProfileOpen(true)}
                  onRegisterClick={() => setPlayerRegOpen(true)}
                  onUnregisterClick={async () => {
                    if (!confirm('Unregister from the league? You can register again later.'))
                      return;
                    try {
                      await emlApi('POST', '/player/unregister', { discordId: user.id });
                      setPlayerRegOpen(false);
                      refreshProfile();
                      alert('Unregistered successfully.');
                    } catch (err) {
                      console.error(err);
                      alert(err.message || 'Failed to unregister.');
                    }
                  }}
                  onNotificationsClick={() => setNotificationsOpen(true)}
                  onChallengeClick={() => setChallengeOpen(true)}
                  onMatchReportClick={() => setMatchReportOpen(true)}
                  onCreateTicketClick={() => setCreateTicketOpen(true)}
                  onCasterGreenRoomClick={() => setCasterGreenRoomOpen(true)}
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

      {/* Modal-only panels */}
      <Suspense fallback={null}>
        {(isCaster || isAdmin) && (
          <CasterGreenRoom
            theme={theme}
            open={casterGreenRoomOpen}
            onClose={() => setCasterGreenRoomOpen(false)}
          />
        )}
        {isLoggedIn && (
          <NotificationsPanel
            theme={theme}
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        )}
        {isLoggedIn && (
          <TeamCreationModal
            theme={theme}
            open={teamCreateOpen}
            onClose={() => setTeamCreateOpen(false)}
            onCreated={t => {
              setMyTeamId(t.id);
              setTeamCreateOpen(false);
            }}
          />
        )}
        {isLoggedIn && myTeamId && (
          <TeamManagementPanel
            theme={theme}
            open={teamManageOpen}
            onClose={() => setTeamManageOpen(false)}
            teamId={myTeamId}
          />
        )}
        {isLoggedIn && (
          <PlayerRegistrationModal
            theme={theme}
            open={playerRegOpen}
            onClose={() => setPlayerRegOpen(false)}
            onSuccess={refreshProfile}
          />
        )}
        {isLoggedIn && (
          <ChallengeSystem
            theme={theme}
            open={challengeOpen}
            onClose={() => setChallengeOpen(false)}
          />
        )}
        {isLoggedIn && (
          <MatchReportModal
            theme={theme}
            open={matchReportOpen}
            onClose={() => setMatchReportOpen(false)}
          />
        )}
        {isLoggedIn && (
          <CreateTicketModal
            theme={theme}
            open={createTicketOpen}
            onClose={() => setCreateTicketOpen(false)}
          />
        )}
        {isLoggedIn && (
          <MyTeamView
            theme={theme}
            open={myTeamOpen}
            onClose={() => setMyTeamOpen(false)}
            onCreateTeam={() => setTeamCreateOpen(true)}
          />
        )}
        {isLoggedIn && (
          <MyProfileModal
            theme={theme}
            open={myProfileOpen}
            onClose={() => setMyProfileOpen(false)}
          />
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
              onClick={() => navigate('/standings')}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Trophy size={18} />
              <Box fontSize="xs" mt="1">
                Standings
              </Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="2"
              onClick={() => navigate('/matches')}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Calendar size={18} />
              <Box fontSize="xs" mt="1">
                Matches
              </Box>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              flexDirection="column"
              h="auto"
              py="2"
              px="2"
              onClick={() => navigate('/members')}
              color={colors.textSecondary}
              _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
            >
              <Users size={18} />
              <Box fontSize="xs" mt="1">
                Members
              </Box>
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
                  <Box fontSize="xs" mt="1">
                    Discord
                  </Box>
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
