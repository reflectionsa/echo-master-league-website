import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Accordion, Code, Grid } from '@chakra-ui/react';
import { Bot, Zap, Terminal, ExternalLink, Calendar, Users, Trophy, Search } from 'lucide-react';

const commandCategories = [
  {
    title: 'Season Info',
    icon: Calendar,
    commands: [
      { cmd: '/calendar_eu', desc: 'Show EU League Calendar' },
      { cmd: '/calendar_na', desc: 'Show NA League Calendar' },
      { cmd: '/matches', desc: 'Link to upcoming matches list' },
      { cmd: '/ranks', desc: 'Link to team rankings' },
      { cmd: '/rosters', desc: 'Link to roster' },
    ]
  },
  {
    title: 'Team Management',
    icon: Users,
    commands: [
      { cmd: '/teamcreate', desc: 'Create your own team' },
      { cmd: '/teamplayeradd', desc: 'Invite a player to join your team' },
      { cmd: '/teaminviteaccept', desc: 'Join a team' },
      { cmd: '/teamleave', desc: 'Leave your team' },
      { cmd: '/teamdisband', desc: 'Disband your team' },
      { cmd: '/teamplayerkick', desc: 'Remove teammate from your team' },
      { cmd: '/teamplayerpromote', desc: 'Specify Co-Captain of your team' },
      { cmd: '/teamplayerdemote', desc: 'Remove Co-Captain role from your teammate' },
    ]
  },
  {
    title: 'Match Management',
    icon: Trophy,
    commands: [
      { cmd: '/matchdatepropose', desc: 'Propose match date and time to another team' },
      { cmd: '/matchdateaccept', desc: 'Accept match date and time proposed by another team' },
      { cmd: '/matchresultpropose', desc: 'Propose match results to another team' },
      { cmd: '/matchresultaccept', desc: 'Accept match results proposed by another team' },
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
      { cmd: '/rolelookup', desc: 'Show discord members with a specific role' },
    ]
  }
];

const BotView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
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
                  <Bot size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                    EML Discord Bot
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              <VStack gap="6" align="stretch">
                <Text fontSize="md" color={isDark ? 'gray.400' : 'gray.600'}>
                  Manage your team, schedule matches, and track standings directly through Discord. MMR starts at 800.
                </Text>

                <Accordion.Root collapsible defaultValue={['season-info']}>
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

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
                  <Box bg={isDark ? 'whiteAlpha.50' : 'gray.100'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}>
                    <HStack gap="3" mb="4">
                      <Zap size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
                      <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>Features</Text>
                    </HStack>
                    <VStack align="start" gap="2">
                      {['Automated match reminders', 'Real-time score tracking', 'Team roster management', 'Tournament brackets'].map(feature => (
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
                        Track player performance, rankings, and statistics with our comprehensive AP tracking system.
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
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default BotView;
