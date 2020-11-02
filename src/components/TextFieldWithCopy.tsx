import React, {useState} from 'react';
import { TextField, InputAdornment, ClickAwayListener, Tooltip, IconButton } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export default function TextWithCopy(props:{label: string, value: string}) {

    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.value);
      }

    return (
        <TextField
            id="standard-read-only-input"
            variant="outlined"
            label={props.label}
            fullWidth
            value={props.value}
            InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">

                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <div>
                            <Tooltip
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title="Copied"
                            >
                                <IconButton aria-label="delete" onClick={() => { copyToClipboard(); handleTooltipOpen(); }}>
                                    <FileCopyOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                </InputAdornment>
            }}

        />
    )
}