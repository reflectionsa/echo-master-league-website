import {
  Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton,
} from '@chakra-ui/react';
import { Ticket, ExternalLink, ChevronRight, Trophy, Cpu, Swords, Server, Tv } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

// EML create-a-ticket Discord channel
const DISCORD_TICKET_URL = 'https://discord.com/channels/1182380144887865406/1182380148436242475';

const TICKET_TYPES = [
  {
    id: 'league-support',
    icon: Trophy,
    title: 'League Support',
    description: 'General league questions, registration issues, team problems, rule clarifications, or anything admin-related.',
    color: '#f59e0b',
  },
  {
    id: 'tech-support',
    icon: Cpu,
    title: 'Tech Support',
    description: 'Having technical issues with the site, Discord bot, or league tools? Get help from the tech team here.',
    color: '#3b82f6',
  },
  {
    id: 'match-support',
    icon: Swords,
    title: 'Match Support',
    description: 'Score disputes, no-shows, scheduling conflicts, or any issue directly related to a scheduled match.',
    color: '#ef4444',
  },
  {
    id: 'comp-server-request',
    icon: Server,
    title: 'Comp Server Request',
    description: 'Need a dedicated competitive server for your match? Submit a request before your match day.',
    color: '#10b981',
  },
  {
    id: 'request-cast',
    icon: Tv,
    title: 'Request Cast',
    description: 'Want your match cast or need a caster assigned? Submit a cast request and the production team will reach out.',
    color: '#00bfff',
  },
];

const CreateTicketModal = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);

  const handleOpenDiscord = () => {
    window.open(DISCORD_TICKET_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg={colors.bgCard}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            boxShadow={`0 0 60px ${colors.accentPurple}22`}
            maxH="90vh"
            overflowY="auto"
          >
            <Dialog.Header
              bg={colors.bgSecondary}
              borderBottom="1px solid"
              borderColor={colors.borderMedium}
              px="6" py="4"
              position="sticky"
              top="0"
              zIndex="1"
            >
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box
                    bg={`${colors.accentPurple}22`}
                    border="1px solid"
                    borderColor={`${colors.accentPurple}44`}
                    p="2" rounded="lg"
                  >
                    <Ticket size={18} color={colors.accentPurple} />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>
                      Create a Ticket
                    </Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>
                      Open a support ticket in the EML Discord
                    </Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={colors.textMuted} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="5">
              <VStack align="stretch" gap="3">

                {/* Intro */}
                <Box
                  bg={`${colors.accentPurple}0d`}
                  border="1px solid"
                  borderColor={`${colors.accentPurple}30`}
                  rounded="xl" p="4"
                >
                  <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.6">
                    All tickets are handled directly in the{' '}
                    <Text as="span" color={colors.accentOrange} fontWeight="700">EML Discord</Text>.
                    Click <Text as="span" fontWeight="700" color={colors.textPrimary}>"Open in Discord"</Text> below to go to the{' '}
                    <Text as="span" color={colors.accentOrange} fontWeight="700">#create-a-ticket</Text> channel, then select the
                    ticket type that matches your issue.
                  </Text>
                </Box>

                {/* Ticket type list */}
                <Text fontSize="xs" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider" px="1">
                  Available Ticket Types
                </Text>

                {TICKET_TYPES.map(({ id, icon: Icon, title, description, color }) => (
                  <Box
                    key={id}
                    bg={colors.bgSecondary}
                    border="1px solid"
                    borderColor={colors.borderMedium}
                    rounded="xl" p="4"
                    _hover={{ borderColor: color, bg: `${color}0a` }}
                    transition="all 0.15s ease"
                    cursor="default"
                  >
                    <HStack gap="3" align="flex-start">
                      <Box
                        bg={`${color}18`}
                        border="1px solid"
                        borderColor={`${color}33`}
                        p="2" rounded="lg"
                        flexShrink={0}
                        mt="0.5"
                      >
                        <Icon size={15} color={color} />
                      </Box>
                      <VStack align="start" gap="0.5" flex="1">
                        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{title}</Text>
                        <Text fontSize="xs" color={colors.textMuted} lineHeight="1.5">{description}</Text>
                      </VStack>
                      <ChevronRight size={14} color={colors.textSubtle} flexShrink={0} style={{ marginTop: 4 }} />
                    </HStack>
                  </Box>
                ))}

                {/* Open Discord button */}
                <Button
                  bg={`linear-gradient(135deg, ${colors.accentPurple}, ${colors.accentBlue})`}
                  color="white"
                  fontWeight="700"
                  rounded="xl"
                  gap="2"
                  onClick={handleOpenDiscord}
                  mt="1"
                >
                  <ExternalLink size={15} />
                  Open in Discord — #create-a-ticket
                </Button>

                <Text fontSize="2xs" color={colors.textMuted} textAlign="center">
                  You must be a member of the EML Discord to open a ticket.
                </Text>

                {/* Fallback server link */}
                <Box
                  bg={colors.bgSecondary}
                  border="1px solid"
                  borderColor={colors.borderLight}
                  rounded="xl"
                  p="3"
                  textAlign="center"
                >
                  <Text fontSize="xs" color={colors.textMuted} mb="1">
                    If you can't make a ticket above, go to this server and start a ticket:
                  </Text>
                  <Text
                    as="a"
                    href="https://discord.gg/Gj8tQ6QARj"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="xs"
                    fontWeight="700"
                    color={colors.accentBlue}
                    _hover={{ color: colors.accentPurple, textDecoration: 'underline' }}
                  >
                    https://discord.gg/Gj8tQ6QARj
                  </Text>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateTicketModal;
