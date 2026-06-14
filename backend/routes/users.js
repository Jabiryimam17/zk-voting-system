import express from "express";

const national_id_host =
  process.env.NATIONAL_ID_HOST || "http://localhost:5000";
import {
  generate_token,
  set_token_cookie,
  verify_token,
  remove_token_cookie,
} from "../utilities/jwt.js";
import election_db from "../database/CreateConnection.js";
import { nanoid } from "nanoid";
import axios from "axios";
import nodemailer from "nodemailer";
import { send_email, format_email_message } from "../utilities/sendemail.js";
const router = express.Router();
import { with_auth } from "../middlewares/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const nanoid = customAlphabet("1234567890", 6);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await election_db.query(
    "SELECT * FROM users WHERE email = $1 AND password=$2 AND verified=$3",
    [email, password, true],
  );
  const user = result.rows[0];
  if (user) {
    const token = generate_token({
      email: email,
      id: user["national_id"],
      admin: user["admin"] || false,
    });
    set_token_cookie(res, token);
    return res.status(200).json({
      message: "You have successfully logged in",
    });
  } else {
    return res.status(403).json({
      message: "You are unauthorized",
    });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, national_id } = req.body;

  const result = await election_db.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  const user = result.rows;
  if (user.length > 0) {
    return res.status(400).json({ message: "You have already registered" });
  }
  const match_response = await axios({
    method: "POST",
    data: { national_id: national_id, email: email },
    url: `${national_id_host}/verify_match`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (match_response.data["are_matched"]) {
    const code = nanoid(6);
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);
    await election_db.query(
      "INSERT INTO users (first_name, last_name, email, password, national_id, verification_code, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [first_name, last_name, email, password, national_id, code, expiry_time],
    );
    send_email(email, "Email Verification", format_email_message(code)).catch(
      console.error,
    );
    return res.status(200).json({
      message: "National ID and email match.Now check your email",
      is_match: true,
    });
  } else {
    return res
      .status(403)
      .json({ message: "National ID and email don't match" });
  }
});

router.patch("/resend_code", async (req, res) => {
  const { email } = req.body;
  const decoded_email = decodeURIComponent(email.replace("%20", "+"));
  const result = await election_db.query(
    "SELECT * FROM users WHERE email = $1",
    [decoded_email],
  );
  const user = result.rows;

  if (user.length > 0) {
    const code = nanoid(6);
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);
    await election_db.query(
      "UPDATE users SET verification_code = $1, expiry_date = $2 WHERE email = $3",
      [code, expiry_time, decoded_email],
    );
    send_email(
      decoded_email,
      "Email Verification",
      format_email_message(code),
    ).catch(console.error);
    return res.status(200).json({
      message: "Verification code resent successfully",
      success: true,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

router.post("/verify_email", async (req, res) => {
  const { email, code } = req.body;
  const decoded_email = decodeURIComponent(email.replace("%20", "+"));
  const date = new Date(Date.now());
  const result = await election_db.query(
    "SELECT * FROM users WHERE email = $1 AND verification_code = $2 AND expiry_date > $3",
    [decoded_email, code, date],
  );
  const user = result.rows;

  if (user.length > 0) {
    await election_db.query(
      "UPDATE users SET verified = true WHERE email = $1",
      [decoded_email],
    );
    return res
      .status(200)
      .json({ message: "Email verified successfully", is_valid: true });
  } else {
    return res.status(403).json({
      message: "Invalid verification code or Invalid email",
      is_valid: false,
    });
  }
});

router.post("/logout", with_auth, async (req, res) => {
  remove_token_cookie(res);
  return res.status(200).json({ message: "You have successfully logged out" });
});

const filePath = path.join(__dirname, "..", "utilities", "address.json");

router.post("/contract_address", with_auth, async (req, res) => {
  try {
    if (!req.admin) return res.status(403).json({ message: "Unauthorized" });
    const { election_address, verifier_address } = req.body;

    if (!election_address) {
      return res.status(400).json({ message: "Address is required" });
    }
    const file_content = fs.readFileSync(filePath, "utf-8");
    const contents = JSON.parse(file_content);
    if (contents["merkle setup"])
      return res.status(400).json({ message: "Address already set" });
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          "election address": election_address,
          "verifier address": verifier_address,
          "merkle setup": true,
        },
        null,
        2,
      ),
      "utf-8",
    );

    return res.status(200).json({
      message: "Contract address updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error writing address", error: err.message });
  }
});

router.get("/contract_address", (req, res) => {
  try {
    const file_content = fs.readFileSync(filePath, "utf-8");
    const addresses = JSON.parse(file_content);
    const address = addresses["election address"];

    return res.status(200).json({
      message: "Contract address fetched successfully",
      address,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error reading address", error: err.message });
  }
});

export default router;
