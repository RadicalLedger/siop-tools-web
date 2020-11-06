import React from 'react';
import { render, screen } from '@testing-library/react';
import TextFieldNormal from '../../components/TextFieldNormal'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("TextFieldNormal", () => {
    it("renders correctly", () => {
      render(<TextFieldNormal label="Test label" value=""/>);
      const component = screen.getByLabelText(/Test label/i);
      expect(component).toBeInTheDocument();
    });
  
    it("renders correctly with text", () => {
      const { getByLabelText } = render(<TextFieldNormal label="Test label" value="Test value"/>);
      const component = getByLabelText(/Test label/i);
      expect(component.getAttribute('value')).toBe('Test value')
    });
  
   });