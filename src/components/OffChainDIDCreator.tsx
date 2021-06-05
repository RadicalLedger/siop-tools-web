import React, { useState } from 'react';
import { Grid, TextField, Button, Snackbar, Fade } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Title from './Title'
import axios from 'axios';
import { isAddress } from '../utils';

import { useDispatch, useSelector } from 'react-redux'
import { setAddress, setDID, setPrivateKey, _address, _did, _privateKey } from '../redux/offCreatorSlice'
import Spinner from './Spinner';
import TextWithCopy from './TextFieldWithCopy';
import DescriptionBox from './DescriptionBox';

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

export default function OCDIDCreator() {

    const did = useSelector(_did)
    const privateKey = useSelector(_privateKey)
    const address = useSelector(_address)
    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{ open: boolean, text: string }>({ open: false, text: '' });

    const dispatch = useDispatch()

    function generateDID() {

        axios.post(`${process.env.REACT_APP_BACKEND}/did/${did}`).then((res:any) => {
            const {did, privateKey } = res.data
            dispatch(setDID(did))
            dispatch(setPrivateKey(privateKey))
            dispatch(setAddress(did.split(':')[2]))
        }).catch(err => {
            console.log(err)
            const error = 'Error. Please try again later'
            dispatch(setDID(error))
            dispatch(setPrivateKey(error))
            dispatch(setAddress(error))
        })
    }

    function handleClose() {
        setState({
            ...snackBarState,
            open: false,
        });
    };

    function callback(success:boolean){
        if(success){
            setState({
                open: true,
                text:"Copied to clipboard"
            });
        }else{
            setState({
                open: true,
                text:"Clould not copied"
            });
        }
    }

    return (
        <div>
        <Grid container spacing={3}>

        <Grid item xs={12}>
            <Title>
                Generate Offchain DID
            </Title>
        </Grid>
        
            <Grid item xs={12}>
                <DescriptionBox
                    description="You could create an Ethereum adderes along with a private 
                    key and register that as a Decentralised Identity here. 
                    Click 'Generate DID' to generate a DID."
                />
            </Grid>

            <Grid item xs={12}>
                <Button data-testid="generateDID" onClick={generateDID} variant="contained" color="primary">Generate DID</Button>
            </Grid>

            <Grid item xs={12}>
                <TextWithCopy label="Address" value={address} callback={callback}/>
            </Grid>

            <Grid item xs={12}>
                <TextWithCopy label="Private key" value={privateKey} callback={callback}/>
            </Grid>

            <Grid item xs={12}>
                <TextWithCopy label="Decentralized ID (DID)" value={did} callback={callback}/>
            </Grid>

        </Grid>

        <Snackbar
            open={snackBarState.open}
            onClose={handleClose}
            TransitionComponent={Fade}
            message={snackBarState.text}
            autoHideDuration={5000}
        />
    </div >
    )
}