import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Title from './Title'
import axios from 'axios';
import { isAddress } from '../utils';

import { useDispatch, useSelector } from 'react-redux'
import { setDID, setDIDDocument, _did, _didDoc } from '../redux/offResolverSlice'
import Spinner from './Spinner';

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

    const did = useSelector(_did)
    const didDoc = useSelector(_didDoc)
    const [isValidDID, setIsValidDID] = useState(true)
    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{ open: boolean, text: string }>({ open: false, text: '' });
    const [isResolving, setIsResolving] = useState(false)

    const dispatch = useDispatch()

    function getDID() {
        if (isAddress(did.split(':')[2])) {
            setIsValidDID(true)
            setIsResolving(true)
            axios.get(`${process.env.REACT_APP_BACKEND}/did/${did}`).then((res: any) => {
                console.log(res.data)
                dispatch(setDIDDocument(JSON.stringify(res.data.didDocument)))
                setIsResolving(false)
            }).catch(err => {
                if (err.response && err.response.data.error) {
                    dispatch(setDIDDocument(err.response.data.error))
                } else {
                    dispatch(setDIDDocument("Error"))
                }
                setIsResolving(false)
            })
        } else {
            setIsValidDID(false)
        }

    }

    function handleDidInput(did: string): void {
        dispatch(setDID(did))
    }

    function copyToClipboard(text: string) {
        if (text !== '') {
            if (window.isSecureContext) {
                navigator.clipboard.writeText(text);
                setState({
                    open: true,
                    text: "Copied to clipboard"
                });

            } else {
                setState({
                    open: true,
                    text: "Clould not copied"
                });
            }
        }
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
                    label="Decentralized Identity (DID)"
                    fullWidth
                    variant="outlined"
                    inputProps={{ 'aria-label': 'description' }}
                    placeholder="Paste a DID here to resolve its document..."
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
                    onClick={() => { copyToClipboard(didDoc) }}
                />
            </Grid>
            {isResolving && <Spinner />}

        </Grid>
    )
}