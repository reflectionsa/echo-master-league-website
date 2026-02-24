import { HStack, Tooltip, For } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import { useTrophies } from '../hooks/useTrophies';

/**
 * Championship Stars Component
 * Displays star icons for each championship won by a team
 */
const ChampionshipStars = ({ teamName, size = 16, maxDisplay = 5 }) => {
  const { getChampionshipCount } = useTrophies();
  const count = getChampionshipCount(teamName);

  if (count === 0) {
    return null;
  }

  // If more than maxDisplay, show count as number
  if (count > maxDisplay) {
    return (
      <Tooltip content={`${count} Championships`}>
        <HStack gap="1">
          <For each={Array(maxDisplay).fill(0)}>
            {(_, index) => (
              <Star key={index()} size={size} color="#fbbf24" fill="#fbbf24" />
            )}
          </For>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
            +{count - maxDisplay}
          </span>
        </HStack>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={`${count} Championship${count !== 1 ? 's' : ''}`}>
      <HStack gap="1">
        <For each={Array(count).fill(0)}>
          {(_, index) => (
            <Star key={index()} size={size} color="#fbbf24" fill="#fbbf24" />
          )}
        </For>
      </HStack>
    </Tooltip>
  );
};

export default ChampionshipStars;
