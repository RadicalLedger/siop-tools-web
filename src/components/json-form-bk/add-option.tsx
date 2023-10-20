import { IconButton, Tooltip } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import React from 'react';

export default function AddOption({ onClick }) {
    return (
        <Tooltip title="Add Item">
            <IconButton className="icon-button" onClick={onClick}>
                <AddCircleOutlineOutlinedIcon className="icon" />
            </IconButton>
        </Tooltip>
    );
}
