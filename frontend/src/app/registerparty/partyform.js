"use client";

import React, { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

import { encodeBytes32String } from "ethers";
import { election_contract } from "@ethereum/election";

export default function RegisterForm() {
  const [party, set_party] = useState({
    party_goals: [],
    party_name: "",
    party_first_name: "",
    party_last_name: "",
    party_leader_name: "",
    party_leader_ID: "",
    party_leader_email: "",
    party_description: "",
    party_vision: "",
  });
  const router = useRouter();
  const [goal, set_goal] = useState("");
  const [submitting, set_submitting] = useState(false);

  const leader_full_name = useMemo(
    () =>
      `${party.party_first_name || ""} ${party.party_last_name || ""}`
        .replace(/\s+/g, " ")
        .trim(),
    [party.party_first_name, party.party_last_name]
  );

  const handle_value_change = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    set_party((prev) => ({ ...prev, [key]: value }));
  };

  const handle_goal_addition = () => {
    const trimmed = (goal || "").trim();
    if (!trimmed) return;
    set_party((prev) => ({
      ...prev,
      party_goals: [...prev.party_goals, trimmed],
    }));
    set_goal("");
  };

  const remove_goal_at = (idx) => {
    set_party((prev) => ({
      ...prev,
      party_goals: prev.party_goals.filter((_, i) => i !== idx),
    }));
  };

  const handle_registration = async (event) => {
    event.preventDefault();
    if (!party.party_name) return alert("Party name is required.");
    if (!leader_full_name) return alert("Leader full name is required.");

    set_submitting(true);
    const payload = {
      ...party,
      party_leader_name: leader_full_name,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/parties",
        payload,
        { withCredentials: true }
      );
      if (response.status === 201) {
        try {
          const contract_instance = await election_contract();
          const party_id_string = response.data["party_id"];
          const party_id_bytes = encodeBytes32String(party_id_string);
          const tx = await contract_instance.add_verified_party(
            party_id_bytes,
            party_id_string
          );
          await tx.wait();
          router.push(`/party?id=${party_id_string}`);
        } catch (error) {
          console.error("Blockchain add failed:", error);
          alert(
            "Registration succeeded, but adding to the blockchain failed. You can try again later."
          );
        }
      } else {
        alert("Registration was unsuccessful.");
      }
    } catch (error) {
      console.error(error);
      alert("Request failed. Please check your input and try again.");
    } finally {
      set_submitting(false);
    }
  };

  const textFieldSx = {
    "& .MuiInputBase-root": {
      borderRadius: "14px",
      background: "color-mix(in oklab, var(--card) 35%, transparent)",
      border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
      color: "white",
      transition: "border-color 160ms ease, box-shadow 160ms ease",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "color-mix(in oklab, white 70%, transparent)",
    },
    "& label": { color: "color-mix(in oklab, white 85%, transparent)" },
    "& label.Mui-focused": { color: "white" },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiInputBase-root.Mui-focused": {
      boxShadow:
        "0 0 0 3px color-mix(in oklab, var(--primary) 28%, transparent)",
      borderColor: "color-mix(in oklab, var(--primary) 70%, white 10%)",
      background: "color-mix(in oklab, var(--card) 45%, transparent)",
    },
  };

  const primaryBtnSx = {
    backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary))",
    color: "white",
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: 700,
    "&:hover": {
      filter: "brightness(1.06)",
    },
  };

  const softBtnSx = {
    background: "color-mix(in oklab, white 12%, transparent)",
    color: "white",
    borderRadius: "12px",
    padding: "10px 14px",
    "&:hover": { background: "color-mix(in oklab, white 18%, transparent)" },
  };

  return (
    <Box component="form" onSubmit={handle_registration}>
      <Grid container spacing={3}>
        {/* Left column: form fields */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 800, mb: 1 }}
          >
            Party Information
          </Typography>
          <TextField
            fullWidth
            required
            margin="normal"
            id="party_name"
            label="Party Name"
            name="party_name"
            value={party.party_name}
            onChange={handle_value_change}
            placeholder="e.g., Forward Future Alliance"
            sx={textFieldSx}
          />

          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              Party Leader
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="party_first_name"
                  value={party.party_first_name}
                  onChange={handle_value_change}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="party_last_name"
                  value={party.party_last_name}
                  onChange={handle_value_change}
                  margin="normal"
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Party Leader ID"
                name="party_leader_ID"
                value={party.party_leader_ID}
                onChange={handle_value_change}
                margin="normal"
                placeholder="Government-issued ID"
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Party Leader Email"
                type="email"
                name="party_leader_email"
                value={party.party_leader_email}
                onChange={handle_value_change}
                margin="normal"
                placeholder="leader@example.com"
                sx={textFieldSx}
              />
            </Grid>
          </Grid>

          <Typography sx={{ color: "white", fontWeight: 700, mt: 3, mb: 1 }}>
            Party Vision
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Vision"
            name="party_vision"
            value={party.party_vision}
            onChange={handle_value_change}
            margin="normal"
            placeholder="Briefly describe the party's vision..."
            sx={textFieldSx}
          />

          <Typography sx={{ color: "white", fontWeight: 700, mt: 3, mb: 1 }}>
            Party Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="party_description"
            value={party.party_description}
            onChange={handle_value_change}
            margin="normal"
            placeholder="A longer description of the party..."
            sx={textFieldSx}
          />

          <Typography sx={{ color: "white", fontWeight: 700, mt: 3, mb: 1 }}>
            Party Goals
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="stretch"
          >
            <TextField
              fullWidth
              label="Add a goal"
              value={goal}
              onChange={(e) => set_goal(e.target.value)}
              placeholder="e.g., Improve public healthcare"
              sx={textFieldSx}
            />
            <Button
              type="button"
              onClick={handle_goal_addition}
              startIcon={<AddIcon />}
              sx={primaryBtnSx}
            >
              Add
            </Button>
          </Stack>

          {/* Goal chips */}
          {party.party_goals.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
              {party.party_goals.map((g, idx) => (
                <Chip
                  key={`${g}-${idx}`}
                  label={g}
                  onDelete={() => remove_goal_at(idx)}
                  deleteIcon={<DeleteIcon sx={{ color: "white" }} />}
                  sx={{
                    color: "white",
                    border:
                      "1px solid color-mix(in oklab, var(--border) 70%, transparent)",
                    background:
                      "color-mix(in oklab, var(--card) 40%, transparent)",
                    "& .MuiChip-deleteIcon": { color: "white/85" },
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 4 }}
          >
            <Tooltip title="Submit your party details for verification and on-chain registration">
              <span>
                <Button type="submit" disabled={submitting} sx={primaryBtnSx}>
                  {submitting ? "Registering..." : "Register Party"}
                </Button>
              </span>
            </Tooltip>
            <Button
              type="button"
              onClick={() =>
                set_party((p) => ({
                  ...p,
                  party_name: "",
                  party_first_name: "",
                  party_middle_name: "",
                  party_last_name: "",
                  party_leader_name: "",
                  party_leader_ID: "",
                  party_leader_email: "",
                  party_description: "",
                  party_vision: "",
                  party_goals: [],
                }))
              }
              sx={softBtnSx}
            >
              Clear
            </Button>
          </Stack>
        </Grid>

        {/* Right column: live preview */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 800, mb: 1 }}
          >
            Preview
          </Typography>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              background: "color-mix(in oklab, var(--card) 65%, transparent)",
              border:
                "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {party.party_name || "Party Name"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Leader: {leader_full_name || "—"}
              </Typography>
              <Divider
                sx={{
                  my: 2,
                  borderColor:
                    "color-mix(in oklab, var(--border) 70%, transparent)",
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Vision
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {party.party_vision || "—"}
              </Typography>
              <Divider
                sx={{
                  my: 2,
                  borderColor:
                    "color-mix(in oklab, var(--border) 70%, transparent)",
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Goals ({party.party_goals.length})
              </Typography>
              <Stack spacing={1}>
                {party.party_goals.length ? (
                  party.party_goals.map((g, i) => (
                    <Typography
                      key={`${g}-${i}`}
                      variant="body2"
                      sx={{ opacity: 0.9 }}
                    >
                      • {g}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Add goals to display them here.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
