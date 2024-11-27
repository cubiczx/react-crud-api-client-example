import { render, screen } from '@testing-library/react';
import { CustomerList } from '../../../../interfaces/components/CustomerList';

describe('CustomerList', () => {
  it('should render a list of customers', () => {
    const customers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', availableCredit: 1000 },
      { id: '2', name: 'Jane Doe', email: 'jane@example.com', availableCredit: 2000 },
    ];

    render(<CustomerList customers={customers} />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
  });

  it('should show a message if no customers are provided', () => {
    render(<CustomerList customers={[]} />);

    expect(screen.getByText(/no customers available/i)).toBeInTheDocument();
  });
});
