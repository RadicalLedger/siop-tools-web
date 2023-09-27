import React from 'react';
import { Grid, Button, Snackbar, Fade } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Title from './Title';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { useDispatch, useSelector } from 'react-redux';
import {
    setAddress,
    setDID,
    setPrivateKey,
    setPublicKey,
    _address,
    _did,
    _privateKey,
    _publicKey
} from '../redux/offCreatorSlice';
import TextWithCopy from './TextFieldWithCopy';
import DescriptionBox from './DescriptionBox';
import Wallet, { generateMnemonic, Types } from 'did-hd-wallet';
import Ed25519 from 'sd-vc-lib/dist/utils/ed25519';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2)
            }
        },
        btn: {
            marginBottom: 10
        }
    })
);

export default function OCDIDCreator() {
    const did = useSelector(_did);
    const privateKey = useSelector(_privateKey);
    const publicKey = useSelector(_publicKey);
    const address = useSelector(_address);
    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{ open: boolean; text: string }>({
        open: false,
        text: ''
    });

    const dispatch = useDispatch();

    async function generateDID() {
        const ed = new Ed25519();
        const mnemonic = generateMnemonic(128);

        const wallet = new Wallet(Types.MNEMONIC, mnemonic);
        const { did, privateKey, publicKey, verificationKey, address } =
            await wallet.getMasterKeys();

        const challengeResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/did/`, {
            did: did
        });
        const { challenge: challenge } = jwt.decode(challengeResponse.data.challengeToken) as any;

        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/did/`, {
            did: did,
            verificationKey: verificationKey,
            challengeResponse: {
                publicKey: publicKey,
                cipherText: ed
                    .sign(Buffer.from(challenge, 'hex'), Buffer.from(privateKey as string, 'hex'))
                    .toHex(),
                jwt: challengeResponse.data.challengeToken
            }
        });

        if (!response?.data?.did && response?.data?.status !== 'success') {
            console.log(response);
            const error = 'Error. Please try again later';
            dispatch(setDID(error));
            dispatch(setPrivateKey(error));
            dispatch(setPublicKey(error));
            dispatch(setAddress(error));
            return;
        }

        dispatch(setDID(did));
        dispatch(setPrivateKey(privateKey as string));
        dispatch(setPublicKey(publicKey as string));
        dispatch(setAddress(address));
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
                    <Title>Generate Offchain DID</Title>
                </Grid>

                <Grid item xs={12}>
                    <DescriptionBox
                        description="You could create an Key address along with a private 
                    key and register that as a Decentralised Identity here. 
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
                    <TextWithCopy label="Public key" value={publicKey} callback={callback} />
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
