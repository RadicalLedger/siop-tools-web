import React from 'react';
import { Button, Fade, Grid, IconButton, List, Snackbar, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Title from './Title';
import { verifiable } from 'sd-vc-lib';
import MaskingComponent from './MaskingComponent';
import {
    setCredentials,
    setHolderPrivateKey,
    setInputComponentList,
    setMasks,
    setVP,
    _credentials,
    _holderPrivateKey,
    _inputComponentList,
    _masks,
    _vp
} from '../redux/presentSlice';
import documentLoader from '../utils/document-loader';

export default function SDCredentialMasker() {
    const vp = useSelector(_vp);
    const inputComponentList = useSelector(_inputComponentList);
    const credentials = useSelector(_credentials);
    const masks = useSelector(_masks);
    const holderPrivateKey = useSelector(_holderPrivateKey);

    const dispatch = useDispatch();

    const [snackBarState, setState] = React.useState<{ open: boolean; text: string }>({
        open: false,
        text: ''
    });

    function handlePrivateKeyInput(privateKey: string) {
        dispatch(setHolderPrivateKey(privateKey));
    }

    async function mask() {
        const cred = credentials.map((cred: any) => {
            return JSON.parse(atob(cred));
        });
        console.log(cred);
        try {
            const vp = await verifiable.presentation.create({
                documentLoader: documentLoader,
                masks: masks,
                holderPrivateKey,
                verifiableCredential: cred
            });
            dispatch(setVP(btoa(JSON.stringify(vp))));
        } catch (e: any) {
            dispatch(setVP(e.message));
        }
    }

    function copyToClipboard(text: string) {
        if (text !== '') {
            if (window.isSecureContext) {
                navigator.clipboard.writeText(text);
                setState({
                    open: true,
                    text: 'Copied to clipboard'
                });
            } else {
                setState({
                    open: true,
                    text: 'Clould not copied'
                });
            }
        }
    }

    function callback(success: boolean) {
        if (success) {
            setState({
                open: true,
                text: 'Copied to clipboard'
            });
        } else {
            setState({
                open: true,
                text: 'Clould not copied'
            });
        }
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false
        });
    }

    function addNewInput() {
        const i = inputComponentList.length;
        const newInputComponentList = [...inputComponentList, i];
        const newMasks = [...masks, {}];
        const newCredentials = [...credentials, ''];
        // masks.push({})
        // credentials.push('')
        // newInputComponentList.push(i)
        dispatch(setMasks(newMasks));
        dispatch(setCredentials(newCredentials));
        dispatch(setInputComponentList(newInputComponentList));
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>Mask and present credentials</Title>
                </Grid>

                <Grid item xs={12}>
                    <List>
                        {inputComponentList.map((i: number) => {
                            return <MaskingComponent index={i} />;
                        })}
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="add"
                        onClick={addNewInput}
                        disabled={credentials[inputComponentList.length - 1] === ''}
                        //TODO Add tooltip saying why this is disabled
                    >
                        Add more credentials
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={holderPrivateKey}
                        onChange={(e: any) => handlePrivateKeyInput(e.target.value)}
                        label="Holder's Private Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={mask}
                        disabled={holderPrivateKey && masks && credentials ? false : true}>
                        Mask & Present
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        // value={JSONFormat(vp, {type:'tab'})}
                        value={vp}
                        label="Presentation"
                        variant="outlined"
                        multiline
                        fullWidth
                        onClick={() => copyToClipboard(vp)}
                    />
                </Grid>
            </Grid>

            <Snackbar
                open={snackBarState.open}
                onClose={handleClose}
                TransitionComponent={Fade}
                message="Copied to clipboard"
                autoHideDuration={5000}
            />
        </div>
    );
}
