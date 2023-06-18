import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import UserInfo from '../UserInfo.js';


const localProps = {
  customer: {
    name: 'John Doe',
    phone: '123-456-7890',
    login: {  uuid: '123' },
    picture: { medium: 'http://example.com' },
  },
  transactions: [
    {
      id: '123',
      date: '2020-01-01',
      totalsPerDay: { totalPoints: 100, totalAmount: 300 },
    },
  ],
  totals: { totalPoints: '100', totalSpent: '300' },
};

const component = (props = localProps) => render(<UserInfo {...props} />)
    
it('should render', () => {
  component({ ...localProps, reviewers: [] });
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('123-456-7890')).toBeInTheDocument();  
  expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'http://example.com');

});



it('should call toggle when button is clicked and show details', async () => {
  component({ ...localProps, reviewers: [] });
  const showDetailsButton = screen.getByRole('button', { name: 'Show/Hide Details' });
  expect(showDetailsButton).toBeInTheDocument();
  fireEvent.click(showDetailsButton);
  
  await waitFor(() => {
    expect(screen.getByText('Total Amount Spent Per Day')).toBeInTheDocument();
  });

  expect(screen.getByText('Reward Points')).toBeInTheDocument();
  expect(screen.getByText('2020-01-01')).toBeInTheDocument();
  expect(screen.getByText('$300.00')).toBeInTheDocument();
});
