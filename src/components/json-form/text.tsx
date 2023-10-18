import { TextField } from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';

export default function TextItem({ name, className = '', ...props }) {
    const [field, meta] = useField(name);

    const config: any = {
        className: `text-item${className ? ` ${className}` : ''}`,
        placeholder: 'Enter Value',
        ...field,
        ...props
    };

    if (meta && meta.touched && meta.error) {
        config.error = true;
        config.helperText = meta.error;
    }

    return <TextField variant="outlined" {...config} />;
}
