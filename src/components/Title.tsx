import React from 'react';
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            color: "#303030"
        }
    }),
);

export default function Title(props: { children: any }) {

    const classes = useStyles()

    return (
        <Typography variant="h5" className={classes.title}>
            {props.children}
        </Typography>
    )
}