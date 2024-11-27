import axios from 'axios';
import { ApiClient } from '../../../../infrastructure/api/ApiClient';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockedAxios.create.mockClear();
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
    mockedAxios.put.mockClear();
    mockedAxios.delete.mockClear();
    mockedAxios.isAxiosError.mockClear();
  });

  describe('get', () => {
    it('should perform a GET request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };

      mockedAxios.get.mockResolvedValue({ data: mockData });

      ApiClient.setClient(mockedAxios);

      const result = await ApiClient.get('/test');
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith('/test', {
        params: undefined,
      });
    });

    it('should handle errors and throw a custom error', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(mockError);

      ApiClient.setClient(mockedAxios);

      await expect(ApiClient.get('/test')).rejects.toThrow(
        'An unknown error occurred.'
      );
    });
  });

  describe('post', () => {
    it('should perform a POST request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const postData = { name: 'Test' };

      mockedAxios.post.mockResolvedValue({ data: mockData });

      ApiClient.setClient(mockedAxios);

      const result = await ApiClient.post('/test', postData);
      expect(result).toEqual(mockData);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith('/test', postData);
    });

    it('should handle errors and throw a custom error', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(mockError);

      ApiClient.setClient(mockedAxios);

      await expect(ApiClient.post('/test', {})).rejects.toThrow(
        'An unknown error occurred.'
      );
    });
  });

  describe('put', () => {
    it('should perform a PUT request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const putData = { name: 'Updated Test' };

      mockedAxios.put.mockResolvedValue({ data: mockData });

      ApiClient.setClient(mockedAxios);

      const result = await ApiClient.put('/test', putData);
      expect(result).toEqual(mockData);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith('/test', putData);
    });

    it('should handle errors and throw a custom error', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.put.mockRejectedValue(mockError);

      ApiClient.setClient(mockedAxios);

      await expect(ApiClient.put('/test', {})).rejects.toThrow(
        'An unknown error occurred.'
      );
    });
  });

  describe('delete', () => {
    it('should perform a DELETE request', async () => {
      mockedAxios.delete.mockResolvedValue({});

      ApiClient.setClient(mockedAxios);

      await ApiClient.delete('/test');
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith('/test');
    });

    it('should handle errors and throw a custom error', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.delete.mockRejectedValue(mockError);

      ApiClient.setClient(mockedAxios);

      await expect(ApiClient.delete('/test')).rejects.toThrow(
        'An unknown error occurred.'
      );
    });
  });

  describe('handleAxiosError', () => {
    it('should handle error with response', () => {
      // Mock axios.isAxiosError to always return true
      mockedAxios.isAxiosError.mockReturnValue(true);

      const error = {
        isAxiosError: true,
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Not found' },
        },
      };

      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe('API error: 404 - Not Found: Not found');
    });

    it('should handle error with response with empty data', () => {
      // Mock axios.isAxiosError to always return true
      mockedAxios.isAxiosError.mockReturnValue(true);

      const error = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Unknown error',
        },
      };

      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe(
        'API error: 500 - Unknown error: Unknown error'
      );
    });

    it('should handle error with no response', () => {
      // Mock axios.isAxiosError to always return true
      mockedAxios.isAxiosError.mockReturnValue(true);

      const error = {
        isAxiosError: true,
        request: {}, // Represents no response
      };
      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe('No response received from the API.');
    });

    it('should handle unexpected axios errors', () => {
      // Mock axios.isAxiosError to always return true
      mockedAxios.isAxiosError.mockReturnValue(true);

      const error = {
        isAxiosError: true,
        response: null, // Represents an unexpected error with no response
      };

      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe('Unexpected error occurred within Axios.');
    });

    it('should handle unknown error', () => {
      // Mock axios.isAxiosError to return false
      mockedAxios.isAxiosError.mockReturnValue(false);

      const error = new Error('Unknown error');
      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe('An unknown error occurred.');
    });

    it('should handle non-axios error', () => {
      // Mock axios.isAxiosError to return false
      mockedAxios.isAxiosError.mockReturnValue(false);

      const error = new Error('Non-Axios error');
      const result = ApiClient.handleAxiosError(error);
      expect(result.message).toBe('An unknown error occurred.');
    });
  });
});
