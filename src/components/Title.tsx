import React from 'react';
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            color: '#303030'
        }
    })
);

interface Props {
    children?: any;
}

export default function Title({ children }: Props) {
    const classes = useStyles();

    return (
        <Typography variant="h5" className={classes.title}>
            {children}
        </Typography>
    );
}
