import { useTeamsFromSheets } from '../hooks/useGoogleSheets';
import { getConfig } from '../config/sheets';
import { Box, Stack, Heading, Spinner, Center, Text, Table, Badge, Button } from '@chakra-ui/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Example component showing how to use Google Sheets data
 * Replace your existing useTeams() calls with this
 */
const TeamsFromSheetsExample = () => {
  const config = getConfig();
  const { teams, loading, error, refetch } = useTeamsFromSheets(
    config.spreadsheetId,
    config.apiKey
  );

  if (loading) {
    return (
      <Center py="12">
        <Spinner size="lg" />
        <Text ml="4">Loading teams from Google Sheets...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p="6" bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
        <Stack gap="3">
          <Stack direction="row" gap="2" align="start">
            <AlertCircle size={20} color="red.600" />
            <Stack gap="1">
              <Heading size="sm" color="red.700">Failed to load teams</Heading>
              <Text color="red.600" textStyle="sm">{error}</Text>
              <Text color="red.600" textStyle="xs">
                Make sure your API key and Spreadsheet ID are configured in src/generated/config/sheets.js
              </Text>
            </Stack>
          </Stack>
          <Button size="sm" onClick={refetch} variant="outline" colorPalette="red">
            <RefreshCw size={14} /> Retry
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!teams.length) {
    return (
      <Center py="12">
        <Text color="fg.muted">No teams found in Google Sheets</Text>
      </Center>
    );
  }

  return (
    <Box>
      <Stack gap="4">
        <Stack direction="row" justify="space-between" align="center">
          <Heading size="md">Teams from Google Sheets ({teams.length})</Heading>
          <Button size="sm" onClick={refetch} variant="outline">
            <RefreshCw size={14} /> Refresh
          </Button>
        </Stack>

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Team Name</Table.ColumnHeader>
                <Table.ColumnHeader>Captain</Table.ColumnHeader>
                <Table.ColumnHeader>Tier</Table.ColumnHeader>
                <Table.ColumnHeader>Region</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teams.map(team => (
                <Table.Row key={team.id}>
                  <Table.Cell fontWeight="600">{team.name}</Table.Cell>
                  <Table.Cell>{team.captain}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={team.tier?.toLowerCase() === 'master' ? 'gold' : 'blue'}>
                      {team.tier}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{team.region}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={team.status === 'Active' ? 'green' : 'gray'}>
                      {team.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
    </Box>
  );
};

export default TeamsFromSheetsExample;
