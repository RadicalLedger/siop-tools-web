import React from 'react';
import ArrayItem from './array';
import TextItem from './text';
import ObjectItem from './object';

interface Props {
    type: 'array' | 'object' | 'text';
    name: string;
    [x: symbol | string]: any;
}

export default function InputItem({ type, ...props }: Props) {
    if (type === 'array') {
        return <ArrayItem {...props} />;
    }

    if (type === 'object') {
        return <ObjectItem {...props} />;
    }

    return <TextItem {...props} />;
}
