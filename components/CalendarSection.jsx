import { Box, Container, VStack, Text, HStack, Image } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';

const CalendarSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="calendar" py="16" bg={isDark ? 'gray.900' : 'gray.100'}>
      <Container maxW="6xl">
        <VStack gap="8">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Calendar size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Schedule
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              League Calendar
            </Text>
            <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'} maxW="2xl">
              View the complete North America league schedule
            </Text>
          </VStack>

          <Box
            w="full"
            bg={isDark ? 'whiteAlpha.50' : 'white'}
            backdropFilter="blur(10px)"
            border="2px solid"
            borderColor={isDark ? 'orange.500' : 'blue.500'}
            rounded="2xl"
            overflow="hidden"
            boxShadow={isDark ? '0 8px 32px rgba(251, 146, 60, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.3)'}
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
