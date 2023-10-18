import { IconButton } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import React from 'react';

export default function OptionsItem({ onAdd, onRemove }) {
    return (
        <div className="options-items">
            <IconButton onClick={onAdd}>
                <AddCircleOutlineOutlinedIcon className="icon" />
            </IconButton>
            <IconButton onClick={onRemove}>
                <RemoveCircleOutlineOutlinedIcon className="icon" />
            </IconButton>
        </div>
    );
}
