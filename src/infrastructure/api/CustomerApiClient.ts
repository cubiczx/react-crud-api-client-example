import { ApiClient } from './ApiClient';
import { Customer } from '../../domain/models/Customer';

export class CustomerApiClient extends ApiClient {
  /**
   * Retrieves all customers from the API.
   * @return {Promise<Customer[]>} A promise that resolves to an array of Customer objects.
   */
  static async getAllCustomers(): Promise<Customer[]> {
    return this.get<Customer[]>('/customers');
  }

  /**
   * Retrieves a customer by their ID from the API.
   * @param {string} id - The ID of the customer to retrieve.
   * @return {Promise<Customer>} A promise that resolves to the Customer object.
   */
  static async getCustomerById(id: string): Promise<Customer> {
    return this.get<Customer>(`/customers/${id}`);
  }

  /**
   * Creates a new customer using the API.
   * @param {Customer} customer The customer to create.
   * @return {Promise<Customer>} A promise that resolves to the created Customer object.
   */
  static async createCustomer(customer: Customer): Promise<Customer> {
    return this.post<Customer>('/customers', customer);
  }

  /**
   * Updates an existing customer using the API.
   * @param {string} id - The ID of the customer to update.
   * @param {Customer} customer - The updated customer data.
   * @return {Promise<Customer>} A promise that resolves to the updated Customer object.
   */
  static async updateCustomer(
    id: string,
    customer: Customer
  ): Promise<Customer> {
    return this.put<Customer>(`/customers/${id}`, customer);
  }

  /**
   * Deletes a customer by their ID using the API.
   * @param {string} id - The ID of the customer to delete.
   * @return {Promise<void>} A promise that resolves when the customer has been deleted.
   */
  static async deleteCustomer(id: string): Promise<void> {
    return this.delete(`/customers/${id}`);
  }

  /**
   * Adds the given amount of credit to the customer with the given ID.
   * @param {string} id - The ID of the customer to add credit to.
   * @param {number} amount - The amount of credit to add.
   * @return {Promise<Customer>} A promise that resolves to the updated Customer object.
   */
  static async addCredit(id: string, amount: number): Promise<Customer> {
    return this.post<Customer>('/customers/credit', { id, amount });
  }

  /**
   * Sorts all customers by their credit in either ascending or descending order.
   * @param {string} [order="desc"] - The order in which to sort the customers.
   * @return {Promise<Customer[]>} A promise that resolves to an array of sorted Customer objects.
   */
  static async sortCustomersByCredit(
    order: 'asc' | 'desc' = 'desc'
  ): Promise<Customer[]> {
    return this.get<Customer[]>('/customers/sortByCredit', { order });
  }
}
