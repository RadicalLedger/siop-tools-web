import React from 'react';
import { FieldArray } from 'formik';
import InputItem from './input';
import { IconButton, Tooltip } from '@material-ui/core';
import { uniqueId } from 'lodash';
import AddOption from './add-option';
import RemoveOption from './remove-option';
import TextItem from './text';

export default function ObjectItem({ name, data_options, ...props }: JsonFormItemProps) {
    const helper: any = React.useRef(null);

    const getValues = (obj, str) => {
        let split = str.split('.');

        return eval(`obj${split.map((_) => `['${_}']`).join('')}`);
    };

    const onAdd = () => {
        if (helper.current)
            helper.current.push({ id: uniqueId(), type: 'object', ...data_options });
    };

    const onRemove = (index: number) => {
        if (helper.current) helper.current.remove(index);
    };

    return (
        <div className="object-item">
            <div className="items-wrap">
                <TextItem className="key-text-item" name={name} />
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
                                    if (!child_props.type) child_props.type = 'text';

                                    return (
                                        <div className="item-wrap" key={id || `${name}-${index}`}>
                                            <InputItem
                                                name={`${name}.${index}.data`}
                                                {...child_props}
                                            />
                                            {child_props.remove && data.length > 1 && (
                                                <RemoveOption onClick={() => onRemove(index)} />
                                            )}
                                        </div>
                                    );
                                })
                            );
                        }}
                    />
                </div>
            </div>

            {props.add && (
                <div className="buttons">
                    <AddOption onClick={onAdd} />
                </div>
            )}
        </div>
    );
}
