import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders the GameLobby title', () => {
    render(<Home />);
    expect(screen.getByText(/GameLobby/i)).toBeInTheDocument();
  });
});
