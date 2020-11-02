import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import DescriptionBox from './DescriptionBox'
import Title from './Title';

export default function ResolveDID() {
    const [did, setDID] = useState('');
    const [didDoc, setDIDDoc] = useState('');

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
                rej({ status: 'error', message: 'Failed to retrive DID Document' })
            })
        })
    }

    function onResolveDID() {

        if (did && did !== '') {
            didResolve(did).then(doc => {
                setDIDDoc(JSON.stringify(doc, undefined, 4));
                console.log(doc)
            }).catch(err => {
                setDIDDoc(JSON.stringify(err));
                console.log(err)
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
                        value={did}
                        onChange={e => setDID(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button disabled={did === '' ? true : false}
                        onClick={onResolveDID} variant="contained"
                        color="primary">Resolve DID</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="standard-multiline-static"
                        label="DID-Doc"
                        multiline
                        fullWidth
                        value={didDoc}
                        rowsMax={20}
                    />
                </Grid>

            </Grid>
        </div>
    )
}