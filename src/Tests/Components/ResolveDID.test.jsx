import React from 'react';
import { render, fireEvent, screen, waitForDomChange } from '@testing-library/react';
import { Provider } from 'react-redux';
import ResolveDID from '../../components/ResolveDID'

import { store } from '../../redux/store'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
});

describe("ResolveDID", () => {
    // jest.useFakeTimers()
    // jest.setTimeout(30000)

    it("renders correctly", () => {
        render(<Provider store={store}><ResolveDID /></Provider>);
    });

    // TODO fix following tests
     
    // it("should resolve document", async () => {
    //     render(<Provider store={store}><ResolveDID /></Provider>);
    //     fireEvent.change(screen.getByLabelText(/Decentralized Identity/i), {
    //         target: { value: 'did:ethr:0xd32482CeD4a960fffA1Fee42fF43A20D9930B214' }
    //     })
    //     expect(screen.getByTestId('resolveDID')).not.toBeDisabled()
    //     const component = screen.getByLabelText(/DID-Doc/i)
    //     fireEvent.click(screen.getByTestId('resolveDID'))
    //     jest.useFakeTimers();
    //     setTimeout(() => {
    //         expect(component).toBe('')
    //     }, 10000);
    //     jest.runAllTimers();
    //     // await wait(() => expect(component.toBe('')))
    //     // waitForDomChange().then(() => {
    //     //     waitForDomChange().then(() => {
    //     //         expect(component.textContent).not.toBe('')
    //     //     })
    //     // })
    // });

    // it("should give error", async () => {
    //     render(<Provider store={store}><ResolveDID /></Provider>);
    //     fireEvent.change(screen.getByTestId('resolveDID'), {
    //         target: { value: 'Not a valid did' }
    //     })
    //     expect(screen.getByTestId('resolveDID')).toBeDisabled()
    //     const component = screen.getByLabelText(/DID-Doc/i)
    //     fireEvent.click(screen.getByTestId('resolveDID'))
    //     // return waitForDomChange({timeout:10000}).then(() => {
    //     //     expect(component.textContent).toBe('{"status":"error","message":"Failed to retrive DID Document"}')
    //     // })
    //     // await wait(() => expect(component.toBe('{"status":"error","message":"Failed to retrive DID Document"}')))
    //     // jest.useFakeTimers();
    //     setTimeout(() => {
    //         expect(component).toBe('{"status":"error","message":"Failed to retrive DID Document"}')
    //     }, 5000);
    //     jest.runAllTimers();
    // });
});