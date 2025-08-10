"use client";

import React, { useEffect, useState } from "react";
import _ from "lodash";
import Layout from "../components/Layout";
import {
  ItemMeta,
  ItemImage,
  ItemHeader,
  ItemGroup,
  ItemExtra,
  ItemDescription,
  Segment,
  ItemContent,
  Icon,
  Image,
  Item,
  Label,
  Button,
  Transition,
  TransitionGroup,
  List,
  ListItem,
  ListContent,
  Container,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useRouter } from "next/router";

export default (props) => {
  const router = useRouter();
  const [parties, set_parties] = useState([]);
  const [expanded_index, set_expanded_index] = useState(null);
  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await fetch("/api/parties");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        set_parties(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetch_data();
  }, []);
  const handle_review_goals = (index) => {
    set_expanded_index(expanded_index === index ? null : index);
  };
  const handle_party_vote = (index) => {
    router.push(`/party?id=${parties[index]["ID"]}`);
  };
  const PartyItems = parties.map((party, index) => {
    return (
      <Item key={index}>
        <ItemImage
          size={"tiny"}
          src={"http://localhost:3000/images/download.png"}
        ></ItemImage>
        <ItemContent>
          <Container style={{ float: "left", width: "80%" }}>
            <ItemHeader style={{ marginBottom: "10px", fontSize: "1.5em" }}>
              {party["party_name"]}
            </ItemHeader>
            <ItemMeta>
              <span>{party["party_leader_name"]}</span>
            </ItemMeta>
            <ItemMeta style={{ marginTop: "30px" }}>
              <span>{party["party_vision"]}</span>
              {/*</ItemMeta>*/}
              {/*<ItemDescription>{party["party_description"]}</ItemDescription>*/}
              {/*<ItemMeta>*/}
              <div style={{ marginTop: "20px" }}>
                <Button
                  content={
                    expanded_index === index ? "Hide Goals" : "View Goals"
                  }
                  primary
                  onClick={() => handle_review_goals(index)}
                />
              </div>
            </ItemMeta>
            <ItemMeta>
              <Transition.Group
                as={List}
                duration={200}
                divided
                size={"large"}
                animation="slide down"
              >
                {expanded_index === index &&
                  party["party_goals"].map((goal, goal_index) => (
                    <Segment inverted style={{ width: "100%" }}>
                      <ListItem key={goal_index}>
                        <ListContent header={_.startCase(goal)} />
                      </ListItem>
                    </Segment>
                  ))}
              </Transition.Group>
            </ItemMeta>
          </Container>

          <Container
            style={{ float: "right", marginTop: "0.5em", width: "20%" }}
          >
            <Button
              color="orange"
              content="Unverified"
              icon="warning sign"
              labelPosition="right"
            />
            <Button
              style={{ marginTop: "50px" }}
              content="Vote This Party"
              color={"grey"}
              onClick={() => {
                handle_party_vote(index);
              }}
            />
          </Container>
        </ItemContent>
      </Item>
    );
  });
  return (
    <Layout title={"PARTIES"} authenticated={true}>
      <ItemGroup divided style={{ marginTop: "25px" }}>
        {PartyItems}
      </ItemGroup>
    </Layout>
  );
};
