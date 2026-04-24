import { Box, HStack, VStack, Text, Button, Menu, Portal } from '@chakra-ui/react';
import { Palette, Sun, Moon } from 'lucide-react';
import { getThemedColors, THEME_LIST } from '../theme/colors';

const ThemePicker = ({ theme, colorScheme, mode, onSchemeChange, onModeChange }) => {
  const colors = getThemedColors(theme);

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          px="2"
          h="9"
          color={colors.textMuted}
          _hover={{ bg: colors.bgHover, color: colors.accentOrange }}
          title="Color Theme"
        >
          <Palette size={16} />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg={colors.bgSecondary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="xl"
            boxShadow="2xl"
            p="3"
            minW="200px"
            style={{ animation: 'fadeIn 0.15s ease' }}
          >
            <Text fontSize="xs" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider" mb="2" px="1">
              Color Theme
            </Text>

            <VStack gap="1" align="stretch" mb="3">
              {THEME_LIST.map(({ id, label, preview }) => (
                <Box
                  key={id}
                  as="button"
                  onClick={() => onSchemeChange(id)}
                  px="3"
                  py="2"
                  rounded="lg"
                  cursor="pointer"
                  bg={colorScheme === id ? `${colors.accentOrange}22` : 'transparent'}
                  border="1px solid"
                  borderColor={colorScheme === id ? colors.accentOrange : 'transparent'}
                  _hover={{ bg: colors.bgHover }}
                  transition="all 0.15s ease"
                  w="full"
                  textAlign="left"
                >
                  <HStack gap="2">
                    <HStack gap="1" flexShrink={0}>
                      {preview.map((c, i) => (
                        <Box key={i} w="3" h="3" rounded="full" bg={c} border="1px solid rgba(255,255,255,0.2)" />
                      ))}
                    </HStack>
                    <Text fontSize="sm" fontWeight={colorScheme === id ? '700' : '500'} color={colors.textPrimary}>
                      {label}
                    </Text>
                    {colorScheme === id && (
                      <Box ml="auto" w="1.5" h="1.5" rounded="full" bg={colors.accentOrange} />
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>

            <Menu.Separator borderColor={colors.borderMedium} mb="2" />

            <Text fontSize="xs" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider" mb="2" px="1">
              Mode
            </Text>

            <HStack gap="2">
              <Box
                as="button"
                flex="1"
                onClick={() => onModeChange('dark')}
                py="2"
                rounded="lg"
                bg={mode === 'dark' ? `${colors.accentOrange}22` : colors.bgHover}
                border="1px solid"
                borderColor={mode === 'dark' ? colors.accentOrange : 'transparent'}
                _hover={{ borderColor: colors.accentOrange }}
                transition="all 0.15s ease"
                cursor="pointer"
              >
                <VStack gap="1">
                  <Moon size={14} color={mode === 'dark' ? colors.accentOrange : colors.textMuted} />
                  <Text fontSize="xs" color={mode === 'dark' ? colors.accentOrange : colors.textMuted} fontWeight={mode === 'dark' ? '700' : '400'}>Dark</Text>
                </VStack>
              </Box>
              <Box
                as="button"
                flex="1"
                onClick={() => onModeChange('light')}
                py="2"
                rounded="lg"
                bg={mode === 'light' ? `${colors.accentOrange}22` : colors.bgHover}
                border="1px solid"
                borderColor={mode === 'light' ? colors.accentOrange : 'transparent'}
                _hover={{ borderColor: colors.accentOrange }}
                transition="all 0.15s ease"
                cursor="pointer"
              >
                <VStack gap="1">
                  <Sun size={14} color={mode === 'light' ? colors.accentOrange : colors.textMuted} />
                  <Text fontSize="xs" color={mode === 'light' ? colors.accentOrange : colors.textMuted} fontWeight={mode === 'light' ? '700' : '400'}>Light</Text>
                </VStack>
              </Box>
            </HStack>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ThemePicker;
