import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux'
import { store } from './redux/store'
import { setView } from './redux/actions'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  jest.spyOn(console, 'debug').mockImplementation(jest.fn());
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
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

  it('should render home component', () => {
    store.dispatch(setView({ ctyp: '', view: 0 }))
    render(<Provider store={store}><App /></Provider>)
    const home = screen.getByText(/Privacy Guaranteed/i)
    
    expect(home).toBeInTheDocument();
  });

  it('should render generate did component', () => {
    store.dispatch(setView({ ctyp: '', view: 1 }))
    render(<Provider store={store}><App /></Provider>)
    const home = screen.getByTestId('generateDID')
    
    expect(home).toBeInTheDocument();
  });

  it('should render resolve did component', () => {
    store.dispatch(setView({ ctyp: '', view: 2 }))
    render(<Provider store={store}><App /></Provider>)
    const home = screen.getByText(/view DID Document for an already generated DID, paste the DID on the space below and click/i)
    
    expect(home).toBeInTheDocument();
  });

  it('should render hd wallet component', () => {
    store.dispatch(setView({ ctyp: '', view: 3 }))
    render(<Provider store={store}><App /></Provider>)
    const home = screen.getByLabelText(/Master Private Key/i)
    
    expect(home).toBeInTheDocument();
  });

 });