import { Box, Dialog, Portal, Table, Text, HStack, Spinner, Center, Badge, CloseButton, Input, InputGroup, Image } from '@chakra-ui/react';
import { Trophy, Search } from 'lucide-react';
import { useState } from 'react';
import { useStandings } from '../hooks/useStandings';
import TeamProfileModal from './TeamProfileModal';

const tierImages = {
  Master: 'https://cdn.discordapp.com/emojis/1429992743207309462.webp?size=80',
  Diamond: 'https://cdn.discordapp.com/emojis/1429992740942385152.webp?size=80',
  Platinum: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472871797820096555/content.png?ex=69942641&is=6992d4c1&hm=a4f6ec61690c89480c7235cf454f0ea37d325d40606b93da2b3867c304a59b4c&',
  Gold: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472872310464712775/width240.png?ex=699426bb&is=6992d53b&hm=4e35d0dcaa7ab0d3df98faadaafe3c82b433bebe6456dc44ddd5860c6bd9b1dd&animated=true',
};

const StandingsView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';
  const { standings, loading } = useStandings();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = standings.filter(team => 
    team.team.toLowerCase().includes(search.toLowerCase()) ||
    team.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="90vw"
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
                    <Trophy size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                    <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                      League Standings
                    </Dialog.Title>
                  </HStack>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="lg" />
                  </Dialog.CloseTrigger>
                </HStack>
              </Dialog.Header>
              <Dialog.Body p="6" overflowY="auto">
                <Box mb="4">
                  <InputGroup startElement={<Search size={16} />}>
                    <Input
                      placeholder="Search teams..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      bg={isDark ? 'gray.850' : 'white'}
                      borderColor={isDark ? 'gray.700' : 'gray.300'}
                    />
                  </InputGroup>
                </Box>
                {loading ? (
                  <Center py="20"><Spinner size="xl" color={isDark ? 'orange.500' : 'blue.500'} /></Center>
                ) : (
                  <Box overflowX="auto">
                    <Table.Root size="md" variant="outline">
                      <Table.Header bg={isDark ? 'gray.850' : 'gray.50'}>
                        <Table.Row>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase">POS</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase">RANK</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase">TEAM</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase">REG</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase" textAlign="center">WIN</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase" textAlign="center">LOSS</Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'} textTransform="uppercase" textAlign="end">MMR</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {filtered.map(team => (
                          <Table.Row
                            key={team.id}
                            bg={team.position <= 3 ? (isDark ? 'whiteAlpha.50' : 'blue.50') : 'transparent'}
                            _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.50' }}
                            transition="background 0.2s"
                          >
                            <Table.Cell>
                              <HStack gap="2">
                                {team.position <= 3 && <Trophy size={14} color={team.position === 1 ? '#fbbf24' : team.position === 2 ? '#d1d5db' : '#cd7f32'} />}
                                <Text fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{team.position}</Text>
                              </HStack>
                            </Table.Cell>
                            <Table.Cell>
                              {tierImages[team.tier] ? (
                                <Image src={tierImages[team.tier]} alt={team.tier} w="32px" h="32px" objectFit="contain" />
                              ) : (
                                <Badge colorPalette="gray" size="sm" px="2" py="0.5">
                                  {team.tier}
                                </Badge>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <Text
                                fontWeight="600"
                                color={isDark ? 'orange.300' : 'blue.600'}
                                cursor="pointer"
                                _hover={{ textDecoration: 'underline' }}
                                onClick={() => setSelectedTeam(team.team)}
                              >
                                {team.team}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge colorPalette="cyan" size="sm">{team.region}</Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text fontWeight="700" color="green.500">{team.wins}</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text fontWeight="700" color="red.500">{team.losses}</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                              <Text fontWeight="800" fontSize="lg" color={isDark ? 'orange.400' : 'blue.600'}>{team.mmr}</Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <TeamProfileModal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        teamName={selectedTeam}
        theme={theme}
      />
    </>
  );
};

export default StandingsView;