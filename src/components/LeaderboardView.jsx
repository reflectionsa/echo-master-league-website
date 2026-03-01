import { Dialog, Portal, HStack, Text, CloseButton } from '@chakra-ui/react';
import { Award } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import PlayerLeaderboardSection from './PlayerLeaderboardSection';

const LeaderboardView = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${colors.bgPrimary}b3`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="90vw"
            maxH="90vh"
            bg={colors.bgSecondary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={colors.bgTertiary} borderBottom="1px solid" borderColor={colors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Award size={24} color={colors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={colors.textPrimary}>
                    Player Leaderboard
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="0" overflowY="auto">
              <PlayerLeaderboardSection theme={theme} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LeaderboardView;
