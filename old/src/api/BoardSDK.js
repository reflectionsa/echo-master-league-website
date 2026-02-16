// Mock Board SDK for development
// This replaces the Monday.com board integration
// The actual hooks will use fallback data from teamRosters.js

export class EmlTeamsBoard {
  items() {
    return {
      withColumns: (columns) => ({
        withPagination: (pagination) => ({
          execute: async () => {
            // Return empty data - hooks will use their fallback/mock data
            return {
              items: [],
              cursor: null
            };
          }
        })
      })
    };
  }
}

export class EmlScheduleResultsBoard {
  items() {
    return {
      withColumns: (columns) => ({
        withPagination: (pagination) => ({
          execute: async () => {
            // Return empty data - hooks will generate mock matches
            return {
              items: [],
              cursor: null
            };
          }
        })
      })
    };
  }
}

// If you want to connect to a real API later, update these classes
// to make actual fetch() calls to your backend
