import React from 'react';
import { createStyles, Theme, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

import Home from './components/Home'
import DrawerItems from './components/DrawerItems'
import NormalDID from './components/NormalDID'
import HDDID from './components/HDDID'
import SDCredentialCreator from './components/SDCredentialCreator'
import SDCredentialMasker from './components/SDCredentialMasker'
import SDCredentialVerifier from './components/SDCredentialVerifier'

import { _view } from './redux/appSlice'
import { useSelector } from 'react-redux';
import ResolveDID from './components/ResolveDID';
import OCDIDResolver from './components/OffChainDIDResolver';
import OCDIDUpdater from './components/OffchainDIDUpdater';
import OCDIDRevoker from './components/OffchainDIDRevoker';
import OCDIDCreator from './components/OffChainDIDCreator';

const drawerWidth = 200

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#24C3B5',
    },
    secondary: {
      main: '#24C3B5',
      contrastText: '#ffcc00',
    },
    text: {
      primary: '#5F6F81',
      secondary: '#303030',
    },
    contrastThreshold: 1,
    tonalOffset: 0.2,
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    }
  }),
);


/**
 * Main app component
 * @return {React.ReactElement}
 */
function App() {

  const view = useSelector(_view)
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();

  const handleDrawerToggle = () => {

    setMobileOpen(!mobileOpen);

  };

  let currentView = (<div></div>)

  switch (view) {
    case (0):
      currentView = <Home />
      break
    case (1):
      currentView = <NormalDID />
      break
    case (2):
      currentView = <HDDID />
      break
    case (3):
      currentView = <ResolveDID />
      break
    case (4):
      currentView = <SDCredentialCreator />
      break
    case (5):
      currentView = <SDCredentialMasker />
      break
    case (6):
      currentView = <SDCredentialVerifier />
      break
    case (7):
      currentView = <OCDIDCreator />
      break
    case (8):
      currentView = <OCDIDResolver />
      break
    case (9):
      currentView = <OCDIDUpdater />
      break
    case (10):
      currentView = <OCDIDRevoker />
      break
    default:
      currentView = <Home />
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ marginRight: 10 }} >
              SIOP-DID Tools
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerItems />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <DrawerItems />
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <Toolbar variant="dense" />
          <Container maxWidth="md" style={{ marginTop: 25 }}>
            {currentView}
          </Container>
        </main>
      </div>
    </ThemeProvider>

  );
}

export default App;