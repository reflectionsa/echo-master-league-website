import { Box, HStack, VStack, Text, Grid, Badge, For } from '@chakra-ui/react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useTrophies } from '../hooks/useTrophies';
import { getThemedColors } from '../theme/colors';

const TrophyCase = ({ teamName, theme }) => {
  const emlColors = getThemedColors(theme);
  const { getTeamTrophies, getChampionshipCount } = useTrophies();
  const trophies = getTeamTrophies(teamName);
  const championshipCount = getChampionshipCount(teamName);

  if (trophies.length === 0) {
    return null; // Don't show if no trophies
  }

  const getTrophyIcon = (placement) => {
    switch (placement?.toLowerCase()) {
      case '1st':
      case 'champion':
        return { icon: Trophy, color: '#fbbf24' }; // Gold
      case '2nd':
      case 'runner-up':
        return { icon: Medal, color: '#d1d5db' }; // Silver
      case '3rd':
        return { icon: Medal, color: '#cd7f32' }; // Bronze
      case 'finalist':
        return { icon: Award, color: emlColors.accentCyan };
      default:
        return { icon: Star, color: emlColors.textMuted };
    }
  };

  const getTrophyBadgeColor = (placement) => {
    switch (placement?.toLowerCase()) {
      case '1st':
      case 'champion':
        return 'yellow';
      case '2nd':
      case 'runner-up':
        return 'gray';
      case '3rd':
        return 'orange';
      case 'finalist':
        return 'cyan';
      default:
        return 'blue';
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb="4">
        <HStack gap="2">
          <Trophy size={20} color={emlColors.accentOrange} />
          <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>
            Trophy Case
          </Text>
        </HStack>
        {championshipCount > 0 && (
          <HStack gap="1">
            <For each={Array(championshipCount).fill(0)}>
              {(_, index) => (
                <Star key={index()} size={16} color="#fbbf24" fill="#fbbf24" />
              )}
            </For>
            <Text fontSize="sm" fontWeight="600" color={emlColors.accentOrange} ml="1">
              {championshipCount}x Champion
            </Text>
          </HStack>
        )}
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="3">
        <For each={trophies}>
          {(trophy) => {
            const { icon: TrophyIcon, color: iconColor } = getTrophyIcon(trophy.placement);
            return (
              <Box
                key={trophy.id}
                bg={`${emlColors.textPrimary}08`}
                border="1px solid"
                borderColor={emlColors.borderMedium}
                rounded="xl"
                p="4"
                _hover={{ borderColor: iconColor }}
                transition="all 0.2s"
              >
                <HStack gap="3" mb="2">
                  <Box
                    bg={`${iconColor}20`}
                    p="2"
                    rounded="lg"
                  >
                    <TrophyIcon size={24} color={iconColor} />
                  </Box>
                  <VStack align="start" gap="0" flex="1">
                    <Badge colorPalette={getTrophyBadgeColor(trophy.placement)} size="sm">
                      {trophy.placement}
                    </Badge>
                    <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary}>
                      {trophy.tournament}
                    </Text>
                  </VStack>
                </HStack>
                <VStack align="start" gap="1">
                  <Text fontSize="xs" color={emlColors.textMuted}>
                    Season: {trophy.season}
                  </Text>
                  {trophy.date && (
                    <Text fontSize="xs" color={emlColors.textMuted}>
                      {new Date(trophy.date).toLocaleDateString()}
                    </Text>
                  )}
                </VStack>
              </Box>
            );
          }}
        </For>
      </Grid>
    </Box>
  );
};

export default TrophyCase;
