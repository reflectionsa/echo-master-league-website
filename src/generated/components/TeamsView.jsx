import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Input } from '@chakra-ui/react';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';
import TeamRosterTable from './TeamRosterTable';
import { teamRosters } from '../data/teamRosters';

const TeamsView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';
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
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="95vw"
            maxH="90vh"
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={isDark ? 'gray.850' : 'gray.50'} borderBottom="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Users size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                  <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color={isDark ? 'gray.500' : 'gray.400'} zIndex="1">
                    <Search size={16} />
                  </Box>
                  <Input
                    pl="10"
                    rounded="xl"
                    fontSize="sm"
                    bg={isDark ? 'gray.800' : 'gray.100'}
                    border="1px solid"
                    borderColor={isDark ? 'gray.700' : 'gray.200'}
                    color={isDark ? 'white' : 'gray.900'}
                    placeholder="Search teams or players..."
                    _placeholder={{ color: isDark ? 'gray.500' : 'gray.500' }}
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
