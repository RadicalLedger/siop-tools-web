import { IconButton, makeStyles, TextField } from '@material-ui/core';
import MinimizeIcon from '@material-ui/icons/Minimize';
import React from 'react'

import { useTypedSelector } from '../redux/reducers/reducer'
import { useDispatch } from 'react-redux'
import {
    setCredentialKeyArray,
    setCredentialValueArray,
    setInputComponentList
} from '../redux/actions'

const useStyles = makeStyles({
    elements: {
        marginTop: 50,
        marginLeft: 3,
        marginRight: 3
    },
    secondaryWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch'
    }
});

export default function InputComponent(props: { index: number }) {

    const state = useTypedSelector(state => state.credentialCreator)
    const dispatch = useDispatch()

    const classes = useStyles();

    const handleKeyInput = (key: string, index: number) => {
        const newKeyArray = [...state.keyArray]
        newKeyArray[index] = key
        dispatch(setCredentialKeyArray(newKeyArray))
    }

    const handleValueInput = (value: string, index: number) => {
        console.log(value, index)
        const newValueArray = [...state.valueArray]
        newValueArray[index] = value
        dispatch(setCredentialValueArray(newValueArray))
    }

    const removeInput = (index: number) => {
        const newInputComponentList = [...state.inputComponentList]
        const newKeyArray = [...state.keyArray]
        const newValueArray = [...state.valueArray]
        newInputComponentList.pop()
        newKeyArray.splice(index, 1)
        newValueArray.splice(index, 1);
        dispatch(setInputComponentList(newInputComponentList))
        dispatch(setCredentialKeyArray(newKeyArray))
        dispatch(setCredentialValueArray(newValueArray))
    }

    return (<div className={classes.secondaryWrapper} key={props.index}>
        <TextField
            key={`key ${props.index}`}
            className={classes.elements}
            //@ts-ignore
            value={state.keyArray[props.index]}
            onChange={e => handleKeyInput(e.target.value, props.index)}
            placeholder="Key"
            variant="outlined"
        />
        <TextField
            key={`value ${props.index}`}
            className={classes.elements}
            //@ts-ignore
            value={state.valueArray[props.index]}
            onChange={e => handleValueInput(e.target.value, props.index)}
            placeholder="Value"
            variant="outlined"
            fullWidth
        />
        <IconButton
            className={classes.elements}
            aria-label="remove"
            onClick={() => removeInput(props.index)}
            disabled={state.inputComponentList.length < 2}
        >
            <MinimizeIcon />
        </IconButton>

    </div>)
}
