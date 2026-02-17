import { Box, Container, VStack, Text, Accordion, HStack, Button } from '@chakra-ui/react';
import { FileText, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { emlColors } from '../theme/colors';

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
  return (
    <Box id="rules" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <FileText size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Rules & Guidelines
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              League Rules
            </Text>
            <Button
              size="sm"
              colorPalette="orange"
              onClick={() => window.open('https://echomasterleague.com/eml-league-rules/', '_blank')}
            >
              <ExternalLink size={14} />
              View Full Rule Book
            </Button>
          </VStack>

          <Box w="full" bg={emlColors.bgElevated} p="6" rounded="2xl" border="1px solid" borderColor={emlColors.borderMedium}>
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
          </Box>

          <Box w="full" bg={`${emlColors.accentOrange}19`} p="6" rounded="2xl" border="1px solid" borderColor={emlColors.accentOrange}>
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
      </Container>
    </Box>
  );
};

export default RulesSection;
