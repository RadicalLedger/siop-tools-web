import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux'
import { store } from './redux/store'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  jest.spyOn(console, 'debug').mockImplementation(jest.fn());
});

describe("App", () => {
  it("renders correctly", () => {
    render(<Provider store={store}><App /></Provider>);
  });

  it("renders app bar", () => {
    const { getByText } = render(<Provider store={store}><App /></Provider>);
    const appBar = getByText(/SIOP-DID Tools/i);
    expect(appBar).toBeInTheDocument();
  });

 });