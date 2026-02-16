import { Box } from '@chakra-ui/react';
import { useTheme } from './hooks/useTheme';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box bg={theme === 'dark' ? 'gray.950' : 'gray.50'} minH="100vh">
      <Navigation theme={theme} onThemeToggle={toggleTheme} />

      <Box pt="60px">
        <Hero theme={theme} />
      </Box>
    </Box>
  );
};

export default App;
