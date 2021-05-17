import React from 'react';
import { Button, Grid, Snackbar, TextField, Fade } from '@material-ui/core';

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import DescriptionBox from './DescriptionBox'
import Title from './Title';

import { useDispatch, useSelector } from 'react-redux'
import { setDID, setDidDoc, _did, _didDoc } from '../redux/resolveDIDSlice';

export default function ResolveDID() {

    const did = useSelector(_did)
    const didDoc = useSelector(_didDoc)
    const dispatch = useDispatch()

    const [snackBarState, setState] = React.useState<{open: boolean, text:string}>({open: false,text:''});

    const PROVIDER_NODE = 'https://ropsten.infura.io/ethr-did';

    function didResolve(did: string): Promise<any> {
        const providerConfig = { rpcUrl: PROVIDER_NODE }

        const ethrDidResolver = getResolver(providerConfig)
        const didResolver = new Resolver(ethrDidResolver)


        return new Promise((res, rej) => {
            didResolver.resolve(did).then(doc => {
                res(doc);
            }
            ).catch((err: Error) => {
                rej({ status: 'error', message: 'Failed to retrieve DID Document' })
            })
        })
    }

    function onResolveDID() {

        if (did && did !== '') {
            didResolve(did).then(doc => {
                dispatch(setDidDoc(JSON.stringify(doc, undefined, 4)));
            }).catch(err => {
                dispatch(setDidDoc(JSON.stringify(err)));
            });
        }
    }

    function copyToClipboard(text: string) {
        if (text !== '') {
            navigator.clipboard.writeText(text);
            setState({
                open: true,
                text:"Copied to clipboard"
            });
        }
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false,
        });
    };

    return (
        <div>
            <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    Resolve DID
                </Title>
            </Grid>
            
                <Grid item xs={12}>
                    <DescriptionBox
                        description="To view DID Document for an already generated DID, 
                        paste the DID on the space below and click 'Resolve DID'."
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="standard-basic"
                        label="Decentralized Identity (DID)"
                        fullWidth
                        variant="outlined"
                        inputProps={{ 'aria-label': 'description' }}
                        placeholder="Paste a DID here to resolve its document..."
                        value={did}
                        onChange={e => dispatch(setDID(e.target.value))}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button disabled={did === '' ? true : false}
                    data-testid="resolveDID"
                        onClick={onResolveDID} variant="contained"
                        color="primary">Resolve DID</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="standard-multiline-static"
                        label="DID-Doc"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={didDoc}
                        rowsMax={20}
                        onClick={() => copyToClipboard(didDoc)}
                    />
                </Grid>

            </Grid>
            <Snackbar
                open={snackBarState.open}
                onClose={handleClose}
                TransitionComponent={Fade}
                message="Copied to clipboard"
                autoHideDuration={5000}
            />
        </div>
    )
}