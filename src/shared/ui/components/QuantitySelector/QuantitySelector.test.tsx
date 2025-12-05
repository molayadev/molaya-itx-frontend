import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantitySelector } from './QuantitySelector';

describe('QuantitySelector', () => {
  const defaultProps = {
    value: 1,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with current value', () => {
    render(<QuantitySelector {...defaultProps} value={5} />);
    
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('should increment value when plus button clicked', () => {
    const onChange = jest.fn();
    
    render(<QuantitySelector {...defaultProps} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Increase quantity'));
    
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should decrement value when minus button clicked', () => {
    const onChange = jest.fn();
    
    render(<QuantitySelector {...defaultProps} value={5} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Decrease quantity'));
    
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('should not go below min', () => {
    const onChange = jest.fn();
    
    render(<QuantitySelector {...defaultProps} value={1} min={1} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Decrease quantity'));
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not go above max', () => {
    const onChange = jest.fn();
    
    render(<QuantitySelector {...defaultProps} value={99} max={99} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Increase quantity'));
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should disable buttons at boundaries', () => {
    render(<QuantitySelector {...defaultProps} value={1} min={1} max={10} />);
    
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    expect(screen.getByLabelText('Increase quantity')).not.toBeDisabled();
  });

  it('should render with label', () => {
    render(<QuantitySelector {...defaultProps} label="Quantity" />);
    
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });
});
