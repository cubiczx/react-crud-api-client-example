import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '../../../../interfaces/components/CustomerForm';

describe('CustomerForm', () => {
  const mockOnSubmit = jest.fn();

  it('should render the form correctly', () => {
    render(<CustomerForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/credit/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data', () => {
    render(<CustomerForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/credit/i), { target: { value: '1000' } });
    fireEvent.click(screen.getByText(/submit/i));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      availableCredit: 1000,
    });
  });
});
