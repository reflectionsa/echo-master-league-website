import { Box, Container, VStack, Text, Accordion, HStack, Button } from '@chakra-ui/react';
import { FileText, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

const rules = [
  { title: 'Eligibility', content: 'All players must be registered members with verified accounts. Teams must maintain minimum 5 active players.' },
  { title: 'Match Rules', content: 'Matches follow official Echo VR competitive ruleset. Best of 3 format for regular season, best of 5 for playoffs.' },
  { title: 'Fair Play', content: 'Zero tolerance for cheating, exploits, or unsportsmanlike conduct. Violations result in immediate disqualification.' },
  { title: 'Communication', content: 'All teams must join official Discord server. Match coordination happens via designated channels.' },
  { title: 'Scheduling', content: 'Teams must confirm match availability 48 hours in advance. Reschedules require admin approval.' }
];

const conduct = [
  'Respect all players, staff, and community members',
  'No harassment, hate speech, or toxic behavior',
  'Follow tournament officials\' decisions',
  'Report violations immediately to admins'
];

const RulesSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="rules" py="20" bg={isDark ? 'gray.900' : 'white'}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <FileText size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Rules & Guidelines
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              League Rules
            </Text>
            <Button
              size="sm"
              colorPalette={isDark ? 'orange' : 'blue'}
              onClick={() => window.open('https://echomasterleague.com/eml-league-rules/', '_blank')}
            >
              <ExternalLink size={14} />
              View Full Rule Book
            </Button>
          </VStack>

          <Box w="full" bg={isDark ? 'whiteAlpha.50' : 'gray.50'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}>
            <Accordion.Root collapsible>
              {rules.map((rule, idx) => (
                <Accordion.Item key={idx} value={`rule-${idx}`} borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}>
                  <Accordion.ItemTrigger py="4" color={isDark ? 'white' : 'gray.900'} fontWeight="600">
                    {rule.title}
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent pb="4" color={isDark ? 'gray.400' : 'gray.600'}>
                    {rule.content}
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Box>

          <Box w="full" bg={isDark ? 'orange.500/10' : 'blue.500/10'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'orange.400' : 'blue.400'}>
            <HStack gap="3" mb="4">
              <Shield size={24} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="xl" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>Code of Conduct</Text>
            </HStack>
            <VStack align="start" gap="2">
              {conduct.map((item, idx) => (
                <HStack key={idx} gap="2" align="start">
                  <AlertTriangle size={16} color={isDark ? '#fb923c' : '#3b82f6'} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <Text fontSize="sm" color={isDark ? 'gray.300' : 'gray.700'}>{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default RulesSection;
