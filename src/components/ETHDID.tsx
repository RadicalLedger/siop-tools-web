import { Grid } from '@material-ui/core';
import React from 'react';

import TextFieldWithCopy from './TextFieldWithCopy'

export default function ETHDID(props: { did: string; }) {

    return (
        <Grid item xs={12}>
            <TextFieldWithCopy label="Decentralized ID(DID)" value={props.did} />
        </Grid>

    )
}