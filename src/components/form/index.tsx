import React from 'react';
import { Formik, Form as FormikForm } from 'formik';

interface Props {
    id?: string;
    className?: string;
    children?: React.ReactNode;
    formProps?: any;
    initialValues?: any;
    validationSchema?: any;
    onSubmit?: any;
    innerRef?: any;
    enableReinitialize?: boolean;
    [prop: string]: any;
}

export default function Form({
    children,
    className,
    innerRef,
    formProps = {},
    initialValues = {},
    validationSchema = {},
    onSubmit,
    enableReinitialize = false,
    ...props
}: Props) {
    return (
        <Formik
            enableReinitialize={enableReinitialize}
            innerRef={innerRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            {...props}>
            <FormikForm {...formProps} className={className}>
                {children}
            </FormikForm>
        </Formik>
    );
}
