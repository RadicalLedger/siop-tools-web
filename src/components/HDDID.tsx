import React from 'react';
import { Grid, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import TextFieldWithCopy from './TextFieldWithCopy'
import TextFieldNormal from './TextFieldNormal'
import Title from './Title'

import Wallet, { generateMnemonic, getSeedFromMnemonic, Types, validateMnemonic } from 'did-hd-wallet'

import { useDispatch, useSelector } from 'react-redux'
import { _address, _childChainCode, _childPrivateKey, _childPublicKey, _derivationPath, _did, _masterChainCode, _masterPrivateKey, _masterPublicKey, _mnemonic, _seed, _strength, setStrength, setAddress, setChildChainCode, setChildPrivateKey, setChildPublicKey, setDID, setDerivationPath, setMasterChainCode, setMasterPrivateKey, setMasterPublicKey, setMnemonic, setSeed, setMnemonicValidity, _validMnemonic } from '../redux/hdDIDSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        btn: {
            marginBottom: 10
        }
    }),
);

/**
 * HD wallet component
 * @return {React.ReactElement}
 */
export default function HDDID() {

    const strength = useSelector(_strength)
    const seed = useSelector(_seed)
    const mnemonic = useSelector(_mnemonic)
    const masterPrivateKey = useSelector(_masterPrivateKey)
    const masterChainCode = useSelector(_masterChainCode)
    const masterPublicKey = useSelector(_masterPublicKey)
    const derivationPath = useSelector(_derivationPath)
    const childPrivateKey = useSelector(_childPrivateKey)
    const childChainCode = useSelector(_childChainCode)
    const childPublicKey = useSelector(_childPublicKey)
    const did = useSelector(_did)
    const address = useSelector(_address)
    const validMnemonic = useSelector(_validMnemonic)
    const classes = useStyles();

    const dispatch = useDispatch()

    const handleNumBitSelection = (numBit: string) => {
        const val = parseInt(numBit)
        dispatch(setStrength(val));
        if (seed !== '') {
            handleGenerateSeed()
        }
    };

    function handleGenerateSeed(): void {

        const mnemonic = generateMnemonic(strength)
        const seed = getSeedFromMnemonic(mnemonic)

        dispatch(setMnemonic(mnemonic))
        createKeysAndUpdate(seed)
        dispatch(setMnemonicValidity(true))
    }

    function createKeysAndUpdate(seed: string): void {

        dispatch(setSeed(seed))
        try {
            const wallet = new Wallet(Types.SEED, seed)
            const masterPrivateKey = wallet.getMasterPrivateKey()
            const masterChainCode = wallet.getMasterChainCode()
            const masterPublicKey = wallet.getMasterPublicKey()

            dispatch(setMasterPrivateKey(masterPrivateKey || ''))
            dispatch(setMasterChainCode(masterChainCode))
            dispatch(setMasterPublicKey(masterPublicKey))
        } catch (error) {
            //
        }

    }

    function handleDerivationPathInput(derPath: string): void {

        dispatch(setDerivationPath(derPath))

        try {
            const wallet = new Wallet(Types.SEED, seed)
            const { privateKey, publicKey, chainCode, ethAddress, did } = wallet.getChildKeys(derPath)

            dispatch(setAddress(ethAddress))
            dispatch(setChildPrivateKey(privateKey || ''))
            dispatch(setChildPublicKey(publicKey))
            dispatch(setChildChainCode(chainCode))
            dispatch(setDID(did))

        } catch {
            dispatch(setAddress(''))
            dispatch(setChildPrivateKey(''))
            dispatch(setChildPublicKey(''))
            dispatch(setChildChainCode(''))
            dispatch(setDID(''))
        }
    }

    function handleMnemonicInput(mnemonic: string): void {
        let success: boolean = true
        dispatch(setMnemonic(mnemonic))
        if (validateMnemonic(mnemonic)) {
            let seed: string = ''
            try {
                seed = getSeedFromMnemonic(mnemonic)
                success = true
                createKeysAndUpdate(seed)
            } catch {
                success = false
                dispatch(setSeed(''))
                dispatch(setMasterPrivateKey(''))
                dispatch(setMasterChainCode(''))
                dispatch(setMasterPublicKey(''))
            }

        } else {
            success = false
            dispatch(setSeed(''))
            dispatch(setMasterPrivateKey(''))
            dispatch(setMasterChainCode(''))
            dispatch(setMasterPublicKey(''))
        }
        dispatch(setMnemonicValidity(success))

    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    {'Generate HD DIDs'}
                </Title>
            </Grid>

            <Grid item xs={12}>
                <div className={classes.root}>
                    <Alert severity="info">Enter mnemonic words or create new random seed</Alert>
                </div>
            </Grid>

            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="numBits"
                        name="numbits"
                        value={strength.toString()}
                        onChange={e => handleNumBitSelection(e.target.value)}>
                        <FormControlLabel value="128" control={<Radio />} label="128 bit" />
                        <FormControlLabel value="256" control={<Radio />} label="256 bit" />
                    </RadioGroup>
                </FormControl>
            </Grid>


            <Grid item xs={12}>
                <Button className={classes.btn} onClick={handleGenerateSeed} variant="contained" color="primary">
                    Generate New Random Seed
                </Button>
                <div className={classes.root}>
                    <Alert severity="warning">
                        Write down these words and kept in a secure place.
                        This is the only way to recover your credentials in case you lost them.
                </Alert>
                </div>
            </Grid>



            <Grid item xs={12}>
                <TextField
                    id="standard-read-only-input"
                    label="Mnemonic Words"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={mnemonic}
                    onChange={(e: any) => handleMnemonicInput(e.target.value)}
                error={!validMnemonic}
                helperText={validMnemonic ? "" : "Invalid mnemonic"}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="standard-read-only-input"
                    label="Random Seed"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={seed}
                />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Private Key" value={masterPrivateKey} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Public Key" value={masterPublicKey} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Chain Code" value={masterChainCode} />
            </Grid>

            <Divider />

            <Grid item xs={12}>
                <TextField
                    id="standard-basic"
                    label="Enter Derivation Path"
                    variant="outlined"
                    fullWidth
                    inputProps={{ 'aria-label': 'description' }}
                    placeholder="m/0/0'"
                    value={derivationPath}
                    disabled={seed === ""}
                    onChange={(e: any) => handleDerivationPathInput(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <TextFieldWithCopy label="Child Private Key" value={childPrivateKey} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Child Public Key" value={childPublicKey} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Child Chain Code" value={childChainCode} />
            </Grid>
            <Grid item xs={12}>
                <TextFieldNormal label="Ethereum Address" value={address} />
            </Grid>
            <Grid item xs={12}>
                <TextFieldWithCopy label="Decentralized ID(DID)" value={did} />
            </Grid>
        </Grid>
    )
}