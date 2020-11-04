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
    it("renders correctly", () => {
        render(<Provider store={store}><ResolveDID /></Provider>);
    });

    it("should resolve document", async () => {
        render(<Provider store={store}><ResolveDID /></Provider>);
        fireEvent.change(screen.getByLabelText(/Decentralized Identity/i), {
            target: { value: 'did:ethr:0xd32482CeD4a960fffA1Fee42fF43A20D9930B214' }
        })
        expect(screen.getByTestId('resolveDID')).not.toBeDisabled()
        const component = screen.getByLabelText(/DID-Doc/i)
        fireEvent.click(screen.getByTestId('resolveDID'))
        // await wait(() => expect(component.toBe('')))
        waitForDomChange().then(() => {
            waitForDomChange().then(() => {
                expect(component.textContent).not.toBe('')
            })
        })
    });

    it("should give error", async () => {
        render(<Provider store={store}><ResolveDID /></Provider>);
        fireEvent.change(screen.getByTestId('resolveDID'), {
            target: { value: 'Not a valid did' }
        })
        expect(screen.getByTestId('resolveDID')).toBeDisabled()
        const component = screen.getByLabelText(/DID-Doc/i)
        fireEvent.click(screen.getByTestId('resolveDID'))
        waitForDomChange().then(() => {
            expect(component.textContent).toBe('{"status":"error","message":"Failed to retrive DID Document"}')
        })
        // await wait(() => expect(component.toBe('{"status":"error","message":"Failed to retrive DID Document"}')))
        // await expect(component.textContent).toBe('{"status":"error","message":"Failed to retrive DID Document"}')
    });
});