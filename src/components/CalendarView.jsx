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
            maxW="95vw"
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
                  <Calendar size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    League Calendar
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" color="white" _hover={{ color: 'gray.300' }} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto" display="flex" justifyContent="center" alignItems="center">
              <Box
                maxW="700px"
                w="full"
                bg={emlColors.bgElevated}
                border="3px solid"
                borderColor={emlColors.accentOrange}
                rounded="2xl"
                overflow="hidden"
                boxShadow={`0 0 40px ${emlColors.accentOrange}99, 0 0 80px ${emlColors.accentOrange}4d`}
                _hover={{
                  transform: 'scale(1.02)',
                  boxShadow: `0 0 50px ${emlColors.accentOrange}cc, 0 0 100px ${emlColors.accentOrange}66`
                }}
                transition="all 0.3s"
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
