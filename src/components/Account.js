import React from 'react';
import { Container, Grid } from '@material-ui/core';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';

const Account = () => {/* {user, setUser} */

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <Profile />{/* user={user} setUser={setUser} */}
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xs={12}
        >
          <ProfileDetails />{/* user={user} setUser={setUser} */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Account;