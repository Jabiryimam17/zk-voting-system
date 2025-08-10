import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormInput,
  FormButton,
  Button,
  Container,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import Layout from "../components/Layout.jsx";
import axios from "axios";
import { useRouter } from "next/router";

export default () => {
  const router = useRouter();
  const [user, set_user] = useState({
    "First Name": "",
    "Last Name": "",
    Email: "",
    Password: "",
    "National ID": "",
  });
  const handle_change = (event) => {
    const { name, value } = event.target;
    set_user((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handle_user_registration = async (event) => {
    event.preventDefault();

    try {
      const response = await axios({
        method: "POST",
        data: user,
        url: "/api/register_user",
      });
      if (response.data["is_match"]) {
        const email = user["Email"];
        router.push(`/verifyemail?email=${email}`);
      } else {
        console.error(response.data["message"]);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  return (
    <Layout title={"REGISTER"} authenticated={false}>
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
          <FormGroup widths={"equal"}>
            <FormInput
              onChange={handle_change}
              fluid
              label={"First Name"}
              placeholder={"First Name"}
              name={"First Name"}
              value={user["First Name"]}
            />
            <FormInput
              onChange={handle_change}
              fluid
              label={"Last Name"}
              placeholder={"Last Name"}
              name={"Last Name"}
              value={user["Last Name"]}
            />
          </FormGroup>
          <FormInput
            onChange={handle_change}
            fluid
            label={"Email"}
            placeholder={"Email"}
            value={user["Email"]}
            name={"Email"}
            required
          />
          <FormInput
            onChange={handle_change}
            fluid
            label={"Password"}
            placeholder={"Password"}
            required
            name={"Password"}
            value={user["Password"]}
          />
          <FormInput
            onChange={handle_change}
            fluid
            label={"National ID"}
            placeholder={"National ID"}
            name={"National ID"}
            value={user["National ID"]}
            required
          />
          <Button primary onClick={handle_user_registration}>
            Sign In
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};
