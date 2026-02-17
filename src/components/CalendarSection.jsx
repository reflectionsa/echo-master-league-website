import { Box, Container, VStack, Text, HStack, Image } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { emlColors } from '../theme/colors';

const CalendarSection = ({ theme }) => {
  return (
    <Box id="calendar" py="16" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="8">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Calendar size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Schedule
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              League Calendar
            </Text>
            <Text fontSize="lg" color={emlColors.textMuted} maxW="2xl">
              View the complete North America league schedule
            </Text>
          </VStack>

          <Box
            w="full"
            bg={emlColors.bgElevated}
            backdropFilter="blur(10px)"
            border="2px solid"
            borderColor={emlColors.accentOrange}
            rounded="2xl"
            overflow="hidden"
            boxShadow="0 8px 32px rgba(251, 146, 60, 0.3)"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
            p="4"
          >
            <Image
              src="https://images-ext-1.discordapp.net/external/wP1SWEwYOCbLMpCVc_wz4tmudtksVSy4urpOBM2o9VQ/https/echomasterleague.com/wp-content/uploads/2026/01/nacalendar.png?format=webp&quality=lossless&width=814&height=551"
              alt="EML North America League Calendar"
              w="full"
              h="auto"
              rounded="lg"
              objectFit="contain"
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default CalendarSection;
