import React from 'react';
import './styles/index.scss';
import Form from '../form';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';
import InputItem from './input';
import _, { uniqueId } from 'lodash';
import ReactJson from 'react-json-view';

const initialValues = {
    data: [
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'array',
            data_options: { type: 'text', remove: true },
            attribute: '@context',
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
            data_type: 'text',
            attribute: 'id',
            data: [{ id: uniqueId(), type: 'text', data: 'http://localhost:8080/verify/1' }]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            attribute: 'issuanceDate',
            data: [{ id: uniqueId(), type: 'text', data: new Date().toISOString() }]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            attribute: 'type',
            data: [{ id: uniqueId(), type: 'text', data: 'VerifiableCredential' }]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'text',
            attribute: 'issuer',
            data: [
                {
                    id: uniqueId(),
                    type: 'text',
                    data: 'did:attribute:z6Mkoqgh9AppS2s28onvE4Qy9jwDBJ8ZqRdBtoWLSsRL57Jj'
                }
            ]
        },
        {
            id: uniqueId(),
            type: 'object',
            data_type: 'object-array',
            data_options: {
                type: 'object',
                data: [{ type: 'text', data: '' }],
                remove: true
            },
            attribute: 'credentialSubject',
            add: true,
            data: [
                {
                    id: uniqueId(),
                    type: 'object',
                    data_type: 'array',
                    attribute: 'type',
                    remove: true,
                    data: [
                        {
                            id: uniqueId(),
                            type: 'text',
                            data: 'DemoCredential'
                        }
                    ]
                },
                {
                    id: uniqueId(),
                    type: 'object',
                    data_type: 'array',
                    attribute: 'customAttribute',
                    data_options: { type: 'text', data: '', remove: true },
                    add: true,
                    remove: true,
                    data: [
                        {
                            id: uniqueId(),
                            type: 'text',
                            remove: true,
                            data: ''
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
    const [jsonValue, setJsonValue] = React.useState({});

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
        setJsonValue(values);
        console.log(JSON.stringify(values, null, 4));
        //console.log(JSON.stringify(filterJson(values), null, 4));
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

                <div className="submit-btn-wrap">
                    <Button
                        className="submit-json-btn"
                        variant="contained"
                        color="primary"
                        aria-label="add"
                        type="submit">
                        Save Object
                    </Button>
                </div>
            </Form>

            {/* <TextField
                className="json-view"
                variant="outlined"
                multiline={true}
                rows={20}
                InputProps={{ readOnly: true }}
                value={JSON.stringify(jsonValue, null, 4)}
            /> */}

            <ReactJson
                name={false}
                src={jsonValue}
                theme="monokai"
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
            />
        </div>
    );
}
