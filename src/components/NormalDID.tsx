import React from 'react';
import { Button, Fade, Grid, Snackbar } from '@material-ui/core';

import TextWithCopy from './TextFieldWithCopy';
import DescriptionBox from './DescriptionBox';
import Title from './Title';

import { useDispatch, useSelector } from 'react-redux';
import {
    setAddress,
    setDID,
    setPrivateKey,
    _address,
    _did,
    _privateKey
} from '../redux/normalDIDSlice';
import Wallet, { Types, validateMnemonic, generateMnemonic } from 'did-hd-wallet';

export default function NormalDID() {
    const address = useSelector(_address);
    const did = useSelector(_did);
    const privateKey = useSelector(_privateKey);
    const dispatch = useDispatch();

    const [snackBarState, setState] = React.useState<{ open: boolean; text: string }>({
        open: false,
        text: ''
    });

    async function generateDID() {
        try {
            const memonic = generateMnemonic(128);
            const wallet = new Wallet(Types.MNEMONIC, memonic);
            const { did, privateKey, address } = await wallet.getMasterKeys();

            dispatch(setAddress(address));
            dispatch(setPrivateKey(privateKey as string));
            dispatch(setDID(did));
        } catch (error) {
            console.log('error', error);
        }
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false
        });
    }

    function callback(success: boolean) {
        if (success) {
            setState({
                open: true,
                text: 'Copied to clipboard'
            });
        } else {
            setState({
                open: true,
                text: 'Clould not copied'
            });
        }
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>Generate DID</Title>
                </Grid>

                <Grid item xs={12}>
                    <DescriptionBox
                        description="You could create an Key address along with a private 
                        key and register that as a Decentralized Identity here. 
                        Click 'Generate DID' to generate a DID."
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        data-testid="generateDID"
                        onClick={generateDID}
                        variant="contained"
                        color="primary">
                        Generate DID
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Address" value={address} callback={callback} />
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Private key" value={privateKey} callback={callback} />
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Decentralized ID (DID)" value={did} callback={callback} />
                </Grid>
            </Grid>

            <Snackbar
                open={snackBarState.open}
                onClose={handleClose}
                TransitionComponent={Fade}
                message={snackBarState.text}
                autoHideDuration={5000}
            />
        </div>
    );
}
