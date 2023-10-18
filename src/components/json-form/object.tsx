import React from 'react';
import TextItem from './text';

export default function ObjectItem({ name, ...props }) {
    return (
        <div className="object-item">
            <TextItem className="key-text-item" name={`${name}.key`} />
            <TextItem name={`${name}.data`} />
        </div>
    );
}
