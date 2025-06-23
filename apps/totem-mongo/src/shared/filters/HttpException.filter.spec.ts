import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './CustomHttpExceptionFilter.filter';

describe('CustomHttpExceptionFilter', () => {
  let filter: CustomHttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockGetRequest: jest.Mock;

  beforeEach(() => {
    filter = new CustomHttpExceptionFilter();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockGetRequest = jest.fn().mockReturnValue({ url: '/test-url' });

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException with string message', () => {
    const exception = new HttpException(
      'Test error message',
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Test error message',
      error: 'Test error message',
      timestamp: expect.any(String) as unknown as string,
      path: '/test-url',
    });
  });

  it('should handle HttpException with message array', () => {
    const exception = new HttpException(
      { message: ['Error 1', 'Error 2'], error: 'Validation Error' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error 1, Error 2',
      error: 'Validation Error',
      timestamp: expect.any(String) as unknown as string,
      path: '/test-url',
    });
  });

  it('should handle HttpException without message', () => {
    const exception = new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR);

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      error: 'An unexpected error occurred',
      timestamp: expect.any(String) as unknown as string,
      path: '/test-url',
    });
  });
});
