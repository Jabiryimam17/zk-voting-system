import express from "express";
import election_db from "../database/CreateConnection.js";
import axios from "axios";
import { with_auth } from "../middlewares/auth.js";
const router = express.Router();
router.use(with_auth);
router.get("/", async (req, res) => {
  const [parties] = await election_db.execute("SELECT * FROM parties");
  res.status(200).json({
    message: "Parties fetched successfully",
    parties: parties,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [party] = await election_db.execute(
    "SELECT * FROM parties WHERE id=?",
    [id],
  );
  res.status(200).json({
    message: "Party fetched successfully",
    party: party,
  });
});

router.post("/", async (req, res) => {
  const {
    party_name,
    party_leader_name,
    party_leader_email,
    party_leader_ID,
    party_goals,
    party_description,
    party_vision,
  } = req.body;
  const [is_valid_leader] = await election_db.execute(
    "SELECT * FROM users WHERE email=? AND verified=? AND national_id=?",
    [party_leader_email, true, party_leader_ID],
  );
  if (is_valid_leader.length > 0) {
    try {
      const response = await axios({
        method: "POST",
        data: {
          email: party_leader_email,
          national_id: party_leader_ID,
          party_name: party_name,
          party_leader_name: party_leader_name,
        },
        url: "http://localhost:5000/verify_party",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data["party_exist"]) {
        const sn = response.data["SN"];
        await election_db.execute(
          "INSERT INTO parties (ID,party_name, party_leader_name, leader_ID,leader_email,party_goals, party_description, party_vision, short_name) VALUES (?,?,?,?,?,?,?,?,?) ",
          [
            response.data["id"],
            party_name,
            party_leader_name,
            party_leader_ID,
            party_leader_email,
            party_goals,
            party_description,
            party_vision,
            sn,
          ],
        );
        res.status(201).json({
          message: "Party registered successfully!",
          party_id: response.data["id"],
          short_name: sn,
        });
      } else {
        res.status(400).json({ message: "Party verification failed!" });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

export default router;
