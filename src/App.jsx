import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { ParticlesProvider } from '@tsparticles/react';
import { useTheme } from './hooks/useTheme';
import { getThemedColors } from './theme/colors';
import { AuthProvider } from './context/AuthContext';
import { particlesInit } from './utils/particlesInit';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import DataChangeNotifier from './components/DataChangeNotifier';
import FloatingShapes from './components/FloatingShapes';
import AnnouncementsSection from './components/AnnouncementsSection';
import MatchesOfWeek from './components/MatchesOfWeek';
import SeasonHighlight from './components/SeasonHighlight';
import SeasonCountdown from './components/SeasonCountdown';
import MatchesView from './components/MatchesView';

const App = () => {
  const { theme, toggleTheme, colorScheme, mode, setColorScheme, setMode } = useTheme();
  const colors = getThemedColors(theme);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersCategory, setMembersCategory] = useState(null);
  const [standingsOpen, setStandingsOpen] = useState(false);
  const [matchesOpen, setMatchesOpen] = useState(false);

  return (
    <ParticlesProvider init={particlesInit}>
    <AuthProvider>
      <Box
        minH="100vh"
        transition="background-color 0.3s ease"
        style={{ backgroundColor: colors.bgPrimary }}
      >
        {/* Ambient floating geometric shapes (fixed, behind all content) */}
        <FloatingShapes colorScheme={colorScheme} mode={mode} />

        <Box position="relative" zIndex="1">
        <Navigation
          theme={theme}
          onThemeToggle={toggleTheme}
          colorScheme={colorScheme}
          mode={mode}
          onColorSchemeChange={setColorScheme}
          onModeChange={setMode}
          teamsOpen={teamsOpen}
          setTeamsOpen={setTeamsOpen}
          membersOpen={membersOpen}
          setMembersOpen={setMembersOpen}
          membersCategory={membersCategory}
          setMembersCategory={setMembersCategory}
          standingsOpen={standingsOpen}
          setStandingsOpen={setStandingsOpen}
        />

        <Box pt="60px" pb={{ base: '72px', md: '0' }}>
          <Hero
            theme={theme}
            onTeamsClick={() => setTeamsOpen(true)}
            onPlayersClick={() => { setMembersCategory('active'); setMembersOpen(true); }}
            onSubsClick={() => { setMembersCategory('subs'); setMembersOpen(true); }}
            onMatchesClick={() => setMatchesOpen(true)}
          />
          {/* Season highlight rotator */}
          <SeasonHighlight theme={theme} />
          {/* Live/recent match cards for this week */}
          <MatchesOfWeek theme={theme} />
          {/* Announcements pulled live from Discord */}
          <AnnouncementsSection theme={theme} />
          {/* Between-seasons countdown hype */}
          <SeasonCountdown theme={theme} />
        </Box>
        </Box>
      </Box>
      {/* Matches modal — triggered by LiveMatchPulse or nav */}
      <MatchesView theme={theme} open={matchesOpen} onClose={() => setMatchesOpen(false)} />
      <DataChangeNotifier theme={theme} />
    </AuthProvider>
    </ParticlesProvider>
  );
};

export default App;
