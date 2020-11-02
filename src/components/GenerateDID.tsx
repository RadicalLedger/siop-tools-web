import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import W3 from 'web3'
import EthrDID from 'ethr-did'

import TextWithCopy from './TextFieldWithCopy'
import DescriptionBox from './DescriptionBox'
import Title from './Title';

export default function GenerateDID() {

    const [address, setAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [did, setDID] = useState('');

    const PROVIDER_NODE = 'https://ropsten.infura.io/chim_himidumage'
    const provider = new W3.providers.HttpProvider(PROVIDER_NODE);

    function generateDID() {

        try {
            const w3 = new W3(provider);
            let acc = w3.eth.accounts.create();
            const ethrDid = new EthrDID({ address: acc.address, privateKey: acc.privateKey, provider })

            setAddress(acc.address)
            setPrivateKey(acc.privateKey.replace('0x', ''))
            setDID(ethrDid.did)
        }
        catch (error) {
            console.log("error", error);
        }
    }

    return (
        <div>
            <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    Generate DID
                </Title>
            </Grid>
            
                <Grid item xs={12}>
                    <DescriptionBox
                        description="You could create an Ethereum adderes along with a private 
                        key and register that as a Decentralised Identity here. 
                        Click 'Generate DID' to generate a DID."
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button onClick={generateDID} variant="contained" color="primary">Generate DID</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Address" value={address} />
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Private key" value={privateKey} />
                </Grid>

                <Grid item xs={12}>
                    <TextWithCopy label="Decentralized ID (DID)" value={did} />
                </Grid>

            </Grid>
        </div >
    )
}