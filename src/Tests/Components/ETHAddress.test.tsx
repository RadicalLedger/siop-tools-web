import React from 'react';
import { render } from '@testing-library/react';
import ETHAddress from '../../components/ETHAddress'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("ETHAddress", () => {
    it("renders correctly", () => {
      const { getByLabelText } = render(<ETHAddress ethAddress=""/>);
      const component = getByLabelText(/Ethereum Address/i);
      expect(component).toBeInTheDocument();
    });
  
    it("renders correctly with text", () => { //failing
      const { getByLabelText } = render(<ETHAddress ethAddress="0xd32482CeD4a960fffA1Fee42fF43A20D9930B214"/>);
      const component = getByLabelText(/Ethereum Address/i);
      expect(component.getAttribute('value')).toBe("0xd32482CeD4a960fffA1Fee42fF43A20D9930B214");
    });
  
   });