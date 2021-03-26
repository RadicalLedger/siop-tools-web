import React, { useState } from 'react';
import jwt from 'jsonwebtoken'
import { Grid, TextField, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ecdsaSign, publicKeyCreate } from 'secp256k1'
import Title from './Title'


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

/**
 * HD wallet component
 * @return {React.ReactElement}
 */
export default function OCDIDUpdater() {

    const [did, setDid] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [didDoc, setDidDoc] = useState('')
    const [isValidDID, setIsValidDID] = useState(true)
    const [isUpdated, setIsUpdated] = useState(false)

    const classes = useStyles();

    function handleUpdateDID() {
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
                        console.log(res.data.newResolution.didDocument)
                        setDidDoc(JSON.stringify(res.data.newResolution.didDocument))
                        setIsUpdated(true)
                    }).catch(err => {
                        setIsUpdated(false)
                        setDidDoc(err.message)
                    })
            }).catch(err => {
                setIsUpdated(false)
                setDidDoc(err.message)
            })
        }else{
            setIsValidDID(false)
            setDidDoc('')
        }
        
    }


    function handleDidInput(did: string): void {
        setDid(did)

    }

    function handlePrivateKeyInput(privateKey: string): void {
        setPrivateKey(privateKey)

    }

    function handlePublicKeyInput(publicKey: string): void {
        setPublicKey(publicKey)

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
        </Grid>
    )
}