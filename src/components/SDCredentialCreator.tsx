import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fade, Grid, IconButton, List, Snackbar, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

import { useDispatch, useSelector } from 'react-redux'

import Title from './Title';
import InputComponent from './InputComponent'
import { issue, base64UrlEncode } from 'sd-vc-lib'
import { _holderPublicKey, _inputComponentList, _signerPrivateKey, _signerPublicKey, setHolderPublicKey, setInputComponentList, setSignerPrivateKey, setSignerPublicKey, _keyArray, _valueArray, setVC, _vc, setKeyArray, setValueArray } from '../redux/issueSlice';
// import {publicKeyCreate} from 'secp256k1'


export default function SDCredentialCreator() {

    const holderPublicKey = useSelector(_holderPublicKey)
    const signerPrivateKey = useSelector(_signerPrivateKey)
    const signerPublicKey = useSelector(_signerPublicKey)
    const inputComponentList = useSelector(_inputComponentList)
    const keyArray = useSelector(_keyArray)
    const valueArray = useSelector(_valueArray)
    const vc = useSelector(_vc)
    const dispatch = useDispatch()

    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false,
    });

    function addNewInput() {
        const i = inputComponentList.length
        const newInputComponentList = [...inputComponentList]
        const newKeyArray = [...keyArray, '']
        const newValueArray = [...valueArray, '']
        // keyArray.push('')
        // valueArray.push('')
        dispatch(setKeyArray(newKeyArray))
        dispatch(setValueArray(newValueArray))
        newInputComponentList.push(i)
        dispatch(setInputComponentList(newInputComponentList))
    }

    function handlePublicKeyInput(publicKey: string) {
        dispatch(setHolderPublicKey(publicKey))
    }

    function handlePrivateKeyInput(privateKey: string) {
        dispatch(setSignerPrivateKey(privateKey))
        try {
            const privateKeyBuffer = Uint8Array.from(Buffer.from(privateKey, 'hex'))
            // const publicKeyBuffer = publicKeyCreate(privateKeyBuffer)
            // const publicKey = Buffer.from(publicKeyBuffer).toString('hex')
            // dispatch(setCreateSignerPubKey(publicKey))
        } catch (error) {
            // dispatch(setCreateSignerPubKey('Error!'))
        }
    }

    // async function generateRandomKeys() {
    //     try{
    //         const {privateKey} = createRandomETHDID()
    //         const privateKeyBuffer = Uint8Array.from(Buffer.from(privateKey, 'hex'))
    //         const publicKeyBuffer = publicKeyCreate(privateKeyBuffer)
    //         const publicKey = Buffer.from(publicKeyBuffer).toString('hex')
    //         dispatch(setCreateSignerPrvKey(privateKey))
    //         dispatch(setCreateSignerPubKey(publicKey))
    //     }catch{
    //         dispatch(setCreateSignerPrvKey('Error!'))
    //         dispatch(setCreateSignerPubKey('Error!'))
    //     }
    // }


    async function sign() {
        const claims = zip(keyArray, valueArray)
        try {
            const vc = issue(claims, signerPrivateKey, holderPublicKey)
            console.log(vc)
            dispatch(setVC(base64UrlEncode(JSON.stringify(vc))))
        } catch (e) {
            dispatch(setVC('Error!'))
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

    function zip(arr1: any, arr2: any, out: any = {}) {
        arr1.map((val: any, idx: any) => { out[val] = arr2[idx]; });
        return out;
    }

    return (
        <div>
            <Grid container spacing={3}>

                <Grid item xs={12}>
                    <Title>
                        Create Selectively Disclosable Credentials
                    </Title>
                </Grid>

                <Grid item xs={12}>
                    <List>
                        {inputComponentList.map((i: number) => {
                            return <InputComponent key={i} index={i} />
                        })}
                    </List>

                </Grid>

                <Grid item xs={12}>
                    <IconButton aria-label="add" onClick={addNewInput}
                        disabled={keyArray[inputComponentList.length - 1] === '' || valueArray[inputComponentList.length - 1] === ''}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={holderPublicKey}
                        onChange={e => handlePublicKeyInput(e.target.value)}
                        label="Holder's Public Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={signerPrivateKey}
                        onChange={e => handlePrivateKeyInput(e.target.value)}
                        label="Signer's Private Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        color="primary" variant="contained"
                        onClick={sign}
                        disabled={holderPublicKey && signerPrivateKey ? false : true}
                    >Sign</Button>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={vc}
                        label="Signed Verifiable Credential"
                        variant="outlined"
                        multiline
                        fullWidth
                        onClick={() => copyToClipboard(vc)}
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



            {/* <Button
                className={classes.elements}
                color="primary" variant="outlined"
                onClick={generateRandomKeys}
            >Generate Random Keys</Button> */}




            {/* <TextField
                className={classes.elements}
                value={state.signerPublicKey}
                label="Signer's Public Key"
                variant="outlined"
                multiline
                onClick={() => copyToClipboard(state.signerPublicKey)}
            /> */}

        </div>
    )
}