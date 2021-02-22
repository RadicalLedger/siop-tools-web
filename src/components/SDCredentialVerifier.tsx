import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fade, Snackbar, TextField } from '@material-ui/core'
//@ts-ignore
import JSONFormat from 'json-format'

import { useDispatch, useSelector } from 'react-redux'
import {setHolderPublicKey, setPresentation, _holderPublicKey, _presentation, _signerPublicKey , setSignerPublicKey, setVerified, _verified} from '../redux/verifySlice'

import Title from './Title';
import { verify, base64UrlDecode } from 'sd-vc-lib';

const useStyles = makeStyles({
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

export default function SDCredentialVerifier() {

    const presentation = useSelector(_presentation)
    const signerPublicKey = useSelector(_signerPublicKey)
    const holderPublicKey = useSelector(_holderPublicKey)
    const verified = useSelector(_verified)

    const dispatch = useDispatch()

    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false,
    });

    function handleHolderPublicKeyInput(publicKey: string){
        dispatch(setHolderPublicKey(publicKey))
    }

    function handleSignererPublicKeyInput(pubKey: string){
        dispatch(setSignerPublicKey(pubKey))
    }

    function handlePresentationInput(presentation: string){
        dispatch(setVerified(''));
        dispatch(setPresentation(presentation))
    }

    async function verifyPresentation(){
        try{
            
            const vp = JSON.parse(base64UrlDecode(presentation))
            await verify(vp, [signerPublicKey], holderPublicKey)
            dispatch(setVerified('Presentation Verified'));
            // dispatch(setPresentation(vp))
        }catch(e) {
            console.log(e)
            dispatch(setVerified('Invalid inputs'));
            // dispatch(setPresentation(''))
        } 
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false,
        });
    };

    return (
        <div className={classes.mainWrapper}>
            <Title>
                Verify Presentation
            </Title>

            <TextField
                className={classes.elements}
                value={presentation}
                onChange={e => handlePresentationInput(e.target.value)}
                label="Verifiable presentation"
                variant="outlined"
                multiline
            />
            <TextField
                className={classes.elements}
                value={holderPublicKey}
                onChange={e => handleHolderPublicKeyInput(e.target.value)}
                label="Holder's Public Key"
                variant="outlined"
                multiline
            />
            <TextField
                className={classes.elements}
                value={signerPublicKey}
                onChange={e => handleSignererPublicKeyInput(e.target.value)}
                label="Signer's Public Key"
                variant="outlined"
                multiline
            />
            <Button
                className={classes.elements}
                color="primary" variant="contained"
                onClick={verifyPresentation}
                disabled={holderPublicKey && presentation && signerPublicKey ? false : true}
            >Verify</Button>
            <TextField
                className={classes.elements}
                value={verified}
                label="Verified?"
                variant="outlined"
            />
            <TextField
                className={classes.elements}
                value={verified === 'Presentation Verified' ? JSONFormat(JSON.parse(base64UrlDecode(presentation)), {type:'tab'}): ''}
                label="Decoded Presentation"
                multiline
                variant="outlined"
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