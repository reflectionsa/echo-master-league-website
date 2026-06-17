import { useState } from 'react';
import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Accordion, Code } from '@chakra-ui/react';
import { Bot, Terminal, ExternalLink, Calendar, Users, Trophy, Search, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMyTeam } from '../hooks/useMyTeam';
import { useTeamManagement } from '../hooks/useTeamManagement';
import { getThemedColors } from '../theme/colors';

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

const BotView = ({ theme, open, onClose, onRegisterClick }) => {
  const emlColors = getThemedColors(theme);
  const { user, isLoggedIn, isRegistered } = useAuth();
  const { team, myRole, isOnTeam } = useMyTeam();
  const { disbandTeam, unregisterProfile, loading } = useTeamManagement();
  const [actionMessage, setActionMessage] = useState(null);

  const isCaptain = myRole === 'Captain' || myRole === 'Co-Captain';

  const handleDisband = async () => {
    if (!team?.id || !isCaptain) return;
    if (!confirm('Disband your team? This cannot be undone.')) return;
    try {
      await disbandTeam(team.id);
      setActionMessage('Team disbanded successfully.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to disband team.');
    }
  };

  const handleUnregister = async () => {
    if (!isLoggedIn) return;
    if (!confirm('Unregister from the league? You can register again later.')) return;
    try {
      await unregisterProfile();
      setActionMessage('You have been unregistered successfully.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to unregister.');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            maxH="90vh"
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={`${emlColors.bgPrimary}dd`} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Bot size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    EML Discord Bot
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" color={emlColors.textPrimary} _hover={{ color: emlColors.accentOrange }} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              <VStack gap="6" align="stretch">
                <Text fontSize="md" color={emlColors.textMuted}>
                  Manage your team, schedule matches, and track standings directly through Discord. MMR starts at 800.
                </Text>

                {actionMessage && (
                  <Box bg="rgba(16,185,129,0.12)" border="1px solid rgba(16,185,129,0.25)" rounded="xl" p="4">
                    <Text color="#10b981" fontSize="sm">{actionMessage}</Text>
                  </Box>
                )}

                <Box bg={emlColors.bgElevated} border="1px solid" borderColor={emlColors.borderMedium} rounded="2xl" p="4">
                  <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} mb="3">Quick Actions</Text>
                  <HStack wrap="wrap" gap="3">
                    <Button
                      size="sm"
                      variant="solid"
                      bg="linear-gradient(135deg, #2f6fff 0%, #1c8dff 100%)"
                      color="white"
                      onClick={onRegisterClick}
                    >
                      Register / Set Region
                    </Button>
                    {isLoggedIn && isOnTeam && isCaptain && (
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="#ef4444"
                        color="#ef4444"
                        _hover={{ bg: 'rgba(239,68,68,0.08)' }}
                        onClick={handleDisband}
                        isLoading={loading}
                      >
                        Disband Team
                      </Button>
                    )}
                    {isLoggedIn && isRegistered && !isOnTeam && (
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="#ffb703"
                        color="#ffb703"
                        _hover={{ bg: 'rgba(255,184,3,0.1)' }}
                        onClick={handleUnregister}
                        isLoading={loading}
                      >
                        Unregister from League
                      </Button>
                    )}
                  </HStack>
                </Box>

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
                                    <HStack key={cmd.cmd} gap="3" p="3" bg={`${emlColors.bgPrimary}99`} rounded="lg">
                                      <Code bg={`${emlColors.accentOrange}22`} px="2" py="1" rounded="md" fontSize="sm" fontWeight="600" color={emlColors.accentOrange}>
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

                </Accordion.Root>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default BotView;
