import { Box, Dialog, Portal, CloseButton, HStack, Image } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const CalendarView = ({ theme, open, onClose }) => {
  const emlColors = getThemedColors(theme);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="480px"
            w="92vw"
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={`${emlColors.bgPrimary}dd`} borderBottom="1px solid" borderColor={emlColors.borderMedium} py="3">
              <HStack justify="space-between">
                <HStack gap="2">
                  <Calendar size={18} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="lg" fontWeight="800" color={emlColors.textPrimary}>
                    League Calendar
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={emlColors.textSecondary} _hover={{ color: emlColors.textPrimary }} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="4">
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
                  objectFit="contain"
                />
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CalendarView;
