import React from 'react';
import { render } from '@testing-library/react';
import DescriptionBox from '../../components/DescriptionBox'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("DescriptionBox", () => {
    it("renders correctly", () => {
      const { getByTestId } = render(<DescriptionBox description="" />);
      const component = getByTestId('descriptionBox');
      expect(component).toBeInTheDocument();
    });
  
    it("renders with text", () => { //failing
      const { getByText } = render(<DescriptionBox description="Test Description" />);
      const component = getByText(/Test Description/i); 
      expect(component.innerHTML).toBe("Test Description");
    });
  
   });