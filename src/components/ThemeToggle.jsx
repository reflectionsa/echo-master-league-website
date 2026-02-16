import { IconButton } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';
import { emlColors } from '../theme/colors';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <IconButton
      onClick={onToggle}
      rounded="full"
      size="sm"
      bg={`${emlColors.bgElevated}80`}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={emlColors.borderMedium}
      color={emlColors.accentOrange}
      _hover={{
        bg: `${emlColors.bgElevated}99`,
        transform: 'rotate(180deg)',
        borderColor: emlColors.accentOrange
      }}
      transition="all 0.4s ease"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
};

export default ThemeToggle;
