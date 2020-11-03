import React from 'react';
import { render } from '@testing-library/react';
import DescriptionBox from '../../components/DescriptionBox'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("DescriptionBox", () => {
    it("renders correctly", () => {
      render(<DescriptionBox description="" />);
    });
  
    it("renders with text", () => {
      const { getByText } = render(<DescriptionBox description="Test Description" />);
      const component = getByText(/Test Description/i);
      expect(component).toBeInTheDocument();
    });
  
   });