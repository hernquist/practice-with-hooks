import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://prac-with-hooks.herokuapp.com/graphql"
    : "http://localhost:4000/playground";

export const useClient = () => {
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;

    setIdToken(token);
  }, []);

  return new GraphQLClient(BASE_URL, { headers: { authorization: idToken } });
};
