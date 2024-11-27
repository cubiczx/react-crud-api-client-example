import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCredit,
  sortCustomersByCredit,
} from '../../../../application/useCases/CustomerUseCases';
import { ApiClient } from '../../../../infrastructure/api/ApiClient';
import { Customer } from '../../../../domain/models/Customer';

// Mock the API client
jest.mock('../../../../infrastructure/api/ApiClient');

describe('CustomerUseCases', () => {
  const mockCustomer: Customer = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    availableCredit: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks(); // clears call state and return values.
    jest.restoreAllMocks(); // resets mocks to their original behavior.
    jest.resetAllMocks(); // resets the state of all mocks, removing any special configuration you've made.
  });

  describe('fetchCustomers', () => {
    it('should fetch all customers', async () => {
      const mockCustomers = [mockCustomer];
      (ApiClient.getAllCustomers as jest.Mock).mockResolvedValue(mockCustomers);

      const result = await fetchCustomers();

      expect(result).toEqual(mockCustomers);
      expect(ApiClient.getAllCustomers).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchCustomerById', () => {
    it('should fetch a customer by ID', async () => {
      (ApiClient.getCustomerById as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await fetchCustomerById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(ApiClient.getCustomerById).toHaveBeenCalledWith(mockCustomer.id);
      expect(ApiClient.getCustomerById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      (ApiClient.createCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await createCustomer(mockCustomer);

      expect(result).toEqual(mockCustomer);
      expect(ApiClient.createCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(ApiClient.createCustomer).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCustomer', () => {
    it('should update an existing customer', async () => {
      const updatedCustomer = { ...mockCustomer, name: 'Jane Doe' };
      (ApiClient.updateCustomer as jest.Mock).mockResolvedValue(
        updatedCustomer
      );

      const result = await updateCustomer(updatedCustomer);

      expect(result).toEqual(updatedCustomer);
      expect(ApiClient.updateCustomer).toHaveBeenCalledWith(
        updatedCustomer.id,
        updatedCustomer
      );
      expect(ApiClient.updateCustomer).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer by ID', async () => {
      (ApiClient.deleteCustomer as jest.Mock).mockResolvedValue(undefined);

      await deleteCustomer(mockCustomer.id);

      expect(ApiClient.deleteCustomer).toHaveBeenCalledWith(mockCustomer.id);
      expect(ApiClient.deleteCustomer).toHaveBeenCalledTimes(1);
    });
  });

  describe('addCredit', () => {
    it('should add credit to a customer', async () => {
      const creditAmount = 50;
      (ApiClient.addCredit as jest.Mock).mockResolvedValue(undefined);

      await addCredit(mockCustomer.id, creditAmount);

      expect(ApiClient.addCredit).toHaveBeenCalledWith(
        mockCustomer.id,
        creditAmount
      );
      expect(ApiClient.addCredit).toHaveBeenCalledTimes(1);
    });
  });

  describe('sortCustomersByCredit', () => {
    it('should sort customers by credit in descending order by default', async () => {
      const mockCustomers = [
        { ...mockCustomer, availableCredit: 200 },
        mockCustomer,
      ];
      (ApiClient.sortCustomersByCredit as jest.Mock).mockResolvedValue(
        mockCustomers
      );

      const result = await sortCustomersByCredit();

      expect(result).toEqual(mockCustomers);
      expect(ApiClient.sortCustomersByCredit).toHaveBeenCalledWith('desc');
      expect(ApiClient.sortCustomersByCredit).toHaveBeenCalledTimes(1);
    });

    it('should sort customers by credit in ascending order', async () => {
      const mockCustomers = [
        mockCustomer,
        { ...mockCustomer, availableCredit: 200 },
      ];
      (ApiClient.sortCustomersByCredit as jest.Mock).mockResolvedValue(
        mockCustomers
      );

      const result = await sortCustomersByCredit('asc');

      expect(result).toEqual(mockCustomers);
      expect(ApiClient.sortCustomersByCredit).toHaveBeenCalledWith('asc');
      expect(ApiClient.sortCustomersByCredit).toHaveBeenCalledTimes(1);
    });
  });
});
