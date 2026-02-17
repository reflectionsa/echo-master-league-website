import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Input } from '@chakra-ui/react';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';
import TeamRosterTable from './TeamRosterTable';
import { teamRosters } from '../data/teamRosters';
import { emlColors } from '../theme/colors';

const TeamsView = ({ theme, open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teamRosters.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.captain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.coCaptain && team.coCaptain.toLowerCase().includes(searchQuery.toLowerCase())) ||
    team.players.some(p => p && p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}99`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="95vw"
            maxH="90vh"
            bg={emlColors.bgSecondary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Users size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    League Teams
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              <VStack gap="6" align="stretch">
                <Box position="relative" maxW="400px">
                  <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color={emlColors.textMuted} zIndex="1">
                    <Search size={16} />
                  </Box>
                  <Input
                    pl="10"
                    rounded="xl"
                    fontSize="sm"
                    bg={emlColors.bgElevated}
                    border="1px solid"
                    borderColor={emlColors.borderMedium}
                    color={emlColors.textPrimary}
                    placeholder="Search teams or players..."
                    _placeholder={{ color: emlColors.textMuted }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Box>

                <TeamRosterTable teams={filteredTeams} theme={theme} />
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TeamsView;
