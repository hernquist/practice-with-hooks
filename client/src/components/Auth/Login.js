import React from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      name
      picture
      email
    }
  }
`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log("idToken:", idToken);
    const client = new GraphQLClient("http://localhost:4000/playground", {
      headers: { authorization: idToken }
    });
    console.log("client", client);
    const data = await client.request(ME_QUERY);
    console.log("data", { data });
  };

  return (
    <GoogleLogin
      clientId={process.env.OAUTH_CLIENT_ID}
      onSuccess={onSuccess}
      isSignedIn={true}
    />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
