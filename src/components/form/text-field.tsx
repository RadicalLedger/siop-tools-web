import React from 'react';
import { useField } from 'formik';
import { TextField as MuiTextField, TextFieldProps } from '@material-ui/core';

export default function TextField({
    name = 'text-field',
    size = 'small',
    type = 'text',
    variant = 'outlined',
    fullWidth = true,
    ...props
}: TextFieldProps) {
    const [field, meta] = useField(name);

    const config: any = {
        fullWidth: fullWidth,
        type: type,
        variant: variant,
        size: size,
        ...field,
        ...props
    };

    if (meta && meta.touched && meta.error) {
        config.error = true;
        config.helperText = meta.error;
    }

    return <MuiTextField {...config} />;
}
