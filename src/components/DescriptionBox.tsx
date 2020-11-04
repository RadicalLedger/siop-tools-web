import React from 'react';
import { Typography, Box, makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            color: "#303030",
            textJustify: "initial"
        }
    }),
);

export default function DescriptionBox(props:{description:string}) {

    const classes = useStyles()

    return (
        <Box data-testid="descriptionBox" className={classes.box}>
            <Typography>{props.description}</Typography>
        </Box>
    )
}