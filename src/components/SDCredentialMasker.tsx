import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fade, Grid, IconButton, List, Snackbar, TextField } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import Title from './Title';
import AddIcon from '@material-ui/icons/Add';

import { present, base64UrlDecode } from 'sd-vc-lib';
import MaskingComponent from './MaskingComponent';
//@ts-ignore
import JSONFormat from 'json-format'
import { setCredentials, setHolderPrivateKey, setInputComponentList, setMasks, setVP, _credentials, _holderPrivateKey, _inputComponentList, _masks, _vp } from '../redux/presentSlice'
import { base64UrlEncode } from 'sd-vc-lib'


export default function SDCredentialMasker() {

    const vp = useSelector(_vp)
    const inputComponentList = useSelector(_inputComponentList)
    const credentials = useSelector(_credentials)
    const masks = useSelector(_masks)
    const holderPrivateKey = useSelector(_holderPrivateKey)

    const dispatch = useDispatch()


    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false,
    });

    function handlePrivateKeyInput(privateKey: string) {
        dispatch(setHolderPrivateKey(privateKey))
    }

    async function mask() {
        const cred = credentials.map((cred: any) => {
            return JSON.parse(base64UrlDecode(cred))
        })
        try {
            const vp = present(cred, masks, holderPrivateKey)
            dispatch(setVP(base64UrlEncode(JSON.stringify(vp))))
        } catch (e) {
            dispatch(setVP(e.message))
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

    function handleClose() {
        setState({
            ...snackBarState,
            open: false,
        });
    };

    function addNewInput() {
        const i = inputComponentList.length
        const newInputComponentList = [...inputComponentList, i]
        const newMasks = [...masks, {}]
        const newCredentials = [...credentials, '']
        // masks.push({})
        // credentials.push('')
        // newInputComponentList.push(i)
        dispatch(setMasks(newMasks))
        dispatch(setCredentials(newCredentials))
        dispatch(setInputComponentList(newInputComponentList))
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>
                        Mask and present credentials
                    </Title>
                </Grid>

                <Grid item xs={12}>
                    <List>
                        {inputComponentList.map((i: number) => {
                            return <MaskingComponent index={i} />
                        })}
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <IconButton aria-label="add" onClick={addNewInput}
                        disabled={credentials[inputComponentList.length - 1] === ''}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={holderPrivateKey}
                        onChange={e => handlePrivateKeyInput(e.target.value)}
                        label="Holder's Private Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        color="primary" variant="contained"
                        onClick={mask}
                        disabled={holderPrivateKey && masks && credentials ? false : true}
                    >Mask</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        // value={JSONFormat(vp, {type:'tab'})}
                        value={JSONFormat(vp, { type: 'tab' })}
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
    )
}