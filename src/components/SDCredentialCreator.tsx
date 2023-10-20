import React from 'react';
import {
    Button,
    Fade,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
    Theme,
    createStyles,
    makeStyles
} from '@material-ui/core';

import Title from './Title';
import InputComponent from './InputComponent';
import { verifiable } from 'sd-vc-lib';
import documentLoader from '../utils/document-loader';
import { Alert } from '@material-ui/lab';
import base58 from 'base-58';

import { useDispatch, useSelector } from 'react-redux';
import {
    setHolderPublicKey,
    setInputComponentList,
    setSignerPrivateKey,
    setSignerPublicKey,
    setPublicKeyEncoding,
    setVC,
    setKeyArray,
    setValueArray,
    _holderPublicKey,
    _inputComponentList,
    _signerPrivateKey,
    _signerPublicKey,
    _keyArray,
    _valueArray,
    _vc,
    _publicKeyEncoding
} from '../redux/issueSlice';
import JsonForm from './json-form';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2)
            }
        },
        btn: {
            marginRight: 10
        }
    })
);

export default function SDCredentialCreator() {
    const holderPublicKey = useSelector(_holderPublicKey);
    const signerPrivateKey = useSelector(_signerPrivateKey);
    const publicKeyEncoding = useSelector(_publicKeyEncoding);
    const signerPublicKey = useSelector(_signerPublicKey);
    const inputComponentList = useSelector(_inputComponentList);
    const keyArray = useSelector(_keyArray);
    const valueArray = useSelector(_valueArray);
    const vc = useSelector(_vc);
    const dispatch = useDispatch();
    const classes = useStyles();

    const customAttributeRef = React.useRef<{ value?: string }>({});

    const [snackBarState, setState] = React.useState<{ open: boolean; text: string }>({
        open: false,
        text: ''
    });

    function addNewInput() {
        const i = inputComponentList.length;
        const newInputComponentList = [...inputComponentList];
        const newKeyArray = [...keyArray, ''];
        const newValueArray = [...valueArray, ''];
        // keyArray.push('')
        // valueArray.push('')
        dispatch(setKeyArray(newKeyArray));
        dispatch(setValueArray(newValueArray));
        newInputComponentList.push(i);
        dispatch(setInputComponentList(newInputComponentList));
    }

    function replacer(key, value) {
        if (typeof value === 'string') {
            return value.replace(/"/g, '').replace(/,/g, ', ').replace(/:/g, ':');
        } else {
            return value;
        }
    }

    function addNewCustomAttribute() {
        let i: number | null = null;
        const newKeyArray = [...keyArray];
        const newValueArray = [...valueArray];

        let idx = newKeyArray.findIndex((_) => _ === 'credentialSubject');
        if (idx < 0) {
            i = inputComponentList.length;
            idx = i;
            const newInputComponentList = [...inputComponentList];
            newInputComponentList.push(i);

            newKeyArray.push('credentialSubject');
            newValueArray.push(`{}`);
        }

        let data = isJson(newValueArray[idx]) ? eval(`(${newValueArray[idx]})`) : {};
        let value = customAttributeRef.current.value;

        if (!data.customAttribute) {
            data['customAttribute'] = [];
        }

        if (isJson(value)) {
            value = eval(`(${value})`);
        }

        data.customAttribute.push(value);

        newValueArray[idx] = JSON.stringify(data, replacer);

        dispatch(setValueArray(newValueArray));
    }

    function handlePublicKeyInput(publicKey: string) {
        dispatch(setHolderPublicKey(publicKey));
    }

    function handlePrivateKeyInput(privateKey: string) {
        dispatch(setSignerPrivateKey(privateKey));
    }

    function handlePublicKeyEncoding(encoding: string) {
        dispatch(setPublicKeyEncoding(encoding));
    }

    async function sign() {
        const credential = zip(keyArray, valueArray);
        let publicKey = holderPublicKey;

        /* base58 to base64 */
        if (publicKeyEncoding === 'Base58')
            publicKey = Buffer.from(base58.decode(holderPublicKey)).toString('hex');

        try {
            const vc = await verifiable.credential.create({
                credential,
                holderPublicKey: publicKey,
                issuerPrivateKey: signerPrivateKey,
                issuanceDate: credential?.issuanceDate || new Date().toISOString(),
                documentLoader
            });

            dispatch(setVC(btoa(JSON.stringify(vc))));
        } catch (e) {
            console.log(e);
            dispatch(setVC('Error!'));
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

    function handleClose() {
        setState({
            ...snackBarState,
            open: false
        });
    }

    function zip(arr1: any, arr2: any, out: any = {}) {
        arr1.map((val: any, idx: any) => {
            let value = arr2[idx];

            if (isJson(value)) {
                value = eval(`(${value})`);
            }

            out[val] = value;
        });

        return out;
    }

    function isJson(str) {
        try {
            eval(`(${str})`);
        } catch (error) {
            return false;
        }

        return true;
    }

    const onJsonFormValues = (values) => {};

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>Create Selectively Disclosable Credentials</Title>
                </Grid>

                <Grid item xs={12}>
                    <JsonForm onSubmit={onJsonFormValues} />
                    {/* <List>
                        {inputComponentList.map((i: number) => {
                            return <InputComponent key={`sd-credential-input-${i}`} index={i} />;
                        })}
                    </List> */}
                </Grid>

                {/* <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="add"
                        onClick={addNewInput}
                        disabled={
                            keyArray[inputComponentList.length - 1] === '' ||
                            valueArray[inputComponentList.length - 1] === ''
                        }
                        //TODO Add tooltip saying why this is disabled
                    >
                        Add more claims
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <List>
                        <TextField
                            inputRef={customAttributeRef}
                            placeholder="Custom Attribute Value"
                            variant="outlined"
                            fullWidth
                        />
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="add"
                        onClick={addNewCustomAttribute}>
                        Add Custom Attribute
                    </Button>
                </Grid> */}

                <Grid item xs={12}>
                    <div className={classes.root}>
                        <Alert severity="info">Select the public key encoding scheme</Alert>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            aria-label="encoding-scheme"
                            name="encoding-scheme"
                            value={publicKeyEncoding.toString()}
                            onChange={(e) => handlePublicKeyEncoding(e.target.value)}>
                            <FormControlLabel
                                value="Base58"
                                control={<Radio />}
                                label="Base58 String"
                            />
                            <FormControlLabel
                                value="Base64"
                                control={<Radio />}
                                label="Base64 String"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={holderPublicKey}
                        onChange={(e: any) => handlePublicKeyInput(e.target.value)}
                        label="Holder's Public Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={signerPrivateKey}
                        onChange={(e: any) => handlePrivateKeyInput(e.target.value)}
                        label="Signer's Private Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={sign}
                        disabled={holderPublicKey && signerPrivateKey ? false : true}>
                        Sign
                    </Button>
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
                message={snackBarState.text}
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
    );
}
