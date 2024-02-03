import { render, screen } from '@testing-library/react';
import React from 'react';
import Register from '../src/components/Register';

describe('Register Component', () => {
  it('renders without crashing', () => {
    render(<Register />);
    const linkElement = screen.getByText(/BakeOei/i);
    expect(linkElement).toBeInTheDocument();
  });

  // Add more tests as needed
});

