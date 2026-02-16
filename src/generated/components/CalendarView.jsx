import { Box, Dialog, Portal, CloseButton, HStack, Image } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';

const CalendarView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="95vw"
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
                  <Calendar size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                bg={isDark ? 'whiteAlpha.50' : 'white'}
                border="3px solid"
                borderColor={isDark ? 'orange.500' : 'blue.500'}
                rounded="2xl"
                overflow="hidden"
                boxShadow={isDark 
                  ? '0 0 40px rgba(251, 146, 60, 0.6), 0 0 80px rgba(251, 146, 60, 0.3)' 
                  : '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3)'}
                _hover={{ 
                  transform: 'scale(1.02)',
                  boxShadow: isDark 
                    ? '0 0 50px rgba(251, 146, 60, 0.8), 0 0 100px rgba(251, 146, 60, 0.4)' 
                    : '0 0 50px rgba(59, 130, 246, 0.8), 0 0 100px rgba(59, 130, 246, 0.4)'
                }}
                transition="all 0.3s"
              >
                <Image
                  src="https://images-ext-1.discordapp.net/external/wP1SWEwYOCbLMpCVc_wz4tmudtksVSy4urpOBM2o9VQ/https/echomasterleague.com/wp-content/uploads/2026/01/nacalendar.png?format=webp&quality=lossless&width=814&height=551"
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
