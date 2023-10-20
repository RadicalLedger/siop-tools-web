import React from 'react';
import TextItem from './text';
import InputItem from './input';

export default function ObjectItem({ name, data_type = 'text', ...props }: JsonFormItemProps) {
    return (
        <div className="object-item">
            <TextItem className="key-text-item" name={`${name}.key`} />
            {/* <TextItem name={`${name}.data`} /> */}
            <InputItem name={`${name}.data`} type={data_type} {...props} />
        </div>
    );
}
