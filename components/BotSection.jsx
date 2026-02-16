import { Box, Container, VStack, Text, HStack, Code, Grid, Button, Accordion } from '@chakra-ui/react';
import { Terminal, Bot, Zap, ExternalLink, Calendar, Users, Trophy, Search } from 'lucide-react';

const commandCategories = [
  {
    title: 'Season Info',
    icon: Calendar,
    commands: [
      { cmd: '/calendar_eu', desc: 'Show EU League Calendar' },
      { cmd: '/calendar_na', desc: 'Show NA League Calendar' },
      { cmd: '/matches', desc: 'Link to upcoming matches list' },
      { cmd: '/ranks', desc: 'Link to team rankings' },
      { cmd: '/rosters', desc: 'Link to roster' }
    ]
  },
  {
    title: 'Team Management',
    icon: Users,
    commands: [
      { cmd: '/teamcreate', desc: 'Create your own team' },
      { cmd: '/teaminviteaccept', desc: 'Join a team' },
      { cmd: '/teamplayeradd', desc: 'Invite a player to join your team' },
      { cmd: '/teamleave', desc: 'Leave your team' },
      { cmd: '/teamdisband', desc: 'Disband your team' },
      { cmd: '/teamplayerkick', desc: 'Remove teammate from your team' },
      { cmd: '/teamplayerpromote', desc: 'Specify Co-Captain of your team' },
      { cmd: '/teamplayerdemote', desc: 'Remove Co-Captain role from your teammate' }
    ]
  },
  {
    title: 'Match Management',
    icon: Trophy,
    commands: [
      { cmd: '/matchdatepropose', desc: 'Propose match date and time to another team' },
      { cmd: '/matchdateaccept', desc: 'Accept match date and time proposed by another team' },
      { cmd: '/matchresultpropose', desc: 'Propose match results to another team' },
      { cmd: '/matchresultaccept', desc: 'Accept match results proposed by another team' }
    ]
  },
  {
    title: 'Player & Lookup',
    icon: Search,
    commands: [
      { cmd: '/playerregister', desc: 'Register into the League' },
      { cmd: '/playerunregister', desc: 'Unregister from the League' },
      { cmd: '/lookupplayer', desc: 'Show player details' },
      { cmd: '/lookupteam', desc: 'Show team details' },
      { cmd: '/listcooldownplayers', desc: 'Show players who recently left a team' },
      { cmd: '/rolelookup', desc: 'Show discord members with a specific role' }
    ]
  }
];

const BotSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="bot" py="20" bg={isDark ? 'gray.950' : 'gray.50'}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Bot size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Automation
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              EML Discord Bot
            </Text>
            <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'} maxW="2xl">
              Manage your team, schedule matches, and track standings directly through Discord. MMR starts at 800.
            </Text>
          </VStack>

          <Accordion.Root collapsible w="full" defaultValue={['season-info']}>
            {commandCategories.map((category, idx) => (
              <Accordion.Item key={idx} value={category.title.toLowerCase().replace(/\s+/g, '-')} bg={isDark ? 'whiteAlpha.50' : 'white'} border="1px solid" borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'} rounded="xl" mb="3">
                <Accordion.ItemTrigger p="5" _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.50' }}>
                  <HStack gap="3" flex="1">
                    <category.icon size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
                    <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{category.title}</Text>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <VStack align="stretch" gap="2" px="5" pb="5">
                    {category.commands.map(cmd => (
                      <HStack key={cmd.cmd} gap="3" p="3" bg={isDark ? 'blackAlpha.300' : 'gray.50'} rounded="lg">
                        <Code bg={isDark ? 'blackAlpha.500' : 'white'} px="2" py="1" rounded="md" fontSize="sm" fontWeight="600" color={isDark ? 'orange.300' : 'blue.600'}>
                          {cmd.cmd}
                        </Code>
                        <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} flex="1">{cmd.desc}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
            <Box bg={isDark ? 'whiteAlpha.50' : 'gray.100'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}>
              <HStack gap="3" mb="4">
                <Zap size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
                <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>Features</Text>
              </HStack>
              <VStack align="start" gap="2">
                {['Automated match reminders and notifications', 'Real-time score tracking and updates', 'Team management and roster changes', 'Tournament bracket generation'].map(feature => (
                  <Text key={feature} fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>• {feature}</Text>
                ))}
              </VStack>
            </Box>

            <Box bg={isDark ? 'whiteAlpha.50' : 'gray.100'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}>
              <HStack gap="3" mb="4">
                <Terminal size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
                <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>AP System</Text>
              </HStack>
              <VStack align="start" gap="3">
                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                  Track player performance, rankings, and statistics with our comprehensive AP (Activity Points) tracking system.
                </Text>
                <Button
                  size="sm"
                  colorPalette={isDark ? 'orange' : 'blue'}
                  onClick={() => window.open('https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSJmIGHxYlgMAy2Wvlz-pSx27iDTjBdzQbe7BCSu6qXCHk1kBTxwDJu0yAQuy0Msm3KLnIY2MwvMC8t/pubhtml', '_blank')}
                  w="full"
                >
                  <ExternalLink size={14} />
                  View AP System
                </Button>
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default BotSection;
