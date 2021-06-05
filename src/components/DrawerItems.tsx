import React from 'react';
import { Toolbar, Divider, List, ListItem, ListItemText, makeStyles, createStyles, Theme } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux'

import { setView, _view } from '../redux/appSlice'

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
  const view = useSelector(_view)
  // const ctyp = useTypedSelector(state => state.views.ctyp)
  console.log(process.env.REACT_APP_BACKEND)

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem className={view === 0 ? classes.selected : classes.unselected} button key="home" onClick={() => { dispatch(setView(0)) }}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem className={view === 1 ? classes.selected : classes.unselected} button key="create-normal-did" onClick={() => { dispatch(setView(1)) }}>
          <ListItemText primary="Create Normal DID" />
        </ListItem>
        <ListItem className={view === 2 ? classes.selected : classes.unselected} button key="create-hd-did" onClick={() => { dispatch(setView(2)) }}>
          <ListItemText primary="Create HD DID" />
        </ListItem>
        <ListItem className={view === 3 ? classes.selected : classes.unselected} button key="resolve-did" onClick={() => { dispatch(setView(3)) }}>
          <ListItemText primary="Resolve DID" />
        </ListItem>
        <ListItem className={view === 4 ? classes.selected : classes.unselected} button key="sd-cred-creator" onClick={() => { dispatch(setView(4)) }}>
          <ListItemText primary="Create Selectively Disclosable Credentials" />
        </ListItem>
        <ListItem className={view === 5 ? classes.selected : classes.unselected} button key="sd-cred-presenter" onClick={() => { dispatch(setView(5)) }}>
          <ListItemText primary="Mask and present credentials" />
        </ListItem>
        <ListItem className={view === 6 ? classes.selected : classes.unselected} button key="sd-cred-verifier" onClick={() => { dispatch(setView(6)) }}>
          <ListItemText primary="Verify Presentation" />
        </ListItem>
        <ListItem className={view === 7 ? classes.selected : classes.unselected} button key="off-chain-did-resolve" onClick={() => { dispatch(setView(7)) }}>
          <ListItemText primary="Create offchain DID" />
        </ListItem>
        <ListItem className={view === 8 ? classes.selected : classes.unselected} button key="off-chain-did-resolve" onClick={() => { dispatch(setView(8)) }}>
          <ListItemText primary="Resolve offchain DID" />
        </ListItem>
        <ListItem className={view === 9 ? classes.selected : classes.unselected} button key="off-chain-did-update" onClick={() => { dispatch(setView(9)) }}>
          <ListItemText primary="Update offchain DID" />
        </ListItem>
        <ListItem className={view === 10 ? classes.selected : classes.unselected} button key="off-chain-did-revoke" onClick={() => { dispatch(setView(10)) }}>
          <ListItemText primary="Revoke off chain DID" />
        </ListItem>
      </List>
    </div>
  )
}