import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Header from './components/Header';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Products from './ProductsCatalog';
import MyCart from './components/MyCart';
import Account from './components/Account';
import styled from 'styled-components';
import ProductUpload from './components/ProductUpload';
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./AuthProvider";
import client from "./apollo";

function App() {
  const [user, setUser] = React.useState();
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Router>
          <Header user={user} setUser={setUser} />
          <Container>
            <Route path="/login">
              <SignIn setUser={setUser} />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/products">
              <Products />
            </Route>
            <Route path="/myCart">
              <MyCart />
            </Route>
            <Route path="/productUpload">
              <ProductUpload />
            </Route>
            {/* <PrivateRoute path="/account"> */}{/* user={user} */}
            {/* <Account /> */}{/* user={user} setUser={setUser} */}
            {/* </PrivateRoute> */}
            <Route path="/account">
              <Account />
            </Route>
          </Container>
        </Router>
      </ApolloProvider>
    </AuthProvider>
  );
}

const PrivateRoute = ({ user, ...props }) => user ? <Route {...props} /> : <Redirect to="/login" />;
const Container = styled.div`
  padding: 24px;
`;

export default App;
