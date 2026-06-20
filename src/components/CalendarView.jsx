import { Box, Dialog, Portal, CloseButton, HStack, Image } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import RoutePageLayout from './RoutePageLayout';

const CalendarView = ({ theme }) => {
  const emlColors = getThemedColors(theme);

  return (
    <RoutePageLayout
      maxW="1100px"
      bg={emlColors.bgPrimary}
      border="1px solid"
      borderColor={emlColors.borderMedium}
      rounded="2xl"
      overflow="hidden"
    >
      <Box bg={`${emlColors.bgPrimary}dd`} borderBottom="1px solid" borderColor={emlColors.borderMedium} py="3" px="5">
        <HStack gap="2">
          <Calendar size={18} color={emlColors.accentOrange} />
          <Box as="span" fontSize="lg" fontWeight="800" color={emlColors.textPrimary}>
            League Calendar
          </Box>
        </HStack>
      </Box>
      <Box p="4" overflowY="auto" flex="1">
        <Box
          w="full"
          bg={emlColors.bgElevated}
          border="2px solid"
          borderColor={emlColors.accentOrange}
          rounded="xl"
          overflow="hidden"
          boxShadow={`0 0 20px ${emlColors.accentOrange}44`}
        >
          <Image
            src="https://echomasterleague.com/wp-content/uploads/2026/01/nacalendar.png"
            alt="EML League Calendar"
            w="full"
            h="auto"
            objectFit="contain"
          />
        </Box>
      </Box>
    </RoutePageLayout>
  );
};

export default CalendarView;
