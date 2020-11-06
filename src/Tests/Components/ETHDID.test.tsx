import React from 'react';
import { render } from '@testing-library/react';
import ETHDID from '../../components/ETHDID'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("ETHDID", () => {
    it("renders correctly", () => {
      const { getByLabelText } = render(<ETHDID did=""/>);
      const component = getByLabelText(/Decentralized ID/i);
      expect(component).toBeInTheDocument();
    });
  
    it("renders correctly with text", () => {
      const { getByLabelText } = render(<ETHDID did="did:ethr:0xd32482CeD4a960fffA1Fee42fF43A20D9930B214"/>);
      const component = getByLabelText(/Decentralized ID/i);
      expect(component.getAttribute('value')).toBe("did:ethr:0xd32482CeD4a960fffA1Fee42fF43A20D9930B214");
    });
  
   });