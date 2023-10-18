import React from 'react';
import { FieldArray } from 'formik';
import InputItem from './input';
import { IconButton, Tooltip } from '@material-ui/core';
import { uniqueId } from 'lodash';
import AddOption from './add-option';
import RemoveOption from './remove-option';

export default function ArrayItem({ name }) {
    const helper: any = React.useRef(null);

    const getValues = (obj, str) => {
        let split = str.split('.');

        return eval(`obj${split.map((_) => `['${_}']`).join('')}`);
    };

    const onAdd = () => {
        if (helper.current) helper.current.push({ key: uniqueId(), type: 'object', data: {} });
    };

    const onRemove = (index: number) => {
        if (helper.current) helper.current.remove(index);
    };

    return (
        <div className="array-item">
            <FieldArray
                name={name}
                render={(arrayHelpers) => {
                    helper.current = arrayHelpers;

                    const {
                        form: { values, errors }
                    } = arrayHelpers;

                    const data = getValues(values, name) || [];

                    return data?.length === 0 ? (
                        <span className="empty-records">No records yet</span>
                    ) : (
                        data.map((item: any, index: number) => {
                            if (!item.type) item.type = 'text';

                            return (
                                <div className="item-wrap" key={item.key || uniqueId()}>
                                    <InputItem type={item.type} name={`${name}.${index}.data`} />
                                    <RemoveOption onClick={() => onRemove(index)} />
                                </div>
                            );
                        })
                    );
                }}
            />

            <div className="buttons">
                <AddOption onClick={onAdd} />
            </div>
        </div>
    );
}
