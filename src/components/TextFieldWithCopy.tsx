import React, { useState } from 'react';
import {
    TextField,
    InputAdornment,
    ClickAwayListener,
    Tooltip,
    IconButton
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export default function TextWithCopy(props: {
    label: string;
    value: string;
    multiline?: boolean;
    error?: boolean;
    helperText?: string;
    callback?: any;
}) {
    const copyToClipboard = () => {
        if (props.value !== '') {
            if (window.isSecureContext) {
                navigator.clipboard.writeText(props.value);
                if (props.callback) {
                    props.callback(true);
                }
            } else {
                if (props.callback) {
                    props.callback(false);
                }
            }
        }
    };

    return (
        <TextField
            id="standard-read-only-input"
            variant="outlined"
            label={props.label}
            fullWidth
            multiline={props.multiline}
            value={props.value}
            error={props.error}
            helperText={props.helperText}
            InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="delete"
                            onClick={() => {
                                copyToClipboard();
                            }}>
                            <FileCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}
