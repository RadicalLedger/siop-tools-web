import React, { useState } from 'react';
import jwt from 'jsonwebtoken'
import { Grid, TextField, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ecdsaSign, publicKeyCreate } from 'secp256k1'

import Title from './Title'
import Spinner from './Spinner'

import { useDispatch, useSelector } from 'react-redux'
import { _did, _didDoc, _privateKey, _publicKey, setDIDDocument, setDID, setPrivateKey, setPublicKey } from '../redux/offUpdaterSlice';

import axios from 'axios';
import { isAddress } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        btn: {
            marginBottom: 10
        }
    }),
);

export default function OCDIDUpdater() {

    const did = useSelector(_did)
    const privateKey = useSelector(_privateKey)
    const publicKey = useSelector(_publicKey)
    const didDoc = useSelector(_didDoc)
    const [isValidDID, setIsValidDID] = useState(true)
    const [isUpdated, setIsUpdated] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const dispatch = useDispatch()

    const classes = useStyles();

    function handleUpdateDID() {
        setIsUpdating(true)
        if(isAddress(did.split(':')[2])){
            setIsValidDID(true)
            axios.put(`${process.env.REACT_APP_BACKEND}/did/${did}`).then((res: any) => {
                const { challenge } = jwt.decode(res.data.challengeToken) as any
                axios.put(`${process.env.REACT_APP_BACKEND}/did/${did}`,
                    {
                        "challengeResponse": {
                            "publicKey": Buffer.from(publicKeyCreate(Buffer.from(privateKey, 'hex'))).toString('hex'),
                            "cipherText": Buffer.from(ecdsaSign(
                                Buffer.from(challenge, 'hex'),
                                Buffer.from(privateKey, 'hex')).signature).toString('hex'),
                            "jwt": res.data.challengeToken
                        },
                        "authentication": {
                            "type": "Secp256k1SignatureAuthentication2018",
                            "publicKey": publicKey
                        }
                    }).then(res => {
                        setIsUpdating(false)
                        dispatch(setDIDDocument(JSON.stringify(res.data.newResolution.didDocument)))
                        setIsUpdated(true)
                    }).catch(err => {
                        console.log('err', err.response.data.error)
                        setIsUpdating(false)
                        setIsUpdated(false)
                        if (err.response && err.response.data.error) {
                            dispatch(setDIDDocument(err.response.data.error))
                        } else {
                            dispatch(setDIDDocument("Error"))
                        }
                    })
            }).catch(err => {
                setIsUpdating(false)
                setIsUpdated(false)
                if (err.response && err.response.data.error) {
                    dispatch(setDIDDocument(err.response.data.error))
                } else {
                    dispatch(setDIDDocument("Error"))
                }
            })
        }else{
            setIsValidDID(false)
            dispatch(setDIDDocument(''))
        }
    }


    function handleDidInput(did: string): void {
        dispatch(setDID(did))

    }

    function handlePrivateKeyInput(privateKey: string): void {
        dispatch(setPrivateKey(privateKey))

    }

    function handlePublicKeyInput(publicKey: string): void {
        dispatch(setPublicKey(publicKey))

    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    {'Update Offchain DID'}
                </Title>
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
                    helperText={isValidDID ? "" : "Invalid DID"}
                />
            </Grid>

            <Grid item xs={12}>
                <div className={classes.root}>
                    <Alert severity="info">
                        Your private key will never go outside this machine. Private key will only be used for verify the ownership.
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
                <Button className={classes.btn} onClick={handleUpdateDID} variant="contained" color="primary">
                    Update DID
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
                        readOnly: true,
                    }}
                />
            </Grid>
            {isUpdating && <Spinner />}
        </Grid>
    )
}