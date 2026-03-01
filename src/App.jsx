import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersCategory, setMembersCategory] = useState(null);
  const [standingsOpen, setStandingsOpen] = useState(false);

  return (
    <AuthProvider>
      <Box bg={theme === 'dark' ? 'gray.950' : 'gray.50'} minH="100vh">
        <Navigation
          theme={theme}
          onThemeToggle={toggleTheme}
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
