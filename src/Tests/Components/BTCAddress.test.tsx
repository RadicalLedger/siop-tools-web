import React from 'react';
import { render } from '@testing-library/react';
import BTCAddress from '../../components/BTCAddress'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("BTCAddress", () => {
    it("renders correctly", () => {
      render(<BTCAddress btcAddress=""/>);
    });
  
    it("renders correctly with text", () => {
      const { getByLabelText } = render(<BTCAddress btcAddress="18reqFjpbPPZpjSGqwP57rg9qjCAcnfzyL"/>);
      const component = getByLabelText(/Bitcoin Address/i);
      expect(component).toBeInTheDocument();
    });
  
   });