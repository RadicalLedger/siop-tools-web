import React from 'react';
import { Toolbar, Divider, List, ListItem, ListItemText, makeStyles, createStyles, Theme } from '@material-ui/core';

import { useDispatch } from 'react-redux'

import { setView } from '../redux/actions'
import { useTypedSelector } from '../redux/reducers/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    unselected: {
      color: "#303030"
    },
    selected: {
      color: "#24C3B5"
    }
  }),
);

export default function DrawerItems() {

  const dispatch = useDispatch()
  const classes = useStyles()
  const view = useTypedSelector((state) => state.views.view)
  const ctyp = useTypedSelector(state => state.views.ctyp)

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>

      <ListItem className={view === 0 ? classes.selected : classes.unselected} button key="Home" onClick={() => dispatch(setView({ ctyp: '', view: 0 }))}>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem className={view === 1 ? classes.selected : classes.unselected} button key="DID-generate" onClick={() => dispatch(setView({ ctyp: '', view: 1 }))}>
          <ListItemText primary="Generate DID" />
        </ListItem>

        <ListItem className={view === 2 ? classes.selected : classes.unselected} button key="DID-resolve" onClick={() => dispatch(setView({ ctyp: '', view: 2 }))}>
          <ListItemText primary="Resolve DID" />
        </ListItem>

        <ListItem className={view === 3 && ctyp === 'ETH' ? classes.selected : classes.unselected} button key="ETH" onClick={() => { dispatch(setView({ ctyp: 'ETH', view: 3 })) }}>
          <ListItemText primary="Generate Ethereum Addresses" />
        </ListItem>

        <ListItem className={view === 3 && ctyp === 'BTC' ? classes.selected : classes.unselected} button key="BTC" onClick={() => { dispatch(setView({ ctyp: 'BTC', view: 3 })) }}>
          <ListItemText primary="Generate Bitcoin Addresses" />
        </ListItem>

      </List>
    </div>
  )
}