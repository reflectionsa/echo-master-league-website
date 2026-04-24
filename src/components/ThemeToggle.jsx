import { IconButton } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const ThemeToggle = ({ theme, onToggle }) => {
  const colors = getThemedColors(theme);
  const isDark = theme.endsWith('-dark') || theme === 'dark';

  return (
    <IconButton
      onClick={onToggle}
      rounded="full"
      size="sm"
      bg={`${colors.bgElevated}80`}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={colors.borderMedium}
      color={colors.accentOrange}
      _hover={{
        bg: `${colors.bgElevated}99`,
        transform: 'rotate(180deg)',
        borderColor: colors.accentOrange
      }}
      transition="all 0.4s ease"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
};

export default ThemeToggle;
