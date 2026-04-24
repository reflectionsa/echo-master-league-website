import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { getThemedColors } from './theme/colors';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const App = () => {
  const { theme, toggleTheme, colorScheme, mode, setColorScheme, setMode } = useTheme();
  const colors = getThemedColors(theme);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersCategory, setMembersCategory] = useState(null);
  const [standingsOpen, setStandingsOpen] = useState(false);

  return (
    <AuthProvider>
      <Box
        bg={colors.bgCard}
        minH="100vh"
        transition="background-color 0.3s ease"
      >
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
            onPlayersClick={() => { setMembersCategory(null); setMembersOpen(true); }}
            onSubsClick={() => { setMembersCategory('subs'); setMembersOpen(true); }}
          />
        </Box>
      </Box>
    </AuthProvider>
  );
};

export default App;
