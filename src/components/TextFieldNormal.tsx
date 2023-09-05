import React from 'react';
import { TextField } from '@material-ui/core';

export default function TextFieldNormal(props: { label: string; value: string }) {
    return (
        <TextField
            id="standard-read-only-input"
            label={props.label}
            variant="outlined"
            fullWidth
            value={props.value}
            InputProps={{
                readOnly: true
            }}
        />
    );
}
