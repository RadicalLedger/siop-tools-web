import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import DrawerItems from '../../components/DrawerItems'

import { store } from '../../redux/store'

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
});

describe("DrawerItems", () => {
    it("renders correctly", () => {
        render(<Provider store={store}><DrawerItems /></Provider>);
    });

    it("updates home state", () => {
        render(<Provider store={store}><DrawerItems /></Provider>)
        fireEvent.click(screen.getByText(/Home/i))
        expect(store.getState()['views']['view']).toBe(0)
    });

    it("updates generate did state", () => {
        render(<Provider store={store}><DrawerItems /></Provider>)
        fireEvent.click(screen.getByText(/Generate DID/i))
        expect(store.getState()['views']['view']).toBe(1)
    });

    it("updates resolve did state", () => {
        render(<Provider store={store}><DrawerItems /></Provider>)
        fireEvent.click(screen.getByText(/Resolve DID/i))
        expect(store.getState()['views']['view']).toBe(2)
    });

    it("updates generate eth address state", () => {
        render(<Provider store={store}><DrawerItems /></Provider>)
        fireEvent.click(screen.getByText(/Generate Ethereum Addresses/i))
        expect(store.getState()['views']['view']).toBe(3)
        expect(store.getState()['views']['ctyp']).toBe('ETH')
    });

    it("updates generate btc address state", () => {
        render(<Provider store={store}><DrawerItems /></Provider>)
        fireEvent.click(screen.getByText(/Generate Bitcoin Addresses/i))
        expect(store.getState()['views']['view']).toBe(3)
        expect(store.getState()['views']['ctyp']).toBe('BTC')
    });

});