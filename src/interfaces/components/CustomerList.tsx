import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCustomers,
  deleteCustomer,
  sortCustomersByCredit,
  addCredit,
} from '../../application/useCases/CustomerUseCases';
import { Customer } from '../../domain/models/Customer';
import { handleError } from "../../utils/ErrorUtils";

/**
 * A React component that displays a list of customers with functionalities
 * to add, edit, sort, and delete customers.
 *
 * @remarks
 * This component manages the state of the customer list, loading state, error
 * messages, and selected customer for credit operations. It utilizes the 
 * `fetchCustomers`, `deleteCustomer`, `sortCustomersByCredit`, and `addCredit`
 * functions to interact with the backend API.
 *
 * @component
 * @returns {JSX.Element} A component that renders the customer list and associated actions.
 */
export const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState<number | string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  /**
   * Fetches all customers from the API and updates the state with the fetched data.
   * If the data is not an array, throws an error.
   * If an error occurs while fetching, shows an error message to the user.
   * In any case, sets the loading state to false when the operation is finished.
   */
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomers();
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (err: any) {
        setError(handleError(err, "Failed to load customers. Please try again later."));
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  /**
   * Deletes a customer from the list of customers and database.
   *
   * @param {string} id - The ID of the customer to delete.
   * @throws Will throw an error if the API call to delete the customer fails.
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await deleteCustomer(id);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id),
      );
    } catch (err: any) {
      setError(handleError(err, "Failed to delete customer. Please try again later."));
    }
  };

  /**
   * Sorts the list of customers by their credit amount in either ascending
   * or descending order.
   *
   * @param {string} order - The order in which to sort the customers.
   * @throws Will throw an error if the API call to sort customers fails.
   */
  const handleSort = async (order: 'asc' | 'desc') => {
    try {
      const data = await sortCustomersByCredit(order);
      setCustomers(data);
    } catch (err: any) {
      setError(handleError(err, "Failed to sort customers. Please try again later."));
    }
  };


  /**
   * Adds credit to the customer with the ID in `selectedCustomerId` using
   * `addCredit` and updates the customer's available credit in the state.
   *
   * If the user has not selected a customer, it will display an error message.
   * If the user has not entered a valid credit amount, it will display an
   * error message.
   *
   * @return {Promise<void>} A promise that resolves when the credit has been
   * added.
   */
  const handleAddCredit = async () => {
    if (!selectedCustomerId) {
      setError('No customer selected. Please select a customer first.');
      return;
    }

    if (!isValidCreditAmount(creditAmount)) {
      setError('Please enter a valid positive integer credit amount.');
      return;
    }

    const credit =
      creditAmount === ''
        ? 0
        : typeof creditAmount === 'number'
        ? creditAmount
        : parseFloat(creditAmount);

    try {
      await addCredit(selectedCustomerId, credit);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomerId
            ? {
                ...customer,
                availableCredit: customer.availableCredit + credit,
              }
            : customer,
        ),
      );
      setCreditAmount('');
      setSelectedCustomerId(null);
    } catch (err: any) {
      setError(handleError(err, "Failed to add credit. Please try again later."));
    }
  };

  /**
   * Checks if the given amount is a valid positive integer credit amount.
   *
   * @param {number|string} amount The amount to check.
   * @return {boolean} True if the amount is valid, false otherwise.
   */
  const isValidCreditAmount = (amount: number | string) => {
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    return Number.isInteger(num) && num > 0;
  };

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Customer List</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/customers/new')}>Add Customer</button>
        <button onClick={() => handleSort('asc')}>Sort by Credit (Asc)</button>
        <button onClick={() => handleSort('desc')}>Sort by Credit (Desc)</button>
      </div>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.email} - Credit: {customer.availableCredit}
            <button onClick={() => navigate(`/customers/edit/${customer.id}`)}>Edit</button>
            <button
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setCreditAmount('');
              }}
            >
              Add Credit
            </button>
            <button onClick={() => handleDelete(customer.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedCustomerId && (
        <div>
          <h3>Add Credit</h3>
          <input
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            placeholder="Enter credit amount"
            min="1"
          />
          <button onClick={handleAddCredit}>Add Credit</button>
        </div>
      )}
    </div>
  );
};
