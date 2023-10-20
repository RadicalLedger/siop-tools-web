import React from 'react';
import ArrayItem from './array';
import TextItem from './text';
import ObjectItem from './object';

export default function InputItem({ type, ...props }: JsonFormInputItemProps) {
    if (!props.data_type) props.data_type = 'text';

    if (type === 'array' || type === 'object-array') {
        if (type === 'object-array') props.data_type = 'object';

        return <ArrayItem {...props} />;
    }

    if (type === 'object') {
        return <ObjectItem {...props} />;
    }

    return <TextItem {...props} />;
}
