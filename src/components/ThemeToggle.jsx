import { IconButton } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <IconButton
      onClick={onToggle}
      rounded="full"
      size="sm"
      bg={theme === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.200'}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={theme === 'dark' ? 'whiteAlpha.300' : 'blackAlpha.300'}
      color={theme === 'dark' ? 'orange.300' : 'blue.600'}
      _hover={{
        bg: theme === 'dark' ? 'whiteAlpha.300' : 'blackAlpha.300',
        transform: 'rotate(180deg)',
        borderColor: theme === 'dark' ? 'orange.400' : 'blue.400'
      }}
      transition="all 0.4s ease"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
};

export default ThemeToggle;
