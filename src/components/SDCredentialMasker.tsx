import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fade, IconButton, List, Snackbar, TextField } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import Title from './Title';
import AddIcon from '@material-ui/icons/Add';

import { present, base64UrlDecode } from 'sd-vc-lib';
import MaskingComponent from './MaskingComponent';
//@ts-ignore
import JSONFormat from 'json-format'
import {setCredentials, setHolderPrivateKey, setInputComponentList, setMasks, setVP, _credentials, _holderPrivateKey, _inputComponentList, _masks, _vp} from '../redux/presentSlice'
import {base64UrlEncode} from 'sd-vc-lib'
const useStyles = makeStyles({
    elements: {
        marginTop: 50,
        marginLeft: 3,
        marginRight: 3
    },
    mainWrapper: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '4%',
        paddingRight: '3%',
        paddingBottom: 0,
        paddingLeft: '3%'
    }
});

export default function SDCredentialMasker() {

    const vp = useSelector(_vp)
    const inputComponentList = useSelector(_inputComponentList)
    const credentials = useSelector(_credentials)
    const masks = useSelector(_masks)
    const holderPrivateKey = useSelector(_holderPrivateKey)
    
    const dispatch = useDispatch()

    const classes = useStyles();

    const [snackBarState, setState] = React.useState<{
        open: boolean;
    }>({
        open: false,
    });

    function handlePrivateKeyInput(privateKey: string) {
        dispatch(setHolderPrivateKey(privateKey))
    }

    async function mask() {
        const cred = credentials.map((cred:any) => {
            return JSON.parse(base64UrlDecode(cred))
        })
        try{
            const vp = present(cred, masks, holderPrivateKey)
            dispatch(setVP(base64UrlEncode(JSON.stringify(vp))))
        }catch(e){
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
        <div className={classes.mainWrapper}>
            <Title>
                Mask and present credentials
            </Title>
            <List>
                {inputComponentList.map((i:number) => {
                    return <MaskingComponent index={i} />
                })}
            </List>
            <IconButton aria-label="add" onClick={addNewInput}
                disabled={credentials[inputComponentList.length - 1] === '' }
            >
                <AddIcon />
            </IconButton>
            <TextField
                className={classes.elements}
                value={holderPrivateKey}
                onChange={e => handlePrivateKeyInput(e.target.value)}
                label="Holder's Private Key"
                variant="outlined"
                multiline
            />
            <Button
                className={classes.elements}
                color="primary" variant="contained"
                onClick={mask}
                disabled={holderPrivateKey && masks && credentials ? false : true}
            >Mask</Button>
            <TextField
                className={classes.elements}
                // value={JSONFormat(vp, {type:'tab'})}
                value={JSONFormat(vp, {type:'tab'})}
                label="Presentation"
                variant="outlined"
                multiline
                onClick={() => copyToClipboard(vp)}
            />
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