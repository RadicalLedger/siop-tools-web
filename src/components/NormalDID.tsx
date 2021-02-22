import React from 'react';
import { Button, Grid } from '@material-ui/core';

import TextWithCopy from './TextFieldWithCopy'
import DescriptionBox from './DescriptionBox'
import Title from './Title';

import { useDispatch, useSelector } from 'react-redux'
import { setAddress, setDID, setPrivateKey, _address, _did, _privateKey } from '../redux/normalDIDSlice';
import { createRandomETHDID } from 'did-hd-wallet';


export default function NormalDID() {

    const address = useSelector(_address)
    const did = useSelector(_did)
    const privateKey = useSelector(_privateKey)
    const dispatch = useDispatch()

    function generateDID() {

        try {
            const {privateKey, did} = createRandomETHDID()

            dispatch(setAddress(did.replace('did:ethr:', '')))
            dispatch(setPrivateKey(privateKey))
            dispatch(setDID(did))
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
                    <Button data-testid="generateDID" onClick={generateDID} variant="contained" color="primary">Generate DID</Button>
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