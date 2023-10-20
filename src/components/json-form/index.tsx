import React from 'react';
import './styles/index.scss';
import Form from '../form';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import InputItem from './input';
import _, { filter, uniqueId } from 'lodash';

const initialValues = {
    data: [
        {
            id: uniqueId(),
            type: 'object',
            data_options: { type: 'text', remove: true },
            key: '@context',
            add: true,
            data: [
                {
                    id: uniqueId(),
                    type: 'text',
                    remove: true,
                    data: 'https://www.w3.org/2018/credentials/v1'
                },
                {
                    id: uniqueId(),
                    type: 'text',
                    remove: true,
                    data: 'https://d202eicx1ap3m7.cloudfront.net/credentials/microrewards/v0-01/siop-tools-schema-v0-01.json'
                }
            ]
        },
        {
            id: uniqueId(),
            type: 'object',
            key: 'id',
            data: [{ id: uniqueId(), type: 'text', data: 'http://localhost:8080/verify/1' }]
        },
        {
            id: uniqueId(),
            type: 'object',
            key: 'issuanceDate',
            data: [{ id: uniqueId(), type: 'text', data: new Date().toISOString() }]
        },
        {
            id: uniqueId(),
            type: 'object',
            key: 'type',
            data: [{ id: uniqueId(), type: 'text', data: 'VerifiableCredential' }]
        },
        {
            id: uniqueId(),
            type: 'object',
            key: 'issuer',
            data: [
                {
                    id: uniqueId(),
                    type: 'text',
                    data: 'did:key:z6Mkoqgh9AppS2s28onvE4Qy9jwDBJ8ZqRdBtoWLSsRL57Jj'
                }
            ]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_options: {
                type: 'object',
                data: [{ type: 'text', data: '' }],
                remove: true
            },
            key: 'credentialSubject',
            add: true,
            data: [
                {
                    id: uniqueId(),
                    type: 'object',
                    key: 'type',
                    remove: true,
                    data: [
                        {
                            id: uniqueId(),
                            type: 'array',
                            data: [{ id: uniqueId(), type: 'text', data: 'DemoCredential' }]
                        }
                    ]
                },
                {
                    id: uniqueId(),
                    type: 'object',
                    key: 'customAttribute',
                    data_options: { id: uniqueId(), type: 'text', data: '', remove: true },
                    add: true,
                    remove: true,
                    data: [
                        {
                            id: uniqueId(),
                            type: 'array',
                            remove: true,
                            data: [{ id: uniqueId(), type: 'text', data: '', remove: true }]
                        }
                    ]
                }
            ]
        }
    ]
};

const validationSchema = Yup.object().shape({
    data: Yup.array().of(Yup.object())
});

export default function JsonForm({ onSubmit }) {
    const filterJson = React.useCallback((obj) => {
        let data;

        if (obj?.type === 'array') {
            data = [];

            for (const item of obj?.data) {
                data.push(filterJson(item));
            }
        } else if (obj?.type == 'object') {
            data = {};

            data[obj?.key] = filterJson(obj?.data);
        } else {
            data = obj.data;
        }

        return obj;
    }, []);

    const onSubmitForm = (values: any) => {
        console.log(JSON.stringify(values, null, 4));
        console.log(JSON.stringify(filterJson(values), null, 4));
    };

    return (
        <div className="json-form-component">
            <Form
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitForm}
                className="form">
                <InputItem
                    name="data"
                    type="array"
                    data_options={{
                        type: 'object',
                        data: [{ type: 'text' }],
                        remove: true
                    }}
                    add={true}
                />

                <Button variant="contained" color="primary" aria-label="add" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
