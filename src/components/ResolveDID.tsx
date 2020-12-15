import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import DescriptionBox from './DescriptionBox'
import Title from './Title';

import { useTypedSelector } from '../redux/reducers/reducer'
import { useDispatch } from 'react-redux'
import {
    setDIDRes,
    setDIDDoc
} from '../redux/actions'

export default function ResolveDID() {

    const state = useTypedSelector(state => state.didResolver)
    const dispatch = useDispatch()

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

        if (state.did && state.did !== '') {
            didResolve(state.did).then(doc => {
                dispatch(setDIDDoc(JSON.stringify(doc, undefined, 4)));
            }).catch(err => {
                dispatch(setDIDDoc(JSON.stringify(err)));
            });
        }
    }

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
                        inputProps={{ 'aria-label': 'description' }}
                        placeholder="Paste a DID here to resolve its document..."
                        value={state.did}
                        onChange={e => dispatch(setDIDRes(e.target.value))}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button disabled={state.did === '' ? true : false}
                    data-testid="resolveDID"
                        onClick={onResolveDID} variant="contained"
                        color="primary">Resolve DID</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="standard-multiline-static"
                        label="DID-Doc"
                        multiline
                        fullWidth
                        value={state.didDoc}
                        rowsMax={20}
                    />
                </Grid>

            </Grid>
        </div>
    )
}