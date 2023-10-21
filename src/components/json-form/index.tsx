import React from 'react';
import './styles/index.scss';
import Form from '../form';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';
import InputItem from './input';
import _ from 'lodash';
import ReactJson from 'react-json-view';

interface Props {
    initialValues: object;
    jsonValue?: object;
    onSubmit(value?: any, editor?: any): void;
}

const validationSchema = Yup.object().shape({
    data: Yup.array().of(Yup.object())
});

export default function JsonForm({ initialValues = {}, jsonValue, onSubmit }: Props) {
    const filterJson = React.useCallback((obj) => {
        let data;

        if (obj?.type === 'object') {
            data = {};
            data[obj.attribute] = obj.data;

            if (obj.data_type === 'array') {
                data[obj.attribute] = [];

                for (let i = 0; i < obj.data.length; i++) {
                    const element = obj.data[i];
                    data[obj.attribute].push(filterJson(element));
                }
            } else if (obj.data_type === 'object') {
                data[obj.attribute] = {};

                for (let i = 0; i < obj.data.length; i++) {
                    const element = obj.data[i];

                    data[obj.attribute][element.attribute] =
                        filterJson(element)?.[element.attribute];
                }
            } else {
                data[obj.attribute] = filterJson(obj.data?.[0]);
            }
        } else {
            data = obj?.data;
        }

        return data;
    }, []);

    const onSubmitForm = (values: any) => {
        const json = filterJson(values);
        onSubmit(json || {}, values);
    };

    return (
        <div className="json-form-component">
            <Form
                enableReinitialize
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

            {jsonValue && (
                <ReactJson
                    name={false}
                    src={jsonValue}
                    theme="monokai"
                    displayDataTypes={false}
                    displayObjectSize={false}
                />
            )}
        </div>
    );
}
