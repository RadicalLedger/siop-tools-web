import { IconButton, Tooltip } from '@material-ui/core';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import React from 'react';

export default function RemoveOption({ onClick }) {
    return (
        <Tooltip title="Remove Item">
            <IconButton onClick={onClick}>
                <RemoveCircleOutlineOutlinedIcon className="icon remove" />
            </IconButton>
        </Tooltip>
    );
}
