import React from 'react';
import { useField, useFormikContext } from 'formik';
import MuiRadio, { RadioProps } from '../custom/radio';

interface Props extends RadioProps {
    name?: string;
    onChange?: any;
}

export default function Radio({ ...props }: Props) {
    return <MuiRadio {...props} />;
}
