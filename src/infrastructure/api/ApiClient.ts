import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  protected static client: AxiosInstance = axios.create({
    baseURL: '', // Define your base URL here or allow configuration
  });

  /**
   * Sets the Axios instance used by the ApiClient to make HTTP requests.
   * @param {AxiosInstance} client - The Axios instance to use.
   */
  public static setClient(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Fetches data from the API with error handling.
   * @param {string} url - The URL to fetch.
   * @param {object} [params] - Optional parameters for the GET request.
   * @return {Promise<T>} A promise that resolves to the response data.
   */
  public static async get<T>(url: string, params?: object): Promise<T> {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching from ${url}:`, error);
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Makes a POST request to the API with error handling.
   * @param {string} url - The URL to send the POST request to.
   * @param {object} data - The data to send in the POST request.
   * @return {Promise<T>} A promise that resolves to the response data.
   */
  public static async post<T>(url: string, data: object): Promise<T> {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error posting to ${url}:`, error);
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Makes a PUT request to the API with error handling.
   * @param {string} url - The URL to send the PUT request to.
   * @param {object} data - The data to send in the PUT request.
   * @return {Promise<T>} A promise that resolves to the response data.
   */
  public static async put<T>(url: string, data: object): Promise<T> {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating ${url}:`, error);
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Makes a DELETE request to the API with error handling.
   * @param {string} url - The URL to send the DELETE request to.
   * @return {Promise<void>} A promise that resolves when the resource is deleted.
   */
  public static async delete(url: string): Promise<void> {
    try {
      await this.client.delete(url);
    } catch (error: any) {
      console.error(`Error deleting from ${url}:`, error);
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Handles errors that occur during API calls.
   * @param {unknown} error - The error to handle.
   * @return {Error} A new Error object with a descriptive error message.
   * @throws Will throw an error if the API call fails.
   */
  public static handleAxiosError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return new Error(
          `API error: ${error.response.status} - ${
            error.response.statusText
          }: ${error.response.data?.error || 'Unknown error'}`
        );
      }
      if (error.request) {
        return new Error('No response received from the API.');
      }
      return new Error('Unexpected error occurred within Axios.');
    }
    return new Error('An unknown error occurred.');
  }
}
