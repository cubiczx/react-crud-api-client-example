import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CustomerForm } from '../../../../interfaces/components/CustomerForm';
import * as CustomerUseCases from '../../../../application/useCases/CustomerUseCases';
import axios from 'axios';
import { CustomerApiClient } from '../../../../infrastructure/api/CustomerApiClient';
import { Customer } from '../../../../domain/models/Customer';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CustomerForm', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
    mockedAxios.put.mockClear();
    mockedAxios.isAxiosError.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the form correctly for creating a customer', () => {
    render(
      <MemoryRouter>
        <CustomerForm onSubmit={jest.fn()} />
      </MemoryRouter>
    );

    // Check that the form elements are present
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Customer/i })
    ).toBeInTheDocument();
  });

  it('should render the form correctly for updating a customer', async () => {
    const mockData = { id: '1', name: 'John Doe', email: 'john@example.com' };

    // Simulate the axios.get response for the expected endpoint
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const newCustomer: Customer = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      availableCredit: 1,
    };
    jest
      .spyOn(CustomerApiClient, 'getCustomerById')
      .mockResolvedValueOnce(newCustomer);

    render(
      <MemoryRouter initialEntries={['/customers/1']}>
        <Routes>
          <Route
            path="/customers/:id"
            element={<CustomerForm onSubmit={jest.fn()} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the customer data to be loaded and rendered
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockData.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockData.email);
    });

    // Check that the update button is present
    expect(
      screen.getByRole('button', { name: /Update Customer/i })
    ).toBeInTheDocument();
  });

  it('should call onSubmit with form data for creating a customer', async () => {
    const mockOnSubmit = jest.fn();
    const mockCustomer = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      availableCredit: 1000,
    };
    // Simulate createCustomer
    jest
      .spyOn(CustomerUseCases, 'createCustomer')
      .mockResolvedValue(mockCustomer);

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Change the values of the fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for onSubmit to be called
    await waitFor(() =>
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: '', // If no ID, it should be empty
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 0, // Default value of availableCredit
      })
    );
  });

  it('should call onSubmit with updated customer data when the form is submitted', async () => {
    const mockData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      availableCredit: 1,
    };
    const updatedData = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      availableCredit: 1,
    };
    const mockSubmit = jest.fn();

    // Simulate the axios.get response
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const newCustomer: Customer = mockData;
    jest
      .spyOn(CustomerApiClient, 'getCustomerById')
      .mockResolvedValueOnce(newCustomer);
    const updatedCustomer: Customer = updatedData;
    jest
      .spyOn(CustomerApiClient, 'updateCustomer')
      .mockResolvedValueOnce(updatedCustomer);

    render(
      <MemoryRouter initialEntries={['/customers/1']}>
        <Routes>
          <Route
            path="/customers/:id"
            element={<CustomerForm onSubmit={mockSubmit} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockData.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockData.email);
    });

    // Update the values in the form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: updatedData.name },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: updatedData.email },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Update Customer/i }));

    // Check that onSubmit was called with the updated values
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(updatedData);
    });
  });

  it('should load existing customer data when editing', async () => {
    // Simulate an existing customer
    const mockCustomer = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      availableCredit: 1000,
    };

    // Simulate fetchCustomerById
    jest
      .spyOn(CustomerUseCases, 'fetchCustomerById')
      .mockResolvedValue(mockCustomer);

    render(
      <MemoryRouter initialEntries={['/customers/edit/1']}>
        <Routes>
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the customer data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockCustomer.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockCustomer.email);
      expect(screen.getByLabelText(/Available Credit/i)).toHaveValue(
        mockCustomer.availableCredit
      );
    });
  });
});
