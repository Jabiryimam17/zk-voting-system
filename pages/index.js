import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import {
  TableHeader,
  TableHeaderCell,
  Table,
  TableCell,
} from "semantic-ui-react";
import { TableRow } from "@mui/material";
import "semantic-ui-css/semantic.min.css";
import election_contract from "../ethereum/election.js";
import { ethers } from "ethers";
import axios from "axios";

export default () => {
  const [parties, set_parties] = useState([]);

  useEffect(() => {
    const fetch_parties = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "/api/parties",
        });
        const api_parties = response.data.message;
        const parties_id = await election_contract.fetch_parties();
        if (api_parties.length != parties_id.length) {
          throw new Error("Invalid Configurations");
        }
        const parties_map = new Map();
        api_parties.forEach((party) => parties_map.set(party["ID"], party));
        const total_supporters = await election_contract.total_participants();
        const full_parties = await Promise.all(
          parties_id.map(async (party_id) => {
            party_id = ethers.utils.parseBytes32String(party_id);
            const party = parties_map.get(party_id);
            if (!party) throw new Error("Missing Party");
            const supporters_big_number = await election_contract.parties(
              ethers.utils.formatBytes32String(party_id)
            );
            const supporters = supporters_big_number.supporters.toString();

            return {
              "Party Leader": party.party_leader_name,
              "Party Vision": party.party_vision,
              "Party Supporters": supporters,
              "Party Symbol": party.party_symbol,
              "Party Name": party.party_name,
              "Supporters In %":
                total_supporters > 0
                  ? ((parseInt(supporters) / total_supporters) * 100).toFixed(2)
                  : "0",
            };
          })
        );
        full_parties.sort((a, b) => {
          const a_supporters = parseInt(a["Party Supporters"]);
          const b_supporters = parseInt(b["Party Supporters"]);
          return b_supporters - a_supporters;
        });
        set_parties(full_parties);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch_parties();
    const interval_id = setInterval(fetch_parties, 900000);
    return () => clearInterval(interval_id);
  }, []);

  return (
    <Layout title={"ELECTION STATUS"} authenticated={false}>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Rank</TableHeaderCell>
            <TableHeaderCell>Party Name</TableHeaderCell>
            <TableHeaderCell>Party Leader</TableHeaderCell>
            <TableHeaderCell>Party Supporters</TableHeaderCell>
            <TableHeaderCell>Supporters In %</TableHeaderCell>
          </TableRow>
          {parties.map((party_status, index) => {
            return (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{party_status["Party Name"]}</TableCell>
                <TableCell>{party_status["Party Leader"]}</TableCell>
                <TableCell>{party_status["Party Supporters"]}</TableCell>
                <TableCell>{party_status["Supporters In %"]}%</TableCell>
              </TableRow>
            );
          })}
        </TableHeader>
      </Table>
    </Layout>
  );
};
