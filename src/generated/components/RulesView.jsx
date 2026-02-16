import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Accordion, Code } from '@chakra-ui/react';
import { FileText, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

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
  const isDark = theme === 'dark';

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="800px"
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
                  <FileText size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                  colorPalette={isDark ? 'orange' : 'blue'}
                  onClick={() => window.open('https://echomasterleague.com/eml-league-rules/', '_blank')}
                  w="full"
                >
                  <ExternalLink size={16} />
                  View Full Rule Book
                </Button>

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

                <Box bg={isDark ? 'orange.500/10' : 'blue.500/10'} p="6" rounded="2xl" border="1px solid" borderColor={isDark ? 'orange.400' : 'blue.400'}>
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
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RulesView;
