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

    // Verificar que los elementos del formulario están presentes
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Customer/i })
    ).toBeInTheDocument();
  });

  it('should render the form correctly for updating a customer', async () => {
    const mockData = { id: '1', name: 'John Doe', email: 'john@example.com' };

    // Simular la respuesta de axios.get para el endpoint esperado
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

    // Esperar a que los datos del cliente sean cargados y renderizados
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockData.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockData.email);
    });

    // Verificar que el botón de actualización está presente
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
    // Simula createCustomer
    jest
      .spyOn(CustomerUseCases, 'createCustomer')
      .mockResolvedValue(mockCustomer);

    render(
      <MemoryRouter>
        <CustomerForm onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    // Cambiar los valores de los campos
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });

    // Hacer clic en el botón de submit
    fireEvent.click(screen.getByRole('button', { name: /Create Customer/i }));

    // Esperar que se llame a onSubmit
    await waitFor(() =>
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: '', // Si no hay ID, debe ser vacío
        name: 'John Doe',
        email: 'john@example.com',
        availableCredit: 0, // Valor predeterminado de availableCredit
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

    // Simular la respuesta de axios.get
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

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockData.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockData.email);
    });

    // Actualizar los valores en el formulario
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: updatedData.name },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: updatedData.email },
    });

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Update Customer/i }));

    // Verificar que se llamó a onSubmit con los valores actualizados
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(updatedData);
    });
  });

  it('should load existing customer data when editing', async () => {
    // Simula un cliente existente
    const mockCustomer = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      availableCredit: 1000,
    };

    // Simula fetchCustomerById
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

    // Espera a que los datos del cliente se carguen
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue(mockCustomer.name);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockCustomer.email);
      expect(screen.getByLabelText(/Available Credit/i)).toHaveValue(
        mockCustomer.availableCredit
      );
    });
  });
});
