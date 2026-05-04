import { Box, Container, VStack, Text, HStack, Code, Button, Accordion } from '@chakra-ui/react';
import { Terminal, Bot, ExternalLink, Calendar, Users, Trophy, Search, BookOpen, Shield } from 'lucide-react';
import { emlColors } from '../theme/colors';

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

  return (
    <Box id="bot" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Bot size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Automation
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              EML Discord Bot
            </Text>
            <Text fontSize="lg" color={emlColors.textMuted} maxW="2xl">
              Manage your team, schedule matches, and track standings directly through Discord. MMR starts at 800.
            </Text>
          </VStack>

          <Accordion.Root collapsible w="full">
            <Accordion.Item value="bot-instructions" bg={emlColors.bgElevated} border="1px solid" borderColor={emlColors.borderMedium} rounded="xl" mb="3">
              <Accordion.ItemTrigger p="5" _hover={{ bg: `${emlColors.bgElevated}dd` }}>
                <HStack gap="3" flex="1">
                  <BookOpen size={20} color={emlColors.accentOrange} />
                  <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>EML Bot Instructions</Text>
                </HStack>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Box px="5" pb="5">
                  <Accordion.Root collapsible defaultValue={['season-info']}>
                    {commandCategories.map((category, idx) => (
                      <Accordion.Item key={idx} value={category.title.toLowerCase().replace(/\s+/g, '-')} bg={emlColors.bgPrimary} border="1px solid" borderColor={emlColors.borderMedium} rounded="xl" mb="3">
                        <Accordion.ItemTrigger p="4" _hover={{ bg: `${emlColors.bgPrimary}dd` }}>
                          <HStack gap="3" flex="1">
                            <category.icon size={18} color={emlColors.accentOrange} />
                            <Text fontSize="md" fontWeight="700" color={emlColors.textPrimary}>{category.title}</Text>
                          </HStack>
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                          <VStack align="stretch" gap="2" px="4" pb="4">
                            {category.commands.map(cmd => (
                              <HStack key={cmd.cmd} gap="3" p="3" bg={emlColors.bgElevated} rounded="lg">
                                <Code bg={emlColors.bgTertiary} px="2" py="1" rounded="md" fontSize="sm" fontWeight="600" color={emlColors.accentOrange}>
                                  {cmd.cmd}
                                </Code>
                                <Text fontSize="sm" color={emlColors.textMuted} flex="1">{cmd.desc}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </Box>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="ap-system" bg={emlColors.bgElevated} border="1px solid" borderColor={emlColors.borderMedium} rounded="xl" mb="3">
              <Accordion.ItemTrigger p="5" _hover={{ bg: `${emlColors.bgElevated}dd` }}>
                <HStack gap="3" flex="1">
                  <Shield size={20} color={emlColors.accentOrange} />
                  <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>AP System</Text>
                </HStack>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <VStack align="start" gap="3" px="5" pb="5">
                  <Text fontSize="sm" color={emlColors.textMuted}>
                    Track player performance, rankings, and statistics with our comprehensive AP (Activity Points) tracking system.
                  </Text>
                  <Button
                    size="sm"
                    colorPalette="orange"
                    onClick={() => window.open('https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSJmIGHxYlgMAy2Wvlz-pSx27iDTjBdzQbe7BCSu6qXCHk1kBTxwDJu0yAQuy0Msm3KLnIY2MwvMC8t/pubhtml', '_blank')}
                    w="full"
                  >
                    <ExternalLink size={14} />
                    View AP System
                  </Button>
                </VStack>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </VStack>
      </Container>
    </Box>
  );
};

export default BotSection;
