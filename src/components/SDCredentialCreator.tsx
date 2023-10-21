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
    setSignerPrivateKey,
    setSignerPublicKey,
    setPublicKeyEncoding,
    setVC,
    _holderPublicKey,
    _signerPrivateKey,
    _signerPublicKey,
    _vc,
    _publicKeyEncoding,
    _jsonValue,
    setJsonValue,
    _jsonEditorValue,
    setJsonEditorValue
} from '../redux/issueSlice';
import JsonForm from './json-form';
import _ from 'lodash';

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
    const jsonValue = useSelector(_jsonValue);
    const jsonEditorValue = useSelector(_jsonEditorValue);
    const vc = useSelector(_vc);
    const dispatch = useDispatch();
    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{ open: boolean; text: string }>({
        open: false,
        text: ''
    });

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
        const credential: any = _.cloneDeep(jsonValue);
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

    const onJsonFormValues = (values, data) => {
        dispatch(setJsonValue(values?.data));
        dispatch(setJsonEditorValue(data));
    };

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>Create Selectively Disclosable Credentials</Title>
                </Grid>

                <Grid item xs={12}>
                    <JsonForm
                        initialValues={jsonEditorValue}
                        jsonValue={jsonValue}
                        onSubmit={onJsonFormValues}
                    />
                </Grid>

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
        </div>
    );
}
