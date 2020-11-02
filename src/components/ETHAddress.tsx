import { Grid } from '@material-ui/core';
import React from 'react';

import TextFieldNormal from './TextFieldNormal'

export default function ETHAddress(props: { ethAddress: string; }) {

    return (
            <Grid item xs={12}>
            {/* <TextField
                id="standard-read-only-input"
                label="Ethereum Address"
                fullWidth
                value={props.ethAddress}
                InputProps={{
                    readOnly: true,
                }}
            /> */}
            <TextFieldNormal label="Ethereum Address" value={props.ethAddress} />
        </Grid>
    )
}