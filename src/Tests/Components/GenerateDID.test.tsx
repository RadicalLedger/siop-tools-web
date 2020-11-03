import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react'
import GenerateDID from '../../components/GenerateDID';


beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
});

describe("Generate DID", () => {

    it("renders correctly", () => {
        render(<GenerateDID />);
    });

    it("should generates new did", () => {
        render(<GenerateDID />);
        fireEvent.click(screen.getByTestId("generateDID"))
        expect(screen.getByLabelText(/Decentralized ID/i)).not.toBe('')
    });

    it("should generates new address", () => {
        render(<GenerateDID />);
        fireEvent.click(screen.getByTestId("generateDID"))
        expect(screen.getByLabelText(/Address/i)).not.toBe('')
    });

    it("should generates new private key", () => {
        render(<GenerateDID />);
        fireEvent.click(screen.getByTestId("generateDID"))
        expect(screen.getByLabelText(/Private key/i)).not.toBe('')
    });

});