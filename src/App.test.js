import { render, screen } from '@testing-library/react';
import App from './App';

describe('renders app', () => {
  render(<App />);

  it('is login to spotify button present', () => {
    const linkElement = screen.getByText(/Login to spotify/i);
    expect(linkElement).toBeInTheDocument();
  });

});
