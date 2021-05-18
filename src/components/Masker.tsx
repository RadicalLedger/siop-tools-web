import { Checkbox, FormControlLabel, FormGroup, List, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { base64UrlDecode } from 'sd-vc-lib'
import { setMasks, _credentials, _masks } from '../redux/presentSlice';


export default function Masker(props:any) {

    const masks = useSelector(_masks)
    const credentials = useSelector(_credentials)
    const dispatch = useDispatch()
    let claims = {}
    
    try {
        claims = JSON.parse(base64UrlDecode(credentials[props.index])).claims
    } catch (error) {
        
    }


    const handleCheckboxInput = (checked:boolean, key:string) => {
        let newMasks:any = [...masks]
        if(newMasks[props.index]){
            newMasks = [...masks.slice(0, props.index), {...masks[props.index], [key]:checked}, ...masks.slice(props.index+1)]
            // newMasks[props.index][key] = checked
        }else{
            newMasks = [...masks.slice(0, props.index), {[key]: checked}, ...masks.slice(props.index+1)]
            // newMasks[props.index] = {[key]: checked}
        }
        
        dispatch(setMasks(newMasks))
    }

    return (
        <div>
            
            <FormGroup >
                <List>
                <Typography>Select to mask claims</Typography>
                    {
                        Object.keys(claims).map((key: string) => {
                            return <ListItem key={key}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={masks[props.index][key] || false}
                                            onChange={(e) => handleCheckboxInput(e.target.checked, key)}
                                            name="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label={`Claim "${key}" ${ masks[props.index][key] ? 'Masked' : 'Exposed'}`}
                                    labelPlacement="start"
                                />
                            </ListItem>
                        })
                    }
                </List>
            </FormGroup>
        </div>
    )
}