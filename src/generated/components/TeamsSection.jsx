import { Box, Container, VStack, Text, HStack, Input, InputGroup, createListCollection, Portal, Select } from '@chakra-ui/react';
import { Users, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import TeamRosterTable from './TeamRosterTable';
import { teamRosters } from '../data/teamRosters';

const statusFilters = createListCollection({
  items: [
    { label: 'All Teams', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ],
});

const TeamsSection = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTeams = useMemo(() => {
    return teamRosters.filter(team => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        team.name.toLowerCase().includes(searchLower) ||
        team.captain.toLowerCase().includes(searchLower) ||
        team.coCaptain.toLowerCase().includes(searchLower) ||
        team.players.some(p => p.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <Box id="teams" py="20" bg={isDark ? 'gray.900' : 'white'}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Users size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                All Teams
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              League Teams
            </Text>
            <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'} maxW="3xl">
              Explore all competing teams in the Echo Master League
            </Text>
          </VStack>

          <HStack gap="4" w="full" flexWrap="wrap">
            <InputGroup flex="1" minW="300px" startElement={<Search size={18} />}>
              <Input
                placeholder="Search teams, captains, or players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={isDark ? 'whiteAlpha.50' : 'white'}
                borderColor={isDark ? 'whiteAlpha.200' : 'blackAlpha.200'}
                rounded="lg"
              />
            </InputGroup>
            <Select.Root
              collection={statusFilters}
              value={[statusFilter]}
              onValueChange={(e) => setStatusFilter(e.value[0])}
              width="180px"
              size="md"
            >
              <Select.HiddenSelect />
              <Select.Control bg={isDark ? 'whiteAlpha.50' : 'white'} rounded="lg">
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {statusFilters.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </HStack>

          <TeamRosterTable teams={filteredTeams} theme={theme} />

          {filteredTeams.length === 0 && (
            <Box py="12" textAlign="center">
              <Text fontSize="lg" fontWeight="600" color={isDark ? 'gray.400' : 'gray.600'}>
                No teams found
              </Text>
              <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.500'} mt="2">
                Try adjusting your search or filter
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default TeamsSection;
