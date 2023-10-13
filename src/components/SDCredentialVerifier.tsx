import React from 'react';
import {
    Button,
    Fade,
    Grid,
    Snackbar,
    TextField,
    Theme,
    makeStyles,
    createStyles,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
//@ts-ignore
import JSONFormat from 'json-format';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import {
    setHolderPublicKey,
    setPresentation,
    setPublicKeyEncoding,
    setSignerPublicKey,
    setSignerPublicKeyEncoding,
    setVerified,
    _holderPublicKey,
    _presentation,
    _signerPublicKey,
    _verified,
    _publicKeyEncoding,
    _signerPublicKeyEncoding
} from '../redux/verifySlice';

import Title from './Title';
import { verifiable } from 'sd-vc-lib';
import documentLoader from '../utils/document-loader';
import { Alert } from '@material-ui/lab';
import base58 from 'base-58';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2)
            }
        },
        btn: {
            marginBottom: 10
        }
    })
);

export default function SDCredentialVerifier() {
    const presentation = useSelector(_presentation);
    const signerPublicKey = useSelector(_signerPublicKey);
    const holderPublicKey = useSelector(_holderPublicKey);
    const verified = useSelector(_verified);
    const publicKeyEncoding = useSelector(_publicKeyEncoding);
    const signerPublicKeyEncoding = useSelector(_signerPublicKeyEncoding);
    const classes = useStyles();

    const dispatch = useDispatch();

    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false
    });

    function handleHolderPublicKeyInput(publicKey: string) {
        dispatch(setHolderPublicKey(publicKey));
    }

    function handleSignererPublicKeyInput(pubKey: string) {
        dispatch(setSignerPublicKey(pubKey));
    }

    function handlePresentationInput(presentation: string) {
        dispatch(setVerified(''));
        dispatch(setPresentation(presentation));
    }

    function handlePublicKeyEncoding(encoding: string) {
        dispatch(setPublicKeyEncoding(encoding));
    }

    function handleSignerPublicKeyEncoding(encoding: string) {
        dispatch(setSignerPublicKeyEncoding(encoding));
    }

    async function verifyPresentation() {
        try {
            const vp = JSON.parse(atob(presentation));
            let publicKey = holderPublicKey;
            let issuerPublicKey = signerPublicKey;

            /* base58 to base64 */
            if (publicKeyEncoding === 'Base58')
                publicKey = Buffer.from(base58.decode(holderPublicKey)).toString('hex');
            if (signerPublicKeyEncoding === 'Base58')
                issuerPublicKey = Buffer.from(base58.decode(signerPublicKey)).toString('hex');

            const result = await verifiable.presentation.verify({
                vp,
                holderPublicKey: publicKey,
                issuerPublicKey,
                documentLoader
            });

            if (!result?.verified) throw new Error();

            dispatch(setVerified('Presentation Verified'));
            // dispatch(setPresentation(vp))
        } catch (e: any) {
            console.log(e);
            dispatch(setVerified(e?.message || 'Invalid inputs'));
            // dispatch(setPresentation(''))
        }
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false
        });
    }

    function checkCredential(mask = {}, credentials = {}) {
        if (_.isArray(credentials)) {
            let claims: any = [];

            for (let key = 0; key < credentials.length; key++) {
                if (_.isObject(mask?.[key]) && _.isObject(credentials?.[key])) {
                    claims.push(checkCredential(mask[key], credentials[key]));
                    continue;
                }

                if (!mask?.[key]) {
                    claims.push(credentials[key]);
                    continue;
                }
            }

            return claims;
        }
        if (_.isObject(credentials)) {
            let claims: any = {};

            for (let key in credentials) {
                if (_.isObject(mask?.[key]) && _.isObject(credentials?.[key])) {
                    claims[key] = checkCredential(mask[key], credentials[key]);
                    continue;
                }

                if (!mask?.[key]) {
                    claims[key] = credentials[key];
                    continue;
                }
            }

            return claims;
        }
    }

    function getDisclosedCredentials(presentation: any) {
        const disclosedCredentials: any = [];

        for (const credential of presentation['verifiableCredential']) {
            const mask =
                credential['credentialSubject']?.['selectiveDisclosureMetaData']?.['mask'] || {};
            const credentials = credential['credentialSubject'] || {};
            const claims: any = checkCredential(mask, credentials);

            disclosedCredentials.push(claims);
        }

        return disclosedCredentials;
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Title>Verify Presentation</Title>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        value={presentation}
                        onChange={(e) => handlePresentationInput(e.target.value)}
                        label="Verifiable presentation"
                        variant="outlined"
                        multiline
                        fullWidth
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
                        onChange={(e: any) => handleHolderPublicKeyInput(e.target.value)}
                        label="Holder's Public Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            aria-label="signer-encoding-scheme"
                            name="signer-encoding-scheme"
                            value={signerPublicKeyEncoding.toString()}
                            onChange={(e) => handleSignerPublicKeyEncoding(e.target.value)}>
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
                        value={signerPublicKey}
                        onChange={(e: any) => handleSignererPublicKeyInput(e.target.value)}
                        label="Signer's Public Key"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={verifyPresentation}
                        disabled={
                            holderPublicKey && presentation && signerPublicKey ? false : true
                        }>
                        Verify
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField value={verified} label="Verified?" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={
                            verified === 'Presentation Verified'
                                ? JSONFormat(JSON.parse(atob(presentation)), {
                                      type: 'tab'
                                  })
                                : ''
                        }
                        label="Decoded Presentation"
                        multiline
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={
                            verified === 'Presentation Verified'
                                ? JSONFormat(
                                      getDisclosedCredentials(JSON.parse(atob(presentation)))
                                  )
                                : ''
                        }
                        label="Disclosed credentials"
                        multiline
                        fullWidth
                        variant="outlined"
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
