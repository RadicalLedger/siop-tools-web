import { Grid } from '@material-ui/core';
import React from 'react';

import TextFieldNormal from './TextFieldNormal'

export default function BTCAddress(props: { btcAddress: string; }) {
    return (
        <Grid item xs={12}>
            {/* <TextField
                id="standard-read-only-input"
                label="Bitcoin Address"
                fullWidth
                value={props.btcAddress}
                InputProps={{
                    readOnly: true,
                }}
            /> */}
            <TextFieldNormal label="Bitcoin Address" value={props.btcAddress} />
        </Grid>
    )
}