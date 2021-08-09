import React, { useEffect } from 'react';
import { Grid, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Snackbar, Fade } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import TextFieldWithCopy from './TextFieldWithCopy'
import Title from './Title'

import Wallet, { generateMnemonic, getSeedFromMnemonic, Types, validateMnemonic } from 'did-hd-wallet'

import { useDispatch, useSelector } from 'react-redux'
import { _address, _childChainCode, _childPrivateKey, _childPublicKey, _derivationPath, _did, _masterChainCode, _masterPrivateKey, _masterPublicKey, _mnemonic, _seed, _strength, setStrength, setAddress, setChildChainCode, setChildPrivateKey, setChildPublicKey, setDID, setDerivationPath, setMasterChainCode, setMasterPrivateKey, setMasterPublicKey, setMnemonic, setSeed, setMnemonicValidity, _validMnemonic, setTopMnemonics, _topMnemonics, _validDerPath, setDerPathValidity } from '../redux/hdDIDSlice';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';

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

const filter = createFilterOptions();

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
    const validDerPath = useSelector(_validDerPath)
    const topMnemonics = useSelector(_topMnemonics)
    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{ open: boolean, text: string }>({ open: false, text: '' });

    const dispatch = useDispatch()

    const handleNumBitSelection = (numBit: string) => {
        const val = parseInt(numBit)
        dispatch(setStrength(val));
        if (seed !== '') {
            handleGenerateSeed()
        }
    };

    useEffect(() => {
        const topMnemonicsStored = localStorage.getItem('topMnemonics')
        try {
            dispatch(setTopMnemonics(JSON.parse(topMnemonicsStored || '[]')))
        } catch (e) {
            dispatch(setTopMnemonics([]))
        }

    }, [dispatch])

    function addMnemonics(mnemonic: string) {
        let topMnemonics = localStorage.getItem('topMnemonics')
        let newTopMnemonics;
        if (topMnemonics) {
            try {
                newTopMnemonics = JSON.parse(topMnemonics)
            } catch (e) {
                newTopMnemonics = []
            }
        } else {
            newTopMnemonics = []
        }
        newTopMnemonics.push(mnemonic)
        if (newTopMnemonics.length > 10) {
            newTopMnemonics = newTopMnemonics.slice(newTopMnemonics.length - 10)
        }
        dispatch(setTopMnemonics(newTopMnemonics))
        localStorage.setItem('topMnemonics', JSON.stringify(newTopMnemonics))
    }

    function handleGenerateSeed(): void {

        const mnemonic = generateMnemonic(strength)
        addMnemonics(mnemonic)
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
            dispatch(setDerPathValidity(true))
            dispatch(setAddress(ethAddress))
            dispatch(setChildPrivateKey(privateKey || ''))
            dispatch(setChildPublicKey(publicKey))
            dispatch(setChildChainCode(chainCode))
            dispatch(setDID(did))

        } catch {
            dispatch(setDerPathValidity(false))
            dispatch(setAddress(''))
            dispatch(setChildPrivateKey(''))
            dispatch(setChildPublicKey(''))
            dispatch(setChildChainCode(''))
            dispatch(setDID(''))
        }
    }

    function handleMnemonicInput(mnemonic: string): void {
        let success: boolean = true

        if (validateMnemonic(mnemonic)) {
            addMnemonics(mnemonic)
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
        dispatch(setMnemonic(mnemonic))
        dispatch(setMnemonicValidity(success))

    }

    function handleMnemonicAutoComplete(event: any, newValue: any) {
        let mnemonic;
        if (typeof newValue === 'string') {
            mnemonic = newValue
        } else if (newValue && newValue.inputValue) {
            mnemonic = newValue.inputValue
        } else {
            mnemonic = newValue
        }

        let success: boolean = true

        if (mnemonic) {
            let seed = getSeedFromMnemonic(mnemonic)
            success = true
            createKeysAndUpdate(seed)

        } else {
            success = false
            dispatch(setSeed(''))
            dispatch(setMasterPrivateKey(''))
            dispatch(setMasterChainCode(''))
            dispatch(setMasterPublicKey(''))
        }
        dispatch(setMnemonic(mnemonic))
        dispatch(setMnemonicValidity(success))
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false,
        });
    };

    function callback(success: boolean) {
        if (success) {
            setState({
                open: true,
                text: "Copied to clipboard"
            });
        } else {
            setState({
                open: true,
                text: "Clould not copied"
            });
        }
    }

    return (
        <div>
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
                    <Autocomplete
                        value={mnemonic}
                        onChange={handleMnemonicAutoComplete}
                        filterOptions={(options: any, params: any) => {
                            const filtered = filter(options, params);

                            // Suggest the creation of a new value
                            if (params.inputValue !== '') {
                                filtered.push(
                                    params.inputValue
                                );
                            }

                            return filtered;
                        }}
                        options={topMnemonics}
                        getOptionLabel={(option: any) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option;
                        }}
                        renderOption={(option: any) => option}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Mnemonic Words"
                                variant="outlined"
                                onChange={(e: any) => handleMnemonicInput(e.target.value)}
                                fullWidth
                                multiline
                                error={!validMnemonic && mnemonic !== ''}
                                helperText={(validMnemonic || mnemonic === '') ? "" : "Invalid mnemonic"}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            {validMnemonic && <Grid container spacing={3}>

                <Grid item xs={12}>
                    <TextFieldWithCopy
                        label="Random Seed"
                        multiline={true}
                        value={seed}
                        callback={callback}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextFieldWithCopy label="Master Private Key" value={masterPrivateKey} callback={callback} />
                </Grid>

                <Grid item xs={12}>
                    <TextFieldWithCopy label="Master Public Key" value={masterPublicKey} callback={callback} />
                </Grid>

                <Grid item xs={12}>
                    <TextFieldWithCopy label="Master Chain Code" value={masterChainCode} callback={callback} />
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

            </Grid>
            }
            {validMnemonic && validDerPath &&
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <TextFieldWithCopy label="Child Private Key" value={childPrivateKey} callback={callback} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldWithCopy label="Child Public Key" value={childPublicKey} callback={callback} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldWithCopy label="Child Chain Code" value={childChainCode} callback={callback} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextFieldWithCopy label="Ethereum Address" value={address} callback={callback} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextFieldWithCopy label="Decentralized ID(DID)" value={did} callback={callback} />
                    </Grid>

                </Grid>}
            <Snackbar
                open={snackBarState.open}
                onClose={handleClose}
                TransitionComponent={Fade}
                message={snackBarState.text}
                autoHideDuration={5000}
            />
        </div>
    )
}
