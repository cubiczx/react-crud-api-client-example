import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { CustomerForm } from '../../../../interfaces/components/CustomerForm';
import * as CustomerUseCases from '../../../../application/useCases/CustomerUseCases';
import axios from 'axios';
import { CustomerApiClient } from '../../../../infrastructure/api/CustomerApiClient';
import { Customer } from '../../../../domain/models/Customer';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('CustomerForm', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

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

  it('should display an error if fetchCustomerById fails', async () => {
    const mockFetchCustomerById = jest.spyOn(
      CustomerUseCases,
      'fetchCustomerById'
    );
    mockFetchCustomerById.mockRejectedValue(new Error('Network error'));

    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter initialEntries={['/customer/1']}>
        <Routes>
          <Route
            path="/customer/:id"
            element={<CustomerForm onSubmit={mockOnSubmit} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.queryByText((content) => content.includes('Network error'))
      ).toBeInTheDocument()
    );

    expect(mockFetchCustomerById).toHaveBeenCalledWith('1');
  });

  it('should display an error if fetchCustomerById fails with default error', async () => {
    const mockFetchCustomerById = jest.spyOn(
      CustomerUseCases,
      'fetchCustomerById'
    );
    mockFetchCustomerById.mockRejectedValue(new Error());

    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter initialEntries={['/customer/1']}>
        <Routes>
          <Route
            path="/customer/:id"
            element={<CustomerForm onSubmit={mockOnSubmit} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.queryByText((content) =>
          content.includes('Failed to load customer data.')
        )
      ).toBeInTheDocument()
    );

    expect(mockFetchCustomerById).toHaveBeenCalledWith('1');
  });

  it('should display an error if createCustomer fails', async () => {
    // Mock the createCustomer function to throw an error
    const mockCreateCustomer = jest.spyOn(CustomerUseCases, 'createCustomer');
    mockCreateCustomer.mockRejectedValue(new Error('Server error'));

    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Simulate changing values ​​in form fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Available Credit/i), {
      target: { value: 500 },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for the error message to be rendered
    await waitFor(() =>
      expect(screen.getByText(/Server error/i)).toBeInTheDocument()
    );

    // Verify that createCustomer was called with the correct data
    expect(mockCreateCustomer).toHaveBeenCalledWith({
      id: '',
      name: 'John Doe',
      email: 'john.doe@example.com',
      availableCredit: 500,
    });

    // Verify that onSubmit was not executed due to the error
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error if createCustomer fails with default error', async () => {
    // Mock the createCustomer function to throw an error
    const mockCreateCustomer = jest.spyOn(CustomerUseCases, 'createCustomer');
    mockCreateCustomer.mockRejectedValue(new Error());

    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Simulate changing values ​​in form fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Available Credit/i), {
      target: { value: 500 },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for the error message to be rendered
    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred while submitting the form./i)
      ).toBeInTheDocument()
    );

    // Verify that createCustomer was called with the correct data
    expect(mockCreateCustomer).toHaveBeenCalledWith({
      id: '',
      name: 'John Doe',
      email: 'john.doe@example.com',
      availableCredit: 500,
    });

    // Verify that onSubmit was not executed due to the error
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should navigate back to the list when clicking 'Back to List'", () => {
    const mockNavigate = jest.fn();

    // Aquí hacemos que `useNavigate` retorne el mock de `mockNavigate`
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={jest.fn()} />
      </MemoryRouter>
    );

    // Simular clic en el botón "Back to List"
    fireEvent.click(screen.getByRole('button', { name: /Back to List/i }));

    // Verificar que se haya llamado a `navigate` con '/'
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display an error if name is empty', async () => {
    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Simulate changing values ​​in form fields
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, {
      target: { value: '' },
    });
    nameInput.removeAttribute('required');

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Available Credit/i), {
      target: { value: 500 },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for the error message to be rendered
    await waitFor(() =>
      expect(
        screen.getByText(/Please fill out all fields with valid data./i)
      ).toBeInTheDocument()
    );
  });

  it('should display an error if email is empty', async () => {
    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Simulate changing values ​​in form fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, {
      target: { value: '' },
    });
    emailInput.removeAttribute('required');

    fireEvent.change(screen.getByLabelText(/Available Credit/i), {
      target: { value: 500 },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for the error message to be rendered
    await waitFor(() =>
      expect(
        screen.getByText(/Please fill out all fields with valid data./i)
      ).toBeInTheDocument()
    );
  });

  it('should display an error if available credit is negative', async () => {
    const mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Simulate changing values ​​in form fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });

    const availableCreditInput = screen.getByLabelText(/Available Credit/i);
    fireEvent.change(availableCreditInput, {
      target: { value: '-1' },
    });
    availableCreditInput.removeAttribute('min');
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Wait for the error message to be rendered
    await waitFor(() =>
      expect(
        screen.getByText(/Please fill out all fields with valid data./i)
      ).toBeInTheDocument()
    );
  });
});
