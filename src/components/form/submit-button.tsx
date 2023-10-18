import React from 'react';
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { useFormikContext } from 'formik';
import Button, { ButtonProps } from '../custom/button';

export default function SubmitButton({
    id,
    size = 'small',
    type = 'submit',
    variant = 'outlined',
    fullWidth = true,
    autofocus = false,
    children,
    ...props
}: ButtonProps) {
    const { submitForm } = useFormikContext();

    const config: any = {
        fullWidth: fullWidth,
        type: type,
        size: size,
        variant: variant,
        ...props
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        submitForm();
        if (props.onClick) props.onClick(e);
    };

    return (
        <Button onClick={onSubmit} {...config}>
            {children}
        </Button>
    );
}
