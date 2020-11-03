import React from 'react';
import { render } from '@testing-library/react';
import Title from '../../components/Title'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("Title", () => {
    it("renders correctly", () => {
      render(<Title>{}</Title>);
    });
  
    it("renders correctly with text", () => {
    const { getByText } = render(<Title>Test Caption</Title>);
      const component = getByText(/Test Caption/i);
      expect(component).toBeInTheDocument();
    });
  
   });