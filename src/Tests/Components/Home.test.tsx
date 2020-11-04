import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../components/Home'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("BTCAddress", () => {
    
    it("renders correctly", () => {
      const { getByText } = render(<Home/>);
      const component = getByText(/Privacy Guaranteed/i);
      expect(component).toBeInTheDocument();
    });

  
   });