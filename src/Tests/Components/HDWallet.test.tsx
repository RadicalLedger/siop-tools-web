import React from 'react'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import { Provider } from 'react-redux';
import HDWallet from '../../components/HDWallet'

import { store } from '../../redux/store'

// it('should not call addTodo if length of text is 0', () => {
//   const mockAddTodo = jest.fn()

//   render(<Provider store={store}><HDWallet/></Provider>)

//   fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
//     target: { value: '' }
//   })

//   expect(mockAddTodo).toHaveBeenCalledTimes(0)
// })

// it('should call addTodo if length of text is greater than 0', () => {
//   const mockAddTodo = jest.fn()

//   render(<Provider store={store}><HDWallet/></Provider>)

//   fireEvent.change(screen.getByPlaceholderText(/Mnemonic Words/i), {
//     target: { value: 'torch spend can plastic cute hunt path fade travel sweet member gaze' }
//   })

//   expect(mockAddTodo).toHaveBeenCalledTimes(1)
// })


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  jest.spyOn(console, 'debug').mockImplementation(jest.fn());
});

describe("App", () => {
  it("renders correctly", () => {
    render(<Provider store={store}><HDWallet /></Provider>);
  });

  // it("renders app bar", () => {
  //   const { getByText } = render(<Provider store={store}><HDWallet/></Provider>);
  //   const appBar = getByText(/SIOP-DID Tools/i);
  //   expect(appBar).toBeInTheDocument();
  // });

  it('should update state to null string when length of mnemonic is 0', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
      target: { value: '' }
    })
    expect(store.getState()['hdwallet']['mnem']).toBe('')
  })

  it('should generate new random seed', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    fireEvent.click(screen.getByText(/Generate New Random Seed/i))

    expect(store.getState()['hdwallet']['seed']).not.toBe('')
  });

  it('should update state when mnemonic is valid', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
      target: { value: 'torch spend can plastic cute hunt path fade travel sweet member gaze' }
    })

    expect(store.getState()['hdwallet']['mnem']).toBe('torch spend can plastic cute hunt path fade travel sweet member gaze')
  });

  it('should update seed to null string when mnemonic is invalid', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
      target: { value: 'torch spend can plastic cute hunt path fade travel sweet m' }
    })
    expect(store.getState()['hdwallet']['seed']).toBe('')
  })

  it('should enable derivation path input for valid mnemonic', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    const derivationPath = screen.getByLabelText(/Derivation path/i)
    fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
      target: { value: 'torch spend can plastic cute hunt path fade travel sweet member gaze' }
    })
    
    expect(derivationPath).not.toBeDisabled();
  })

  it('should disable derivation path input for invalid mnemonic', () => {
    render(<Provider store={store}><HDWallet /></Provider>)
    const derivationPath = screen.getByLabelText(/Derivation path/i)
    fireEvent.change(screen.getByLabelText(/Mnemonic Words/i), {
      target: { value: 'not a valid mnemonic' }
    })
    
    expect(derivationPath).toBeDisabled();
  })

  // it('should update bit length', () => { //failing
  //   render(<Provider store={store}><HDWallet /></Provider>)
  //   fireEvent.change(screen.getByLabelText(/256 bit/i), { target: { value: "256" } });
  //   expect(store.getState()['hdwallet']['nbit']).toBe(256)
  // })

});