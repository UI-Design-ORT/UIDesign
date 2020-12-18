import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useToken } from "../AuthProvider";

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
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

const USER_QUERY = gql`
  query User{
    user{
        firstname
        lastname
        city
        country
        email
        dni
        medalAchievement
    }
  }
`;

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

const ProfileDetails = () => {/* { user, setUser } */
  //nuevo
  const { token } = useToken();
  const { data, loading, refetch } = useQuery(USER_QUERY);
  React.useEffect(() => {
    refetch();
  }, [refetch, token]);
  const { user } = data || {};


  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    ci: "",
    city: "",
    country: ""
    /* firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    ci: user.dni,
    city: user.city,
    country: user.country */
  });

  if (loading) {
    return <p>Aguarde un momento...</p>
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const firstname = values.firstName;
    const lastname = values.lastName;
    const email = values.email;
    const city = values.city;
    const { data } = await updateUserMutation({
      variables: {
        input: {
          firstname,
          lastname,
          email,
          city
        }
      }
    });
    //setUser(data.updateUser);
  }

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleClick}
    >
      <Card>
        <CardHeader
          subheader="La información puede ser editada"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Nombre"
                name="firstname"
                onChange={handleChange}
                required
                value={user.firstname}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Apellido"
                name="lastname"
                onChange={handleChange}
                required
                value={user.lastname}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                onChange={handleChange}
                required
                value={user.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="C.I"
                name="ci"
                onChange={handleChange}
                value={user.ci}
                /*InputProps={{
                  readOnly: true
                }}*/
                disabled
                variant='outlined'
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="País"
                name="country"
                onChange={handleChange}
                disabled
                value={user.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Seleccione una ciudad"
                name="city"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={user.city}
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
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Guardar datos
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default ProfileDetails;