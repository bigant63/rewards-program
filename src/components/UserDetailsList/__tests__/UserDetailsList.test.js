import { fireEvent, screen, render } from '@testing-library/react';
import UserDetailsList from '../UserDetailsList.js';
import '@testing-library/jest-dom'

const localProps = {
  id: '123',
  onShowDetails: jest.fn(),
  totals: { totalPoints: '100', totalSpent: '300' },
};

const component = (props = localProps) => render(<UserDetailsList {...props} />)
    
it('should render', () => {
  component({ ...localProps, reviewers: [] });
  expect(screen.getByText('Total points for the last 3 months:')).toBeInTheDocument();
  expect(screen.getByText('Total dollars spent for the last 3 months:')).toBeInTheDocument();
  const showDetailsButton = screen.getByText('Show/Hide Details');
  expect(showDetailsButton).toBeInTheDocument();
});



it('should call toggle when button is clicked', () => {
  component({ ...localProps, reviewers: [] });
  const showDetailsButton = screen.getByRole('button', { name: 'Show/Hide Details' });
  expect(showDetailsButton).toBeInTheDocument();
  fireEvent.click(showDetailsButton);
  expect(localProps.onShowDetails).toHaveBeenCalledTimes(1);
});
