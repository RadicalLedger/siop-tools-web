import React from 'react';
import { Grid, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import * as bip39 from 'bip39';
import csprng from 'csprng';
import * as bip32 from 'bip32';
import * as bs58check from 'bs58check';
import { BIP32Interface } from 'bip32';
import publicKeyToAddress from 'ethereum-public-key-to-address';
import * as crypto from "crypto"
import RIPEMD160 from 'ripemd160'
import EthrDID from 'ethr-did'

import BTCAddress from './BTCAddress';
import ETHAddress from './ETHAddress';
import ETHDID from './ETHDID';
import TextFieldWithCopy from './TextFieldWithCopy'
import TextFieldNormal from './TextFieldNormal'
import Title from './Title'

import { useTypedSelector } from '../redux/reducers/reducer'
import { useDispatch } from 'react-redux'
import {
    setRandomSeed,
    setMnemonic,
    setNumBits,
    setMasterPrivateKey,
    setMasterPublicKey,
    setMasterChainCode,
    setDerivationPath,
    setChildPrivateKey,
    setChildPublicKey,
    setChildChainCode,
    setBTCAddress,
    setETHAddress,
    setMnemSuccess,
    setDIDDet
} from '../redux/actions'

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
export default function HDWallet() {

    const walletState = useTypedSelector(state => state.hdwallet)
    const view = useTypedSelector((state) => state.views)
    const classes = useStyles();

    const dispatch = useDispatch()

    const handleNumBitSelection = (numBit: string) => {

        const val = parseInt(numBit)
        dispatch(setNumBits(val));
        if (walletState.seed !== '') {
            walletState.nbit = val
            handleGenerateSeed()
        }
    };

    function handleGenerateSeed(): void {

        const seed = csprng(walletState.nbit, 16)
        const mnemonic = bip39.entropyToMnemonic(seed)

        dispatch(setMnemonic(mnemonic))
        createKeysAndUpdate(seed)
        dispatch(setMnemSuccess(true))
    }

    function createKeysAndUpdate(seed: string): void {

        dispatch(setRandomSeed(seed))
        const parentNode: BIP32Interface = bip32.fromSeed(Buffer.from(seed, 'hex'))
        const masterPrivateKey = parentNode.privateKey?.toString('hex')
        const masterChainCode = parentNode.chainCode.toString('hex')
        const masterPublicKey = parentNode.publicKey.toString('hex')

        console.log(parentNode.toBase58())

        dispatch(setMasterPrivateKey(masterPrivateKey || ''))
        dispatch(setMasterChainCode(masterChainCode))
        dispatch(setMasterPublicKey(masterPublicKey))
    }

    function handleDerivationPathInput(derPath: string): void {

        dispatch(setDerivationPath(derPath))
        const parentNode: BIP32Interface = bip32.fromSeed(Buffer.from(walletState.seed, 'hex'))
        try {
            const childNode: BIP32Interface = parentNode.derivePath(derPath);
            const childPrivateKey = childNode.privateKey?.toString('hex')
            const childChainCode = childNode.chainCode.toString('hex')
            const childPublicKey = childNode.publicKey.toString('hex')
            const ethAddress = publicKeyToAddress(childPublicKey)
            const btcAddress = createBitcoinAddress(childPublicKey)

            dispatch(setETHAddress(ethAddress))
            dispatch(setBTCAddress(btcAddress))
            dispatch(setChildPrivateKey(childPrivateKey || ''))
            dispatch(setChildPublicKey(childPublicKey))
            dispatch(setChildChainCode(childChainCode))
            generateETHDID(childPrivateKey || '', ethAddress)

        } catch {
            dispatch(setETHAddress(''))
            dispatch(setBTCAddress(''))
            dispatch(setChildPrivateKey(''))
            dispatch(setChildPublicKey(''))
            dispatch(setChildChainCode(''))
            dispatch(setDIDDet(''))
        }
    }

    function handleMnemonicInput(mnemonic: string): void {

        dispatch(setMnemonic(mnemonic))
        let seed: string = ''
        let success: boolean = true
        try {
            seed = bip39.mnemonicToEntropy(mnemonic)
            success = true
            createKeysAndUpdate(seed)
        } catch {
            success = false
            dispatch(setRandomSeed(''))
            dispatch(setMasterPrivateKey(''))
            dispatch(setMasterChainCode(''))
            dispatch(setMasterPublicKey(''))
        }
        dispatch(setMnemSuccess(success))
    }

    function createBitcoinAddress(publicKey: string) {

        const sha256 = crypto.createHash('sha256');
        const sha256Hash = sha256.update(Buffer.from(publicKey, 'hex')).digest('hex');
        const ripemd160 = new RIPEMD160()
        const ripemd160Hash = ripemd160.update(Buffer.from(sha256Hash, 'hex')).digest('hex')
        return bs58check.encode(Buffer.from("00" + ripemd160Hash, 'hex'))
    }

    function generateETHDID(privateKey: string, address: string) {

        try {
            const ethrDid = new EthrDID({ address, privateKey })
            dispatch(setDIDDet(ethrDid.did))
        }
        catch (error) {
            console.log("error", error);
        }
    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Title>
                    {view.ctyp === 'ETH' ? 'Generate Ethereum Addresses' : 'Generate Bitcoin Addresses'}
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
                        value={walletState.nbit.toString()}
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
                    value={walletState.mnem}
                    onChange={e => handleMnemonicInput(e.target.value)}
                    error={!walletState.mnemsuc}
                    helperText={walletState.mnemsuc ? "" : "Invalid mnemonic"}
                />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Random Seed" value={walletState.seed} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Private Key" value={walletState.mprv} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Public Key" value={walletState.mpub} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Master Chain Code" value={walletState.mchn} />
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
                    value={walletState.derp}
                    disabled={walletState.seed === ""}
                    onChange={e => handleDerivationPathInput(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <TextFieldWithCopy label="Child Private Key" value={walletState.cprv} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Child Public Key" value={walletState.cpub} />
            </Grid>

            <Grid item xs={12}>
                <TextFieldNormal label="Child Chain Code" value={walletState.cchn} />
            </Grid>
            {
                view.ctyp === 'ETH' ? <ETHAddress ethAddress={walletState.eth} />
                    : <BTCAddress btcAddress={walletState.btc} />
            }
            {
                view.ctyp === 'ETH' ? <ETHDID did={walletState.did} />
                    : <span></span>
            }
        </Grid>
    )
}