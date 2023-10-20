import React from 'react';
import { FieldArray } from 'formik';
import InputItem from './input';
import { IconButton, Tooltip } from '@material-ui/core';
import { uniqueId } from 'lodash';
import AddOption from './add-option';
import RemoveOption from './remove-option';

export default function ArrayItem({ name, data_type, ...props }: JsonFormItemProps) {
    const helper: any = React.useRef(null);

    const getValues = (obj, str) => {
        let split = str.split('.');

        return eval(`obj${split.map((_) => `['${_}']`).join('')}`);
    };

    const onAdd = (dt) => {
        if (helper.current) helper.current.push({ id: uniqueId(), type: dt, data: '' });
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
                        data.map(({ id, ...child_props }: any, index: number) => {
                            let item_name = `${name}.${index}`;
                            if (!child_props.type) child_props.type = 'text';
                            if (child_props.type === 'text') item_name = `${item_name}.data`;

                            return (
                                <div className="item-wrap" key={id || `${name}-${index}`}>
                                    <InputItem name={item_name} {...child_props} />
                                    {props.remove && (
                                        <RemoveOption onClick={() => onRemove(index)} />
                                    )}
                                </div>
                            );
                        })
                    );
                }}
            />

            {props.add && (
                <div className="buttons">
                    <AddOption onClick={() => onAdd(data_type)} />
                </div>
            )}
        </div>
    );
}
