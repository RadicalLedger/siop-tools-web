import React, { useState } from 'react';
import jwt from 'jsonwebtoken'
import { ecdsaSign, publicKeyCreate } from 'secp256k1'
import { Grid, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Title from './Title'



import { isAddress } from '../utils';
import axios from 'axios';

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
export default function OCDIDRevoker() {

    
    const [did, setDid] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [didDoc, setDidDoc] = useState('')
    const [isValidDID, setIsValidDID] = useState(true)
    const [isRevoked, setIsRevoked] = useState(false)
    const classes = useStyles();


    function handleRevokeDID(): void {
         if(isAddress(did.split(':')[2])){
            setIsValidDID(true)
            axios.patch(`${process.env.REACT_APP_BACKEND}/did/${did}`).then(res => {
                const { challenge } = jwt.decode(res.data.challengeToken) as any
                axios.patch(`${process.env.REACT_APP_BACKEND}/did/${did}`,
                  {
                    "challengeResponse": {
                      "publicKey": Buffer.from(publicKeyCreate(Buffer.from(privateKey, 'hex'))).toString('hex'),
                      "cipherText": Buffer.from(ecdsaSign(
                        Buffer.from(challenge, 'hex'),
                        Buffer.from(privateKey, 'hex')).signature).toString('hex'),
                      "jwt": res.data.challengeToken
                    }
                  }).then(res => {
                    console.log(res.data)
                    setDidDoc(JSON.stringify(res.data.newResolution.didDocument))
                    setIsRevoked(true)
                  }).catch(err => {
                    setDidDoc(err.message)
                    setIsRevoked(false)
                  })
              }).catch(err => {
                setDidDoc(err.message)
                setIsRevoked(false)
              })
         }else{
            setIsValidDID(false)
         }

    }


    function handlePrivateKeyInput(privateKey: string): void {
        setPrivateKey(privateKey)
    }

    function handleDidInput(did: string): void {
        setDid(did)
    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    {'Revoke Offchain DID'}
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
                <Button className={classes.btn} onClick={handleRevokeDID} variant="contained" color="primary">
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
                        readOnly: true,
                    }}
                />
            </Grid>
        </Grid>
    )
}