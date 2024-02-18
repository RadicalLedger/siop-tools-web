type JsonFormDataTypes = 'array' | 'object' | 'text' | 'object-array';

interface JsonFormItemProps {
    data_options?: JsonFormInputItemOptionsProps;
    name: string;
    add?: boolean;
    remove?: boolean;
    [x: symbol | string]: any;
}

interface JsonFormInputItemProps extends JsonFormItemProps {
    type: JsonFormDataTypes;
}

interface JsonFormInputItemOptionsProps extends JsonFormInputItemProps {
    name?: string;
}