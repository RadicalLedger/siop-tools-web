import React from 'react';
import './styles/index.scss';
import Form from '../form';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import InputItem from './input';
import { uniqueId } from 'lodash';

const initialValues = {
    data: [
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'array',
            key: '@context',
            add: true,
            remove: true,
            data: [
                { id: uniqueId(), type: 'text', data: 'https://www.w3.org/2018/credentials/v1' },
                {
                    id: uniqueId(),
                    type: 'text',
                    data: 'https://d202eicx1ap3m7.cloudfront.net/credentials/microrewards/v0-01/siop-tools-schema-v0-01.json'
                }
            ]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            key: 'id',
            data: 'http://localhost:8080/verify/1'
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            key: 'issuanceDate',
            data: new Date().toISOString(),
            remove: false
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'array',
            key: 'type',
            add: false,
            remove: false,
            data: [{ id: uniqueId(), type: 'text', data: 'VerifiableCredential' }]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            key: 'issuer',
            data: 'did:key:z6Mkoqgh9AppS2s28onvE4Qy9jwDBJ8ZqRdBtoWLSsRL57Jj',
            remove: false
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'object-array',
            key: 'credentialSubject',
            add: true,
            remove: true,
            data: [
                {
                    id: uniqueId(),
                    type: 'object',
                    data_type: 'array',
                    key: 'type',
                    data: [{ id: uniqueId(), type: 'text', data: 'DemoCredential' }]
                },
                {
                    id: uniqueId(),
                    type: 'object',
                    data_type: 'array',
                    key: 'customAttribute',
                    add: true,
                    remove: true,
                    data: [{ id: uniqueId(), type: 'text', data: '' }]
                }
            ]
        }
    ]
};

const validationSchema = Yup.object().shape({
    data: Yup.array().of(Yup.object())
});

export default function JsonForm({ onSubmit }) {
    const onSubmitForm = (values: any) => {
        console.log(JSON.stringify(values, null, 4));
    };

    return (
        <div className="json-form-component">
            <Form
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitForm}
                className="form">
                <InputItem name="data" type="array" data_type="object" add={true} remove={false} />

                <Button variant="contained" color="primary" aria-label="add" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
