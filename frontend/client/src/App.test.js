import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Blog App heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Blog App/i);
  expect(headingElement).toBeInTheDocument();
});