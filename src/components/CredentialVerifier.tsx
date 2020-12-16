import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Snackbar, TextField } from '@material-ui/core'
import jwt from 'jsonwebtoken'

import { Alert } from '@material-ui/lab';
import ReactJson from 'react-json-view';

import { useTypedSelector } from '../redux/reducers/reducer'
import { useDispatch } from 'react-redux'
import {
    setVerifierCredentials,
    setVerifierPublicKey,
    setVerifierVC
} from '../redux/actions'

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    elements: {
        marginTop: 50,
        marginLeft: 3,
        marginRight: 3
    },
    mainWrapper: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '4%',
        paddingRight: '3%',
        paddingBottom: 0,
        paddingLeft: '3%'
    }
});

export default function CredentialVerifier() {

    const state = useTypedSelector(state => state.credentialVerifier)
    const dispatch = useDispatch()

    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{
        successOpen: boolean;
        errorOpen: boolean;
    }>({
        successOpen: false,
        errorOpen: false
    });

    const [error, setError] = useState(false)

    const handlePublicKeyInput = (publicKey: string) => {
        dispatch(setVerifierPublicKey(publicKey))
    }

    const handleSignedVC = (signedVC: string) => {
        dispatch(setVerifierVC(signedVC))
    }

    async function verifyCredential() {
        jwt.verify(state.vc, state.publicKey, { algorithms: ['ES256'] }, (error, decoded: any) => {
            if (error) {
                setError(true)
                dispatch(setVerifierCredentials(`{"error": "${error.message}"}`))
                setState({
                    successOpen: false,
                    errorOpen: true
                })
            } else {
                dispatch(setVerifierCredentials(JSON.stringify(decoded)))
                setState({
                    successOpen: true,
                    errorOpen: false
                })
            }
        })

    }

    const handleClose = () => {
        setState({
            ...snackBarState,
            successOpen: false,
            errorOpen: false
        });
    };

    return (
        <div className={classes.mainWrapper} >
            <TextField
                error={error}
                className={classes.elements}
                value={state.vc}
                onChange={e => handleSignedVC(e.target.value)}
                placeholder="Place credential here"
                variant="outlined"
                multiline
            />

            <TextField
                error={error}
                className={classes.elements}
                value={state.publicKey}
                onChange={e => handlePublicKeyInput(e.target.value)}
                label="Public Key"
                variant="outlined"
                multiline
            />
            <Button className={classes.elements} color="primary" variant="contained" onClick={verifyCredential}>Verify</Button>

            <div className={classes.elements}>
                <ReactJson
                    name={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    src={JSON.parse(state.credential)}
                    theme="monokai" />
            </div>


            <Snackbar open={snackBarState.successOpen} autoHideDuration={3000} onClose={handleClose} key="success">
                <Alert onClose={handleClose} severity="success">
                    Verified
                </Alert>
            </Snackbar>
            <Snackbar open={snackBarState.errorOpen} autoHideDuration={3000} onClose={handleClose} key="error">
                <Alert onClose={handleClose} severity="error">
                    Not Valid
                </Alert>
            </Snackbar>
        </div>
    )
}