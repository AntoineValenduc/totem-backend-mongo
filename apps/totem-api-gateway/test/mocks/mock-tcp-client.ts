export const mockTcpClient = {
  send: jest.fn().mockReturnValue({
    toPromise: () => Promise.resolve({ success: true }),
  }),
  emit: jest.fn(),
};