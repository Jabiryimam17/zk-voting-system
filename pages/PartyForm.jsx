import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { TextField, Box, Typography, Grid, Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import election_contract from "../ethereum/election.js";
export default () => {
  const [party, set_party] = useState({
    party_goals: [],
    party_name: "",
    party_first_name: "",
    party_middle_name: "",
    party_last_name: "",
    party_leader_name: "",
    party_leader_ID: "",
    party_leader_email: "",
    party_description: "",
    party_vision: "",
  });
  const router = useRouter();
  const [goal, set_goal] = useState("");
  const handle_goal_addition = (event) => {
    set_party((prev) => ({
      ...prev,
      party_goals: [...prev.party_goals, goal],
    }));
    set_goal("");
  };
  const handle_registration = async (event) => {
    event.preventDefault();
    party[
      "party_leader_name"
    ] = `${party["party_first_name"]} ${party["party_middle_name"]} ${party["party_last_name"]}`;
    try {
      const response = await axios({
        url: "/api/party_register",
        method: "POST",
        data: party,
      });
      if (response.status === 201) {
        try {
          const party_id_string = response.data["party_id"];
          const party_id_bytes =
            ethers.utils.formatBytes32String(party_id_string);
          const tx = await election_contract.add_verified_party(
            party_id_bytes,
            party_id_string
          );
          await tx.wait();
          router.push(`/party?id=${party_id_string}`);
        } catch (error) {
          console.error("Error while adding party to the blockchain: ", error);
          alert(
            "Registration was successful but failed to add party to the blockchain. Please try again later."
          );
        }
      } else {
        alert("Registration was unsuccessful!!!");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handle_value_change = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    set_party((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <Box component={"form"} sx={{ mt: 3 }} onSubmit={handle_registration}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="party_name"
        label="Party Name"
        name="party_name"
        autoFocus
        value={party["party_name"]}
        onChange={handle_value_change}
      />
      <Box>
        <Typography sx={{ mt: 2, mb: 1 }}>Party Leader</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={"First Name"}
              placeholder={"First Name"}
              variant={"outlined"}
              margin={"normal"}
              name={"party_first_name"}
              value={party["party_first_name"]}
              onChange={handle_value_change}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              placeholder="Middle Name"
              variant="outlined"
              margin="normal"
              value={party["party_middle_name"]}
              name={"party_middle_name"}
              onChange={handle_value_change}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              placeholder="Last Name"
              variant="outlined"
              margin="normal"
              value={party["party_last_name"]}
              name={"party_last_name"}
              onChange={handle_value_change}
            />
          </Grid>
        </Grid>
      </Box>

      <TextField
        fullWidth
        label={"Party Leader ID"}
        placeholder={"Leader ID"}
        margin={"normal"}
        variant={"outlined"}
        value={party["party_leader_ID"]}
        name={"party_leader_ID"}
        onChange={handle_value_change}
      />
      <TextField
        fullWidth
        label="Party Leader Email"
        placeholder="Party Leader Email"
        type="email"
        margin="normal"
        variant="outlined"
        value={party["party_leader_email"]}
        name={"party_leader_email"}
        onChange={handle_value_change}
      />
      <Typography sx={{ mt: 2, mb: 1 }}>Party Vision</Typography>
      <TextField
        fullWidth
        label={"Party Vision"}
        placeholder={"Party Vision"}
        multiline
        rows={2}
        margin={"normal"}
        variant={"outlined"}
        value={party["party_vision"]}
        name={"party_vision"}
        onChange={handle_value_change}
      />
      <Typography sx={{ mt: 2, mb: 1 }}>Party Description</Typography>
      <TextField
        fullWidth
        label={"Party Description"}
        placeholder={"Party Description"}
        multiline
        rows={4}
        margin={"normal"}
        variant={"outlined"}
        value={party["party_description"]}
        name={"party_description"}
        onChange={handle_value_change}
      />
      <Typography sx={{ mt: 2, mb: 1 }}>Party Goals</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          label={"Party Goal"}
          placeholder={"Party Goal"}
          onChange={(event) => set_goal(event.target.value)}
          value={goal}
        />
        <Button
          variant={"contained"}
          onClick={handle_goal_addition}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <Button
          sx={{ m: 2 }}
          variant={"contained"}
          type={"submit"}
          margin={"normal"}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};
