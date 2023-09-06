import React from 'react';
import { Button, Fade, Grid, Snackbar, TextField } from '@material-ui/core';
//@ts-ignore
import JSONFormat from 'json-format';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import {
    setHolderPublicKey,
    setPresentation,
    _holderPublicKey,
    _presentation,
    _signerPublicKey,
    setSignerPublicKey,
    setVerified,
    _verified
} from '../redux/verifySlice';

import Title from './Title';
import { verifiable } from 'sd-vc-lib';
import documentLoader from '../utils/document-loader';

export default function SDCredentialVerifier() {
    const presentation = useSelector(_presentation);
    const signerPublicKey = useSelector(_signerPublicKey);
    const holderPublicKey = useSelector(_holderPublicKey);
    const verified = useSelector(_verified);

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

    async function verifyPresentation() {
        try {
            const vp = JSON.parse(atob(presentation));

            const result = await verifiable.presentation.verify({
                vp,
                holderPublicKey,
                issuerPublicKey: signerPublicKey,
                documentLoader
            });

            if (!result?.verified) throw new Error();

            dispatch(setVerified('Presentation Verified'));
            // dispatch(setPresentation(vp))
        } catch (e) {
            console.log(e);
            dispatch(setVerified('Invalid inputs'));
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
