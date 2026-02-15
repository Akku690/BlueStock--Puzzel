import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading Component', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByRole('generic').querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading puzzle...')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.loading-container')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });
});
