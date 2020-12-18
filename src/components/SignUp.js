import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LinkUI from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation Signup($input: UserInput!) {
    signUp(input: $input) {
      id
      token
      password
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const cities = [
  {
    value: 'montevideo',
    label: 'Montevideo'
  },
  {
    value: 'las-piedras',
    label: 'Las Piedras'
  },
  {
    value: 'ciudad-de-la-costa',
    label: 'Ciudad de la Costa'
  },
  {
    value: 'punta-del-este',
    label: 'Punta del Este'
  },
  {
    value: 'colonia-del-sacramento',
    label: 'Colonia del Sacramento'
  },
  {
    value: 'rivera',
    label: 'Rivera'
  }
];

export default function SignUp() {
  const classes = useStyles();
  let history = useHistory();
  const [signUpMutation] = useMutation(SIGNUP_MUTATION);
  const [values, setValues] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    ci: '',
    city: '',
    country: 'Uruguay',
    medalAchievement: 'level0'
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await signUpMutation({
      variables: {
        input: values
      }
    });
    history.push('/login');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleClick}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstname"
                variant="outlined"
                required
                fullWidth
                id="firstname"
                label="Nombre"
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastname"
                label="Apellido"
                name="lastname"
                onChange={handleChange}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                onChange={handleChange}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="ci"
                label="Cédula de identidad"
                id="ci"
                onChange={handleChange}
                autoComplete="current-ci"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seleccione una ciudad"
                name="city"
                required
                select
                onChange={handleChange}
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {cities.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="País"
                name="country"
                disabled
                variant="outlined"
                value="Uruguay"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrarse
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">
                <LinkUI href="#" variant="body2">
                  ¿Ya tienes una cuenta? Ingresa.
                    </LinkUI>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
