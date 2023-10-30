import { Button } from '@material-ui/core';
import React from 'react';

interface Props {
    data: object | null;
    className?: string;
    [x: symbol | string]: any;
}

export default function AddToExtensionButton({ data, className, ...props }: Props) {
    const addToExtensionBtnRef = React.useRef<HTMLButtonElement>(null);
    const [alertOpen, setAlertOpen] = React.useState({ open: false, title: '', content: '' });

    React.useEffect(() => {
        window.localStorage.setItem('new-content', 'true');
    }, []);

    const onAddToExtension = () => {
        if (addToExtensionBtnRef?.current) {
            if (addToExtensionBtnRef.current?.dataset?.active === 'false') {
                return setAlertOpen({
                    open: true,
                    title: 'Alert',
                    content:
                        'Please make sure you have installed the DID SIOP Extension in your browser.'
                });
            }

            addToExtensionBtnRef.current.innerHTML = 'Added To Extension';
            addToExtensionBtnRef.current.disabled = true;

            setTimeout(() => {
                if (addToExtensionBtnRef?.current) {
                    addToExtensionBtnRef.current.disabled = false;
                    addToExtensionBtnRef.current.innerHTML = 'Add to Extension';
                }
            }, 1000);
        }
    };

    return (
        <Button
            {...props}
            color="primary"
            variant="contained"
            data-active="false"
            ref={addToExtensionBtnRef}
            onClick={onAddToExtension}
            data-did-siop-vc={btoa(JSON.stringify(data))}
            className={`${className} extension-btn`}>
            Add To Extension
        </Button>
    );
}
