import React from 'react';
import { render, screen } from '@testing-library/react';
import TextFieldWithCopy from '../../components/TextFieldWithCopy'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("TextFieldWithCopy", () => {
    it("renders correctly", () => {
      render(<TextFieldWithCopy label="Test label" value=""/>);
      const component = screen.getByLabelText(/Test label/i);
      expect(component).toBeInTheDocument();
    });
  
    it("renders correctly with text", () => { //failing
      const { getByLabelText } = render(<TextFieldWithCopy label="Test label" value="Test value"/>);
      const component = getByLabelText(/Test label/i);
      expect(component.getAttribute('value')).toBe('Test value')
    });
  
   });