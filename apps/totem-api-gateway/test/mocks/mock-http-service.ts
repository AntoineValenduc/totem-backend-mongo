import { of } from 'rxjs';

export const mockHttpService = {
  axiosRef: {
    post: jest.fn((url, body) => {
      if (url.includes('/invitations/full')) {
        return Promise.resolve({ data: { token: 'fake-token' } });
      } else if (url.includes('/invitations')) {
        return Promise.resolve({ data: { success: true } });
      } else if (url.includes('/register')) {
        return Promise.resolve({ data: { userId: 'user123' } });
      }
      return Promise.resolve({ data: {} });
    }),
    get: jest.fn((url) => {
      if (url.includes('/validate')) {
        return Promise.resolve({ data: { valid: true } });
      }
      return Promise.resolve({ data: {} });
    }),
  },
};