import { Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import TeamsView from './components/TeamsView';
import MembersView from './components/MembersView';
import LeaderboardView from './components/LeaderboardView';
import AnnouncementsView from './components/AnnouncementsView';
import AboutView from './components/AboutView';
import CalendarView from './components/CalendarView';
import ResourcesView from './components/ResourcesView';
import RulesView from './components/RulesView';
import BotView from './components/BotView';
import MediaView from './components/MediaView';

// Homepage sections
const HomePage = ({ theme }) => (
  <>
    <Hero theme={theme} />
    <SeasonHighlight theme={theme} />
    <MatchesOfWeek theme={theme} />
    <AnnouncementsSection theme={theme} />
    <SeasonCountdown theme={theme} />
  </>
);

const App = () => {
  const { theme, toggleTheme, colorScheme, mode, setColorScheme, setMode } = useTheme();
  const colors = getThemedColors(theme);

  return (
    <BrowserRouter>
    <ParticlesProvider init={particlesInit}>
    <AuthProvider>
      <Box
        minH="100vh"
        transition="background-color 0.3s ease"
        style={{ backgroundColor: colors.bgPrimary }}
      >
        <FloatingShapes colorScheme={colorScheme} mode={mode} />

        <Box position="relative" zIndex="1">
        <Navigation
          theme={theme}
          onThemeToggle={toggleTheme}
          colorScheme={colorScheme}
          mode={mode}
          onColorSchemeChange={setColorScheme}
          onModeChange={setMode}
        />

        <Box pt="60px" pb={{ base: '72px', md: '0' }}>
          <Routes>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/matches" element={<MatchesView theme={theme} />} />
            <Route path="/teams" element={<TeamsView theme={theme} />} />
            <Route path="/members" element={<MembersView theme={theme} />} />
            <Route path="/standings" element={<LeaderboardView theme={theme} />} />
            <Route path="/announcements" element={<AnnouncementsView theme={theme} />} />
            <Route path="/about" element={<AboutView theme={theme} />} />
            <Route path="/calendar" element={<CalendarView theme={theme} />} />
            <Route path="/resources" element={<ResourcesView theme={theme} />} />
            <Route path="/rules" element={<RulesView theme={theme} />} />
            <Route path="/bot" element={<BotView theme={theme} />} />
            <Route path="/media" element={<MediaView theme={theme} />} />
            <Route path="/leaderboard" element={<LeaderboardView theme={theme} />} />
          </Routes>
        </Box>
        </Box>
      </Box>
      <DataChangeNotifier theme={theme} />
    </AuthProvider>
    </ParticlesProvider>
    </BrowserRouter>
  );
};

export default App;
