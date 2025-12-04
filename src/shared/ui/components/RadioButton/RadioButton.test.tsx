import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  const defaultProps = {
    id: 'test-radio',
    name: 'test',
    value: 'option1',
    label: 'Option 1',
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with label', () => {
    render(<RadioButton {...defaultProps} />);
    
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  it('should call onChange when clicked', () => {
    const onChange = jest.fn();
    
    render(<RadioButton {...defaultProps} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Option 1'));
    
    expect(onChange).toHaveBeenCalledWith('option1');
  });

  it('should not call onChange when disabled', () => {
    const onChange = jest.fn();
    
    render(<RadioButton {...defaultProps} onChange={onChange} disabled />);
    
    fireEvent.click(screen.getByLabelText('Option 1'));
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should show checked state', () => {
    render(<RadioButton {...defaultProps} checked />);
    
    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('should apply disabled attribute', () => {
    render(<RadioButton {...defaultProps} disabled />);
    
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });
});
