import React from 'react';
import { useField, useFormikContext } from 'formik';
import MuiRadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { FormControl, FormHelperText } from '@mui/material';

interface Props extends RadioGroupProps {
    name: string;
    onChange?: any;
}

export default function RadioGroup({ name, children, onChange, ...props }: Props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e: any) => {
        setFieldValue(name, e.target.value);
        if (onChange) onChange(e);
    };

    const config: any = {
        ...field,
        ...props,
        onChange: handleChange,
        value: field?.value,
        checked: field?.value
    };

    if (meta && meta.touched && meta.error) {
        config.error = true;
        config.helperText = meta.error;
    }

    return (
        <FormControl error={config.error} component="fieldset" variant="standard">
            <MuiRadioGroup {...config}>{children}</MuiRadioGroup>
            <FormHelperText>{config.helperText}</FormHelperText>
        </FormControl>
    );
}
