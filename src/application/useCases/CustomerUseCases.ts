import { CustomerApiClient } from "../../infrastructure/api/CustomerApiClient";
import { Customer } from "../../domain/models/Customer";

/**
 * Fetches all customers using the static method of CustomerApiClient.
 *
 * @return {Promise<Customer[]>} A promise that resolves to an array of Customer objects.
 */
export async function fetchCustomers(): Promise<Customer[]> {
  return CustomerApiClient.getAllCustomers();
}

/**
 * Retrieves a customer by their ID from the API.
 *
 * @param {string} id The ID of the customer to retrieve.
 * @return {Promise<Customer>} A promise that resolves to the Customer object with the given ID,
 * or null if no customer is found.
 */
export async function fetchCustomerById(id: string): Promise<Customer> {
  return await CustomerApiClient.getCustomerById(id);
}

/**
 * Creates a new customer using the static method of CustomerApiClient.
 *
 * @param {Customer} customer The customer to create.
 * @return {Promise<Customer>} A promise that resolves to the created Customer object.
 */
export async function createCustomer(customer: Customer): Promise<Customer> {
  return await CustomerApiClient.createCustomer(customer);
}

/**
 * Updates a customer using the static method of CustomerApiClient.
 *
 * @param {Customer} customer - The customer to update.
 * @return {Promise<Customer>} - A promise that resolves to the updated Customer object.
 */
export async function updateCustomer(customer: Customer): Promise<Customer> {
  return await CustomerApiClient.updateCustomer(customer.id, customer);
}

/**
 * Deletes a customer by their ID using the static method of CustomerApiClient.
 *
 * @param {string} id - The ID of the customer to delete.
 * @return {Promise<void>} - A promise that resolves when the customer has been deleted.
 */
export async function deleteCustomer(id: string): Promise<void> {
  await CustomerApiClient.deleteCustomer(id);
}

/**
 * Adds the given amount of credit to the customer with the given ID.
 *
 * @param {string} id - The ID of the customer to add credit to.
 * @param {number} amount - The amount of credit to add.
 * @return {Promise<void>} - A promise that resolves when the credit has been added.
 */
export const addCredit = async (id: string, amount: number): Promise<void> => {
  await CustomerApiClient.addCredit(id, amount);
};

/**
 * Sorts all customers by their credit in either ascending or descending order.
 *
 * @param {string} [order="desc"] - The order in which to sort the customers.
 * @return {Promise<Customer[]>} - A promise that resolves to an array of sorted Customer objects.
 */
export const sortCustomersByCredit = async (
  order: "asc" | "desc" = "desc"
): Promise<Customer[]> => {
  return await CustomerApiClient.sortCustomersByCredit(order);
};
