import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Form,
  Button,
  Header,
  Message,
  Segment,
  Icon,
  Transition,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { motion } from "framer-motion";
import axios from "axios";
const VerificationPage = () => {
  const router = useRouter();
  const email = router.query.email;
  const url_encoded_email = encodeURIComponent(email);
  const [code, set_code] = useState("");
  const [verification_error, set_verification_error] = useState(false);
  const [is_loading, set_is_loading] = useState(false);
  const [is_verified, set_is_verified] = useState(false);
  const [resend_status, set_resend_status] = useState(null);

  const handle_submit = async (e) => {
    e.preventDefault();
    set_is_loading(true);
    set_verification_error(false);

    // Simulate verification API call
    try {
      const response = await axios({
        method: "POST",
        data: { email: url_encoded_email, code: code },
        url: "/api/verify_email",
      });
      if (response.data["is_valid"]) {
        set_is_verified((prev) => !prev);
      } else {
        set_verification_error(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      set_verification_error(true);
    } finally {
      set_is_loading(false);
    }
  };

  const handle_resend_code = async () => {
    // Implement resend code logic here
    set_resend_status("sending");
    try {
      const response = await axios({
        method: "PATCH",
        url: "/api/resend_code",
        data: { email: url_encoded_email },
      });
      if (response.data["success"]) {
        set_resend_status("success");
      } else {
        set_resend_status("error");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      set_resend_status("error");
    }
  };
  if (is_verified) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: "450px", margin: "80px auto", padding: "20px" }}
      >
        <Segment raised textAlign={"center"}>
          <Icon name="check circle" size="huge" color="green" />
          <Header as={"h2"} color={"green"} style={{ margin: "20px 0" }}>
            Verification Successful
          </Header>
          <p style={{ marginBotton: "30px" }}>
            Your email {email} has been successfully verified.
          </p>
          <Button
            primary
            size={"large"}
            onClick={router.push("/login")}
            animated={"fade"}
          >
            <Button.Content visible>Proceed to Login</Button.Content>
            <Icon name={"arrow right"} />
          </Button>
        </Segment>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "450px", margin: "80px auto", padding: "20px" }}
    >
      <Segment raised>
        <Header
          as="h2"
          textAlign="center"
          style={{ margin: "15px auto 30px auto" }}
        >
          Verification Code
        </Header>

        <p style={{ textAlign: "center", marginBottom: "15px" }}>
          Enter the code sent to your email address: <strong>{email}</strong>
        </p>
        <Form onSubmit={handle_submit} style={{ marginBottom: "15px" }}>
          <Form.Input
            fluid
            placeholder="Verification Code"
            value={code}
            onChange={(e) => {
              set_code(e.target.value);
              set_verification_error(false);
            }}
            error={verification_error}
            icon="lock"
            iconPosition="left"
          />
          <Transition
            visible={verification_error}
            animation={"scale"}
            duration={500}
          >
            <Message negative>
              <Message.Header>
                The code you entered is incorrect.
              </Message.Header>
              <p>Please try again.</p>
            </Message>
          </Transition>

          <Button
            primary
            fluid
            type="submit"
            loading={is_loading}
            disabled={!code || code.length < 6}
          >
            <Button.Content visible>Verify</Button.Content>
            <Button.Content hidden>
              <Icon name="check" />
            </Button.Content>
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Button
            basic
            onClick={handle_resend_code}
            loading={resend_status === "sending"}
            disabled={resend_status === "sending"}
          >
            Didn't receive a code? Resend Code
          </Button>
          <Transition
            visible={resend_status === "success"}
            animation="fade"
            duration={500}
          >
            <Message positive style={{ marginTop: "10px" }}>
              New code sent successfully!
            </Message>
          </Transition>

          <Transition
            visible={resend_status === "error"}
            animation="fade"
            duration={500}
          >
            <Message negative style={{ marginTop: "10px" }}>
              Failed to resend code. Please try again.
            </Message>
          </Transition>
        </div>
      </Segment>
    </motion.div>
  );
};

export default VerificationPage;
