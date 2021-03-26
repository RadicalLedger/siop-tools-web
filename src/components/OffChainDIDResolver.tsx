import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
export default function OCDIDResolver() {

    const [did, setDid] = useState('')
    const [didDoc, setDDidDoc] = useState('')
    const [isValidDID, setIsValidDID] = useState(true)
    const classes = useStyles();


    function getDID(){
        if(isAddress(did.split(':')[2])){
            setIsValidDID(true)
            axios.get(`${process.env.REACT_APP_BACKEND}/did/${did}`).then((res:any) => {
                console.log(res.data)
                setDDidDoc(JSON.stringify(res.data.didDocument))
              }).catch(err => {
                setDDidDoc('Error')
              })
        }else{
            setIsValidDID(false)
        }
        
      }

    function handleDidInput(did: string): void {
        setDid(did)
    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    {'Resolve Offchain DID'}
                </Title>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="did"
                    label="DID"
                    placeholder="did:ethr:0x0000000000000000000000000000000"
                    variant="standard"
                    fullWidth
                    value={did}
                    onChange={(e: any) => handleDidInput(e.target.value)}
                    error={!isValidDID}
                    helperText={isValidDID ? "" : "Invalid DID"}
                />
            </Grid>

            <Grid item xs={12}>
                <Button className={classes.btn} onClick={getDID} variant="contained" color="primary">
                    Resolve DID
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