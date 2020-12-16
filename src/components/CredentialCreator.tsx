import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fade, IconButton, List, Snackbar, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

import InputComponent from './InputComponent'

import { useTypedSelector } from '../redux/reducers/reducer'
import { useDispatch } from 'react-redux'
import {
    setCreatorPrivateKey,
    setCreatorPublicKey,
    setCreatorVC,
    setInputComponentList
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

export default function CredentialCreator() {

    const state = useTypedSelector(state => state.credentialCreator)
    const dispatch = useDispatch()

    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false,
    });

    const handlePrivateKeyInput = (privateKey: string) => {
        dispatch(setCreatorPrivateKey(privateKey))
    }

    const addNewInput = () => {
        const i = state.inputComponentList.length
        const newInputComponentList = [...state.inputComponentList]
        state.keyArray.push('')
        state.valueArray.push('')
        newInputComponentList.push(<InputComponent key={i} index ={i}/>)
        dispatch(setInputComponentList(newInputComponentList))

    }

    async function createKeyPair() {
        const result = await crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256"
            },
            true,
            ["sign", "verify"]);

        const privateKeyJWK: any = await window.crypto.subtle.exportKey(
            "jwk",
            result.privateKey
        );

        const publicKeyJWK: any = await window.crypto.subtle.exportKey(
            "jwk",
            result.publicKey
        );
        const privateKey = jwkToPem(privateKeyJWK, { private: true })
        const publicKey = jwkToPem(publicKeyJWK)
        dispatch(setCreatorPrivateKey(privateKey))
        dispatch(setCreatorPublicKey(publicKey))
    }

    async function signCredential() {

        const credential = zip(state.keyArray, state.valueArray)
        try {
            const signedVC = jwt.sign(credential, state.privateKey, { algorithm: 'ES256' })
            dispatch(setCreatorVC(signedVC))
        } catch (e) {
            dispatch(setCreatorVC('Error. Use PEM formated ECDSA P-256 key'))
        }
    }



    function copyToClipboard(text: string) {
        if (text !== '') {
            navigator.clipboard.writeText(text);
            setState({
                open: true
            });
        }
    }


    const handleClose = () => {
        setState({
            ...snackBarState,
            open: false,
        });
    };


    function zip(arr1: any, arr2: any, out: any = {}) {
        arr1.map((val: any, idx: any) => { out[val] = arr2[idx]; });
        return out;
    }


    return (
        <div className={classes.mainWrapper}>
            <List>
                {state.inputComponentList.map((component) => {
                    return component
                })}
            </List>
            <IconButton aria-label="add" onClick={addNewInput} 
            disabled={state.keyArray[state.keyArray.length - 1] === '' || state.valueArray[state.valueArray.length - 1] === ''}
            >
                <AddIcon />
            </IconButton> 

            <TextField
                className={classes.elements}
                value={state.privateKey}
                onChange={e => handlePrivateKeyInput(e.target.value)}
                label="Private Key"
                variant="outlined"
                multiline
            />

            <Button
                className={classes.elements}
                color="primary" variant="outlined"
                onClick={createKeyPair}
            >Create Key Pair</Button>
            <Button
                className={classes.elements}
                color="primary" variant="contained"
                onClick={signCredential}
                disabled={!(state.privateKey.length)}
            >Sign</Button>
            <TextField
                className={classes.elements}
                value={state.credential}
                label="Signed Verifiable Credential"
                variant="outlined"
                multiline
                onClick={() => copyToClipboard(state.credential)}
            />
            <TextField
                className={classes.elements}
                value={state.publicKey}
                label="Public Key"
                variant="outlined"
                multiline
                onClick={() => copyToClipboard(state.publicKey)}
            />
            <Snackbar
                open={snackBarState.open}
                onClose={handleClose}
                TransitionComponent={Fade}
                message="Copied to clipboard"
                autoHideDuration={5000}
            />
        </div>
    )
}