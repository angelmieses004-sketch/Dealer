// API Configuration
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  endpoints: {
    auth: {
      register: '/auth/register',
      login: '/auth/login'
    },
    favorites: {
      getAll: '/favorites',
      toggle: (vehicleId: number) => `/favorites/toggle/${vehicleId}`,
      add: (vehicleId: number) => `/favorites/${vehicleId}`,
      remove: (vehicleId: number) => `/favorites/${vehicleId}`
    }
  }
};

