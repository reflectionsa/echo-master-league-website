import { Dialog, Portal, HStack, Text, CloseButton } from '@chakra-ui/react';
import { Award } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import PlayerLeaderboardSection from './PlayerLeaderboardSection';
import RoutePageLayout from './RoutePageLayout';

const LeaderboardView = ({ theme }) => {
  const colors = getThemedColors(theme);

  return (
    <RoutePageLayout
      maxW="1200px"
      bg={colors.bgSecondary}
      border="1px solid"
      borderColor={colors.borderMedium}
      rounded="2xl"
      overflow="hidden"
    >
      <HStack
        bg={colors.bgTertiary}
        borderBottom="1px solid"
        borderColor={colors.borderMedium}
        px="6"
        py="5"
      >
        <Award size={24} color={colors.accentOrange} />
        <Text fontSize="2xl" fontWeight="800" color={colors.textPrimary}>
          Player Leaderboard
        </Text>
      </HStack>
      <PlayerLeaderboardSection theme={theme} />
    </RoutePageLayout>
  );
};

export default LeaderboardView;
