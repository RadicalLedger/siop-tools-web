import React from 'react';
import { useField, useFormikContext } from 'formik';
import MuiSearchSelect, { SelectProps } from '../custom/search-select';

export default function SearchSelect({ name = 'search-select', onChange, ...props }: SelectProps) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e: any, value: any) => {
        setFieldValue(name, value);
        if (onChange) onChange(e, value);
    };

    const config: any = {
        ...field,
        ...props,
        onSelect: handleChange
    };

    if (meta && meta.touched && meta.error) {
        config.error = true;
        config.helperText = meta.error;
    }

    return (
        <MuiSearchSelect
            shrink={props?.shrink || config?.value ? true : props.shrink}
            {...config}
        />
    );
}
