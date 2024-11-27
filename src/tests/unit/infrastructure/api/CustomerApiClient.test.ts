import { CustomerApiClient } from '../../../../infrastructure/api/CustomerApiClient';
import { ApiClient } from '../../../../infrastructure/api/ApiClient';
import { Customer } from '../../../../domain/models/Customer';

describe('CustomerApiClient', () => {

  it('should fetch all customers', async () => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 100,
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        availableCredit: 150,
      },
    ];

    // Mock the get method to return mock data
    const getMock = jest.fn().mockResolvedValue(mockCustomers);
    jest.spyOn(ApiClient as any, 'get').mockImplementation(getMock);

    // Call getAllCustomers and verify the response
    const customers = await CustomerApiClient.getAllCustomers();
    expect(customers).toEqual(mockCustomers);

    // Ensure get was called with the correct URL
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/customers');
  });

  it('should fetch a customer by ID', async () => {
    const mockCustomer: Customer = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      availableCredit: 100,
    };

    // Mock the get method to return mock data
    const getMock = jest.fn().mockResolvedValue(mockCustomer);
    jest.spyOn(ApiClient as any, 'get').mockImplementation(getMock);

    // Call getCustomerById and verify the response
    const customer = await CustomerApiClient.getCustomerById('1');
    expect(customer).toEqual(mockCustomer);

    // Ensure get was called with the correct URL
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/customers/1');
  });

  it('should create a customer', async () => {
    const mockCustomer: Customer = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      availableCredit: 100,
    };

    // Mock the post method to return mock data
    const postMock = jest.fn().mockResolvedValue(mockCustomer);
    jest.spyOn(ApiClient as any, 'post').mockImplementation(postMock);

    // Call createCustomer and verify the response
    const result = await CustomerApiClient.createCustomer(mockCustomer);
    expect(result).toEqual(mockCustomer);

    // Ensure post was called with the correct URL and data
    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith('/customers', mockCustomer);
  });

  it('should update a customer', async () => {
    const mockCustomer: Customer = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      availableCredit: 150,
    };

    // Mock the put method to return mock data
    const putMock = jest.fn().mockResolvedValue(mockCustomer);
    jest.spyOn(ApiClient as any, 'put').mockImplementation(putMock);

    // Call updateCustomer and verify the response
    const result = await CustomerApiClient.updateCustomer('1', mockCustomer);
    expect(result).toEqual(mockCustomer);

    // Ensure put was called with the correct URL and data
    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledWith('/customers/1', mockCustomer);
  });

  it('should delete a customer', async () => {
    // Mock the delete method to return no content
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(ApiClient as any, 'delete').mockImplementation(deleteMock);

    // Call deleteCustomer and verify the response
    await expect(
      CustomerApiClient.deleteCustomer('1')
    ).resolves.toBeUndefined();

    // Ensure delete was called with the correct URL
    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith('/customers/1');
  });

  it('should add credit to a customer', async () => {
    const customerId = '1';
    const mockedResponse = {
      data: { id: customerId, name: 'John Doe', availableCredit: 150 },
    };

    const amountToAdd = 50;

    // Mock the `post` method of ApiClient
    const postMock = jest.fn().mockResolvedValue(mockedResponse);
    jest.spyOn(ApiClient as any, 'post').mockImplementation(postMock);

    // Call the addCredit method, which internally makes the POST request
    const customer = await CustomerApiClient.addCredit(customerId, amountToAdd);

    // Verify that the response is as expected by accessing `customer`
    expect(customer).toEqual(mockedResponse);

    // Verify that the `post` method was called with the correct parameters
    expect(postMock).toHaveBeenCalledWith('/customers/credit', {
      id: customerId,
      amount: amountToAdd,
    });

    // Verify that the mock was called exactly once
    expect(postMock).toHaveBeenCalledTimes(1);
  });

  it('should sort customers by available credit with default order (desc)', async () => {
    const sortedCustomers: Customer[] = [
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        availableCredit: 150,
      },
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 100,
      },
    ];

    // Mock the get method to return mock data
    const getMock = jest.fn().mockResolvedValue(sortedCustomers); // Simulate the customer response
    jest.spyOn(ApiClient as any, 'get').mockImplementation(getMock);

    // Call sortCustomersByCredit without passing the order and verify the sorted result
    const result = await CustomerApiClient.sortCustomersByCredit();
    expect(result).toEqual(sortedCustomers); // Verify that the order is correct (default desc)

    // Ensure the get method was called with the correct URL and default order 'desc'
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/customers/sortByCredit', {
      order: 'desc',
    });
  });

  it('should sort customers by available credit in descending order', async () => {
    const sortedCustomers: Customer[] = [
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        availableCredit: 150,
      },
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 100,
      },
    ];

    // Mock the get method to return mock data
    const getMock = jest.fn().mockResolvedValue(sortedCustomers); // Simulate the customer response
    jest.spyOn(ApiClient as any, 'get').mockImplementation(getMock);

    // Call sortCustomersByCredit and verify the sorted result
    const result = await CustomerApiClient.sortCustomersByCredit('desc');
    expect(result).toEqual(sortedCustomers); // Verify that the order is correct

    // Ensure the get method was called with the correct URL
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/customers/sortByCredit', {
      order: 'desc',
    });
  });

  it('should sort customers by available credit in ascending order', async () => {
    const sortedCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 100,
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        availableCredit: 150,
      },
    ];

    // Mock the get method to return mock data
    const getMock = jest.fn().mockResolvedValue(sortedCustomers); // Simulate the customer response
    jest.spyOn(ApiClient as any, 'get').mockImplementation(getMock);

    // Call sortCustomersByCredit and verify the sorted result
    const result = await CustomerApiClient.sortCustomersByCredit('asc');
    expect(result).toEqual(sortedCustomers); // Verify that the order is correct

    // Ensure the get method was called with the correct URL
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/customers/sortByCredit', {
      order: 'asc',
    });
  });
});
