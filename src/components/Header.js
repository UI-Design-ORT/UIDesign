import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link, useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PublishIcon from '@material-ui/icons/Publish';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StoreIcon from '@material-ui/icons/Store';

import { gql, useQuery } from '@apollo/client';
import { useToken } from "../AuthProvider";

const USER_QUERY = gql`
  query User{
    user{
        id
        firstname
        token
        lastname
        city
        country
        email
        dni
        profileImage
        medalAchievement
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'white'
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  avatar: {
    margin: theme.spacing(1),
  },

  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));



const Header = () => {/* { user, setUser } */

  //nuevo
  const { token } = useToken();
  const { data, loading, refetch } = useQuery(USER_QUERY);
  React.useEffect(() => {
    refetch();
  }, [refetch, token]);
  const { user } = data || {};



  //memu
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key='Home' component={Link} to={'/products'}>
          <ListItemIcon> <StoreIcon /></ListItemIcon>
          <ListItemText primary='Home' />
        </ListItem>
        {user ? <>
          <ListItem button key='Subir prendas' component={Link} to={'/productUpload'}>
            <ListItemIcon> <PublishIcon /></ListItemIcon>
            <ListItemText primary='Subir prendas' />
          </ListItem>
          <ListItem button key='Mi carrito' component={Link} to={'/myCart'}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary='Mi carrito' />
          </ListItem> </>
          : <></>}
        {user ? <ListItem button key='Mi perfil' component={Link} to={'/account'}>
          <ListItemIcon>{user.avatar ? <Avatar src={user.avatar} /> : <Avatar>?</Avatar>}</ListItemIcon>
          <ListItemText primary='Mi perfil' />
        </ListItem> :
          <ListItem button key='Ingresar' component={Link} to={'/login'}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary='Ingresar' />
          </ListItem>
        }
      </List >
      <Divider />
    </div >
  );
  //fin menu

  const classes = useStyles();
  const history = useHistory();
  const handleClick = () => {
    //setUser(null);
    history.push('/login');
  }

  return (
    <AppBar position="static">
      <Toolbar>

        <div>
          {['left'].map((anchor) => (
            <React.Fragment key={anchor}>
              {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(anchor, true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>

        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <Typography component={Link} to={'/products'} variant="h6" className={classes.title}>
          Mi Ropa
        </Typography>
        {user ? <Avatar className={classes.avatar} component={Link} to={'/account'} src={user.avatar}>CS</Avatar> : <Button component={Link} to={'/login'} color="inherit">Ingresar</Button>}
        {user ? <Button onClick={handleClick} color="inherit">Salir</Button> : <></>}
        {user ? <Link className={classes.link} to={'/myCart'}>
          <ShoppingCartIcon />
        </Link> : <></>}
      </Toolbar>
    </AppBar>
  );
}

export default Header;