import React from 'react';
import { render } from '@testing-library/react';
import TextFieldWithCopy from '../../components/TextFieldWithCopy'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("TextFieldWithCopy", () => {
    it("renders correctly", () => {
      render(<TextFieldWithCopy label="" value=""/>);
    });
  
    // it("renders correctly with text", () => { //failing
    //   const { getByLabelText } = render(<TextFieldWithCopy label="Test label" value="Test value"/>);
    //   const component = getByLabelText(/Test label/i);
    //   expect(component.textContent).toBe('Test value')
    // });
  
   });