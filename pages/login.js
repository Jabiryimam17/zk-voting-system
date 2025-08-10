import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormInput,
  FormButton,
  Button,
  Container,
  Transition,
  Message,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useRouter } from "next/router";

import Layout from "../components/Layout.jsx";
import axios from "axios";

export default () => {
  const router = useRouter();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [unauthorized, set_unauthorized] = useState(false);
  const [is_loading, set_is_loading] = useState(false);
  const handle_login = async (event) => {
    set_is_loading(true);
    set_unauthorized(false);
    event.preventDefault();
    try {
      const response = await axios({
        url: "/api/login",
        method: "POST",
        data: { email: email, password: password },
      });
      if (response.status === 200) {
        router.push("/parties");
      } else {
        set_unauthorized(true);
      }
    } catch (error) {
      set_unauthorized(true);
    }
    set_is_loading(false);
  };
  return (
    <Layout title={"LOG IN"} authenticated={false}>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        <Form
          style={{
            width: "100%", // Adjust width as needed
            minWidth: "500px", // Minimum width to prevent form from getting too narrow
            maxWidth: "700px", // Maximum width to prevent form from getting too wide
          }}
        >
          <FormInput
            fluid
            label={"Email"}
            placeholder={"Email"}
            onChange={(event) => set_email(event.target.value)}
          />
          <FormInput
            fluid
            label={"Password"}
            placeholder={"Password"}
            onChange={(event) => set_password(event.target.value)}
          />
          <Transition visible={unauthorized} animation={"scale"} duration={500}>
            <Message negative>
              <Message.Header>
                Incorrect password or unverified email
              </Message.Header>
              <p>Please try again or verify your email</p>
            </Message>
          </Transition>
          <Button loading={is_loading} positive onClick={handle_login}>
            Log In
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};
