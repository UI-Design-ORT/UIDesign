import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinkUI from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useToken } from "../AuthProvider";

const LOGIN_MUTATION = gql`
  mutation Login($input: SignInInput!) {
    signIn(input: $input) {
      id
      firstname
      token
      lastname
      city
      country
      email
      dni
      profileImage
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({ setUser }) {
  const { setToken } = useToken();
  const [signInMutation] = useMutation(LOGIN_MUTATION);
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { email, password } = values;
    const { data } = await signInMutation({
      variables: {
        input: {
          email,
          password
        }
      }
    });
    const {
      signIn: { token }
    } = data;
    setToken(token);
    //setUser(data.signIn);
    history.push('/account');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresa a tu cuenta
        </Typography>
        <form name='login-form' onSubmit={handleClick} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={event =>
              setValues({
                ...values,
                email: event.target.value
              })
            }
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            onChange={event =>
              setValues({
                ...values,
                password: event.target.value
              })
            }
            value={values.password}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Ingresa
          </Button>
          <Grid container>
            <Grid item xs>
              <LinkUI href="#" variant="body2">
                ¿Olvidaste tu contraseña?
              </LinkUI>
            </Grid>
            <Grid item>
              <Link to="/signup">
                <LinkUI href="#" variant="body2">
                  {"¿No tienes cuenta? Regístrate"}
                </LinkUI>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
