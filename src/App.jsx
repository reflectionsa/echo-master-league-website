import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [standingsOpen, setStandingsOpen] = useState(false);

  return (
    <Box bg={theme === 'dark' ? 'gray.950' : 'gray.50'} minH="100vh">
      <Navigation 
        theme={theme} 
        onThemeToggle={toggleTheme}
        teamsOpen={teamsOpen}
        setTeamsOpen={setTeamsOpen}
        membersOpen={membersOpen}
        setMembersOpen={setMembersOpen}
        standingsOpen={standingsOpen}
        setStandingsOpen={setStandingsOpen}
      />

      <Box pt="60px">
        <Hero 
          theme={theme}
          onTeamsClick={() => setTeamsOpen(true)}
          onPlayersClick={() => setMembersOpen(true)}
          onSubsClick={() => setStandingsOpen(true)}
        />
      </Box>
    </Box>
  );
};

export default App;
