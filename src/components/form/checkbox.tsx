import React from 'react';
import { useField, useFormikContext } from 'formik';
import MuiCheckbox, { CheckboxProps } from '../custom/checkbox';

interface Props extends CheckboxProps {
    name: string;
    onChange?: any;
}

export default function Checkbox({ name, value, onChange, ...props }: Props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e: any) => {
        setFieldValue(name, e.target.checked);
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

    return <MuiCheckbox {...config} />;
}
