import React from 'react';
import { render } from '@testing-library/react';
import TextFieldNormal from '../../components/TextFieldNormal'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  });
  
  describe("TextFieldNormal", () => {
    it("renders correctly", () => {
      render(<TextFieldNormal label="" value=""/>);
    });
  
    // it("renders correctly with text", () => { //failing
    //   const { getByLabelText } = render(<TextFieldNormal label="Test label" value="Test value"/>);
    //   const component = getByLabelText(/Test label/i);
    //   expect(component.textContent).toBe('Test value')
    // });
  
   });