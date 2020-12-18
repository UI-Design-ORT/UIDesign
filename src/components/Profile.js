import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  useRadioGroup
} from '@material-ui/core';
import { gql, useMutation, useQuery } from '@apollo/client';
import logo from '../assets/0productos.png';
import logo1 from '../assets/1producto.png';
import logo2 from '../assets/5productos.png';
import logo3 from '../assets/10productos.png';
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
    user {
        firstname
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

const useStyles = makeStyles(() => ({
  avatar: {
    height: 100,
    width: 100
  },
  input: {
    display: 'none',
    margin: '8px',
    minWidth: '150px',
  }
}));

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const Profile = () => {/* { user, setUser } */
  const classes = useStyles();

  const [medal, setMedal] = React.useState({
    achievement: 'No has subido productos',
    logo: logo
  })

  const { token } = useToken();
  const { data, loading, refetch } = useQuery(USER_QUERY);
  React.useEffect(() => {
    refetch();
  }, [refetch, token]);
  const { user } = data || {};

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const [avatar, setAvatar] = React.useState({
    avatar: "user.profileImage",
    raw: ''
  })

  if (loading) {
    return <p>Aguarde un momento...</p>
  }
  //setUser(userData);
  console.log('usuario: ' + user.firstname);


  if (user?.medalAchievement === 'level1') {
    setMedal({
      achievement: 'Has subido al menos 1 producto!',
      logo: logo1
    })
  } else if (user?.medalAchievement === 'level2') {
    setMedal({
      achievement: '5 productos subidos o mas!',
      logo: logo2
    })
  } else if (user?.medalAchievement === 'level3') {
    setMedal({
      achievement: '10 productos subidos o mas!',
      logo: logo3
    })
  }

  const handleImageChange = async (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      const result = await toBase64(file).catch(e => Error(e));
      setAvatar({
        avatar: URL.createObjectURL(event.target.files[0]),
        raw: result
      });
    }
    const { data } = await updateUserMutation({
      variables: {
        input: {
          profileImage: avatar.raw
        }
      }
    })
    //setUser(data.updateUser);
    console.log("Imagen seleccionada: " + avatar.raw);
  }


  return (
    <Card>
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          {avatar.avatar ? <Avatar className={classes.avatar} src={avatar.avatar} /> : <Avatar>?</Avatar>}
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {`${user.firstname} ${user.lastname}`}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.city}, ${user.country}`}
          </Typography>
          <Avatar src={medal.logo}></Avatar>
          <Typography
            color="textSecondary"
            variant="body1">{medal.achievement}
          </Typography>
          { }
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            color="primary"
            fullWidth
            variant="text"
          >
            Subir una foto
          </Button>
        </label>

      </CardActions>
    </Card>
  );
};

export default Profile;