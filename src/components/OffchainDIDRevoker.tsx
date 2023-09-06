import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { useDispatch, useSelector } from 'react-redux';
import {
    _privateKey,
    setPrivateKey,
    setDID,
    setDIDDocument,
    _did,
    _didDoc
} from '../redux/offRevokerSlice';

import Title from './Title';
import Spinner from './Spinner';

import { isAddress } from '../utils';
import axios from 'axios';
import Ed25519 from 'sd-vc-lib/dist/utils/ed25519';
import Wallet, { Types } from 'did-hd-wallet';
import { _publicKey, setPublicKey } from '../redux/offUpdaterSlice';

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

export default function OCDIDRevoker() {
    const did = useSelector(_did);
    const privateKey = useSelector(_privateKey);
    const publicKey = useSelector(_publicKey);
    const didDoc = useSelector(_didDoc);
    const [isValidDID, setIsValidDID] = useState(true);
    const [isRevoked, setIsRevoked] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);

    const classes = useStyles();

    const dispatch = useDispatch();

    async function handleRevokeDID() {
        const ed = new Ed25519();
        setIsRevoking(true);
        setIsValidDID(true);

        try {
            const challengeResponse = await axios.patch(
                `${process.env.REACT_APP_BACKEND}/did/${did}`
            );
            const { challenge: challenge } = jwt.decode(
                challengeResponse.data.challengeToken
            ) as any;

            axios
                .patch(`${process.env.REACT_APP_BACKEND}/did/${did}`, {
                    challengeResponse: {
                        publicKey: publicKey,
                        cipherText: ed
                            .sign(
                                Buffer.from(challenge, 'hex'),
                                Buffer.from(privateKey as string, 'hex')
                            )
                            .toHex(),
                        jwt: challengeResponse.data.challengeToken
                    }
                })
                .then((res) => {
                    dispatch(
                        setDIDDocument(JSON.stringify(res.data.newResolution.didDocument, null, 4))
                    );
                    setIsRevoked(true);
                    setIsRevoking(false);
                })
                .catch((err) => {
                    if (err.response && err.response.data.error) {
                        dispatch(setDIDDocument(err.response.data.error));
                    } else if (err.error) {
                        dispatch(setDIDDocument(err.error));
                    } else {
                        dispatch(setDIDDocument('Error'));
                    }

                    setIsRevoked(false);
                    setIsRevoking(false);
                })
                .finally(() => {
                    setIsRevoking(false);
                });
        } catch (err: any) {
            console.log(err);
            if (err.response && err.response.data.error) {
                dispatch(setDIDDocument(err.response.data.error));
            } else {
                dispatch(setDIDDocument('Error'));
            }
            setIsRevoked(false);
            setIsRevoking(false);
        }
    }

    function handlePrivateKeyInput(privateKey: string): void {
        dispatch(setPrivateKey(privateKey));
    }

    function handlePublicKeyInput(publicKey: string): void {
        dispatch(setPublicKey(publicKey));
    }

    function handleDidInput(did: string): void {
        dispatch(setDID(did));
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Title>{'Revoke Offchain DID'}</Title>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="did"
                    label="DID"
                    placeholder="did:ethr:0x0000000000000000000000000000000"
                    variant="outlined"
                    fullWidth
                    value={did}
                    onChange={(e: any) => handleDidInput(e.target.value)}
                    error={!isValidDID}
                    helperText={isValidDID ? '' : 'Invalid DID'}
                />
            </Grid>

            <Grid item xs={12}>
                <div className={classes.root}>
                    <Alert severity="info">
                        Your private key will never go outside this machine. Private key will only
                        be used for verify the ownership.
                    </Alert>
                </div>
                <TextField
                    id="privateKey"
                    label="Private Key of DID controller"
                    variant="outlined"
                    fullWidth
                    value={privateKey}
                    onChange={(e: any) => handlePrivateKeyInput(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="publicKey"
                    label="Public Key"
                    variant="outlined"
                    fullWidth
                    value={publicKey}
                    onChange={(e: any) => handlePublicKeyInput(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <Button
                    className={classes.btn}
                    onClick={handleRevokeDID}
                    variant="contained"
                    color="primary">
                    Revoke DID
                </Button>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="didDoc"
                    label="DID Document"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={didDoc}
                    InputProps={{
                        readOnly: true
                    }}
                />
            </Grid>
            {isRevoking && <Spinner />}
        </Grid>
    );
}
