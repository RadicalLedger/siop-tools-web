import React from 'react';
import './styles/index.scss';
import Form from '../form';
import * as Yup from 'yup';
import ArrayItem from './array';

const initialValues = {
    data: [
        {
            type: 'object',
            data: {}
        }
    ]
};

const validationSchema = Yup.object().shape({
    data: Yup.array().of(Yup.object())
});

export default function JsonForm() {
    const onSubmit = (values: any) => {
        console.log(values);
    };

    return (
        <div className="json-form-component">
            <Form
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                className="form">
                <ArrayItem name="data" />
            </Form>
        </div>
    );
}
