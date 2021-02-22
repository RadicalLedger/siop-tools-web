import { IconButton, makeStyles, TextField } from '@material-ui/core';
import MinimizeIcon from '@material-ui/icons/Minimize';
import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, _credentials, _inputComponentList, _masks, setInputComponentList } from '../redux/presentSlice';

import Masker from './Masker';

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

export default function MaskingComponent(props: { index: number }) {

    const masks = useSelector(_masks)
    const credentials = useSelector(_credentials)
    const inputComponentList = useSelector(_inputComponentList)
    const dispatch = useDispatch()

    const classes = useStyles();

    const handeleSignedCredntialInput = (credential: string, index: number) => {
        const newCredentialArray = [...credentials]
        newCredentialArray[index] = credential
        dispatch(setCredentials(newCredentialArray))
    }

    const removeInput = (index: number) => {
        const newInputComponentList = [...inputComponentList]
        const newMaskArray = [...masks]
        const newCredentialArray = [...credentials]
        newInputComponentList.pop()
        newMaskArray.splice(index, 1)
        newCredentialArray.splice(index, 1);
        dispatch(setInputComponentList(newInputComponentList))
        dispatch(setCredentials(newCredentialArray))
    }

    return (<div>
        <div className={classes.secondaryWrapper} key={props.index}>
            <TextField
                className={classes.elements}
                value={credentials[props.index]}
                onChange={e => handeleSignedCredntialInput(e.target.value, props.index)}
                label="Signed Credentials"
                variant="outlined"
                multiline
                fullWidth
            />
            <IconButton
                className={classes.elements}
                aria-label="remove"
                onClick={() => removeInput(props.index)}
                disabled={inputComponentList.length < 2}
            >
                <MinimizeIcon />
            </IconButton>

        </div>
        <Masker index={props.index} />
    </div>)
}
