import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Card,
  Image,
  Divider,
  Label,
  Button,
  Modal,
  Icon,
  Segment,
  Grid,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import VerifyPhone from "../components/VerifyPhone";
import axios from "axios";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const PartyProfile = () => {
  const [national_id, set_national_id] = useState("");
  const router = useRouter();
  const [party_id, set_party_id] = useState("");
  const [open_confirm, set_open_confirm] = useState(false);
  const [confirmed, set_confirmed] = useState(false);
  const [party, set_party] = useState({
    party_leader_name: "",
    party_goals: [],
    party_description: "",
    party_vision: "",
    party_name: "",
    party_symbol: "http://localhost:3000/images/download.png",
    party_shortname: "",
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth_token = cookies.get("token");

      if (auth_token) {
        try {
          const decoded_token = jwtDecode(auth_token);
          set_national_id(decoded_token["id"] || "");
          console.log("National ID:", decoded_token["id"]);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetch_party = async () => {
      try {
        set_party_id(router.query["id"]);
        const response = await axios.get(
          `/api/party?party_id=${router.query["id"]}`
        );
        if (response.status === 200) {
          set_party(response.data.party);
        } else {
          console.error("Failed to fetch party data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (router.query["id"] !== undefined) {
      fetch_party();
    }
  }, [router.query["id"]]);

  return (
    <Layout title={"Party Profile"} authenticated={true}>
      <Container style={{ padding: "2em", maxWidth: "800px" }}>
        {/* Circular Party Logo */}
        <Grid centered>
          <Grid.Row>
            <Image
              src={"http://localhost:3000/images/download.png"}
              circular
              size="medium"
              centered
              style={{
                marginBottom: "2em",
                border: "4px solid #2185d0",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
              onError={(e) => {
                e.target.src =
                  "https://react.semantic-ui.com/images/wireframe/square-image.png";
              }}
            />
          </Grid.Row>
        </Grid>

        {/* Main Content Card */}
        <Card fluid>
          <Card.Content textAlign="center">
            <Header
              as="h1"
              style={{ fontSize: "2.5em", marginBottom: "0.5em" }}
            >
              {party["party_name"]}
            </Header>

            <Header as="h3" style={{ marginTop: "0" }}>
              <Icon name="user" />
              <Header.Content>
                Party Leader: {party["party_leader_name"]}
              </Header.Content>
            </Header>
          </Card.Content>

          <Card.Content>
            <p style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
              {party["party_description"]}
            </p>

            <Divider section />

            <Header as="h3">Core Principles</Header>
            <div style={{ margin: "1em 0" }}>
              {party["party_goals"].map((goal, index) => (
                <Label
                  key={index}
                  color="blue"
                  size="large"
                  style={{ margin: "0.3em" }}
                >
                  {goal}
                </Label>
              ))}
            </div>
          </Card.Content>

          <Card.Content extra>
            {/* Narrower Centered Vision Box */}
            <Grid centered>
              <Grid.Column mobile={16} tablet={12} computer={10}>
                <Segment padded="very" style={{ margin: "1em 0" }}>
                  <Header as="h2" icon textAlign="center">
                    <Icon name="eye" />
                    Our Vision
                    <Header.Subheader style={{ marginTop: "0.5em" }}>
                      {party["party_vision"]}
                    </Header.Subheader>
                  </Header>
                </Segment>
              </Grid.Column>
            </Grid>

            {/* Narrower Centered Vote Button */}
            <Grid centered>
              <Grid.Column mobile={16} tablet={9} computer={6}>
                <Button
                  color="green"
                  size="huge"
                  fluid
                  onClick={() => set_open_confirm(true)}
                  style={{
                    marginTop: "0.5em",
                    marginLeft: "1em",
                    marginBottom: "1em",
                    width: "80%", // More compact vertical padding
                  }}
                >
                  <Icon name="check circle" />
                  Vote for {party["party_name"]}
                </Button>
              </Grid.Column>
            </Grid>
          </Card.Content>
        </Card>

        {/* Voting Confirmation Modal */}
        <Modal
          open={open_confirm}
          onClose={() => set_open_confirm(false)}
          size="tiny"
          dimmer="blurring"
        >
          <Header icon="warning sign" content="Confirm Your Vote" />
          <Modal.Content>
            <p>
              Are you sure you want to vote for{" "}
              <strong>{party["Party Name"]}</strong>?
            </p>
            <p style={{ color: "red" }}>
              <Icon name="warning circle" />
              This decision cannot be changed after submission.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => set_open_confirm(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" onClick={() => set_confirmed(true)}>
              <Icon name="checkmark" /> Confirm
            </Button>
          </Modal.Actions>
        </Modal>
        {confirmed && (
          <VerifyPhone party_id={party_id} set_confirmed={set_confirmed} />
        )}
      </Container>
    </Layout>
  );
};

export default PartyProfile;
