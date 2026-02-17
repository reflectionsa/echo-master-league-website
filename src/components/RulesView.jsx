import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Accordion, Code } from '@chakra-ui/react';
import { FileText, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { emlColors } from '../theme/colors';

const rules = [
  { title: 'Match Format', content: 'All matches are best of 3 games. Teams must have minimum 3 players present.' },
  { title: 'Substitutions', content: 'Substitutes may only be used between games, not during active play.' },
  { title: 'Scheduling', content: 'Matches must be scheduled within the designated week. Default win awarded if no-show.' },
  { title: 'Disputes', content: 'All disputes must be reported within 24 hours with video evidence if applicable.' },
];

const conduct = [
  'Treat all players, staff, and spectators with respect',
  'No cheating, hacking, or exploitation of game bugs',
  'No harassment, hate speech, or toxic behavior',
  'Follow all game rules and moderator instructions',
];

const RulesView = ({ theme, open, onClose }) => {

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="800px"
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
                  <FileText size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    League Rules
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              <VStack gap="6" align="stretch">
                <Button
                  colorPalette="orange"
                  onClick={() => window.open('https://echomasterleague.com/eml-league-rules/', '_blank')}
                  w="full"
                >
                  <ExternalLink size={16} />
                  View Full Rule Book
                </Button>

                <Accordion.Root collapsible>
                  {rules.map((rule, idx) => (
                    <Accordion.Item key={idx} value={`rule-${idx}`} borderColor={emlColors.borderMedium}>
                      <Accordion.ItemTrigger py="4" color={emlColors.textPrimary} fontWeight="600">
                        {rule.title}
                        <Accordion.ItemIndicator />
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent pb="4" color={emlColors.textMuted}>
                        {rule.content}
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>

                <Box bg={`${emlColors.accentOrange}1a`} p="6" rounded="2xl" border="1px solid" borderColor={emlColors.accentOrange}>
                  <HStack gap="3" mb="4">
                    <Shield size={24} color={emlColors.accentOrange} />
                    <Text fontSize="xl" fontWeight="700" color={emlColors.textPrimary}>Code of Conduct</Text>
                  </HStack>
                  <VStack align="start" gap="2">
                    {conduct.map((item, idx) => (
                      <HStack key={idx} gap="2" align="start">
                        <AlertTriangle size={16} color={emlColors.accentOrange} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <Text fontSize="sm" color={emlColors.textSecondary}>{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RulesView;
