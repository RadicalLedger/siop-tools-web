import { IconButton, makeStyles, TextField } from '@material-ui/core';
import MinimizeIcon from '@material-ui/icons/Minimize';
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
    setKeyArray,
    setValueArray,
    setInputComponentList,
    _inputComponentList,
    _keyArray,
    _valueArray
} from '../redux/issueSlice';

const useStyles = makeStyles({
    elements: {
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 5
    },
    secondaryWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch'
    }
});

export default function InputComponent(props: { index: number }) {
    const keyArray = useSelector(_keyArray);
    const valueArray = useSelector(_valueArray);
    const inputComponentList = useSelector(_inputComponentList);
    const dispatch = useDispatch();

    const classes = useStyles();

    const handleKeyInput = (key: string, index: number) => {
        const newKeyArray = [...keyArray];
        newKeyArray[index] = key;
        dispatch(setKeyArray(newKeyArray));
    };

    const handleValueInput = (value: string, index: number) => {
        const newValueArray = [...valueArray];
        newValueArray[index] = value;
        dispatch(setValueArray(newValueArray));
    };

    const removeInput = (index: number) => {
        const newInputComponentList = [...inputComponentList];
        const newKeyArray = [...keyArray];
        const newValueArray = [...valueArray];
        newInputComponentList.pop();
        newKeyArray.splice(index, 1);
        newValueArray.splice(index, 1);
        dispatch(setInputComponentList(newInputComponentList));
        dispatch(setKeyArray(newKeyArray));
        dispatch(setValueArray(newValueArray));
    };

    return (
        <div className={classes.secondaryWrapper} key={props.index}>
            <TextField
                key={`key ${props.index}`}
                className={classes.elements}
                //@ts-ignore
                value={keyArray[props.index]}
                onChange={(e) => handleKeyInput(e.target.value, props.index)}
                placeholder="Key"
                variant="outlined"
            />
            <TextField
                key={`value ${props.index}`}
                className={classes.elements}
                //@ts-ignore
                value={valueArray[props.index]}
                onChange={(e) => handleValueInput(e.target.value, props.index)}
                placeholder="Value"
                variant="outlined"
                fullWidth
            />
            <IconButton
                className={classes.elements}
                aria-label="remove"
                onClick={() => removeInput(props.index)}
                disabled={inputComponentList.length < 2}>
                <MinimizeIcon />
            </IconButton>
        </div>
    );
}
