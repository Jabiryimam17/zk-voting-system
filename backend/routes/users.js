import express from "express";
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
  const [[user]] = await election_db.execute(
    "SELECT * FROM users WHERE email = ? AND password=? AND verified=?",
    [email, password, true],
  );
  if (user) {
    const token = generate_token({
      email: email,
      id: user["national_id"],
      admin: user["admin"] || false,
    });
    set_token_cookie(res, token);
    res.status(200).json({
      message: "You have successfully logged in",
    });
  } else {
    res.status(403).json({
      message: "You are unauthorized",
    });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, national_id } = req.body;

  const [user] = await election_db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  if (user.length > 0) {
    return res.status(400).json({ message: "You have already registered" });
  }
  console.log(req.body);
  const match_response = await axios({
    method: "POST",
    data: { national_id: national_id, email: email },
    url: "http://localhost:5000/verify_match",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (match_response.data["are_matched"]) {
    const code = nanoid(6);
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);
    await election_db.query(
      "INSERT INTO users (first_name, last_name, email, password, national_id, verification_code, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, password, national_id, code, expiry_time],
    );
    send_email(email, "Email Verification", format_email_message(code)).catch(
      console.error,
    );
    res.status(200).json({
      message: "National ID and email match.Now check your email",
      is_match: true,
    });
  } else {
    res.status(403).json({ message: "National ID and email don't match" });
  }
});

router.patch("/resend_code", async (req, res) => {
  const { email } = req.body;
  const decoded_email = decodeURIComponent(email.replace("%20", "+"));
  const [user] = await election_db.execute(
    "SELECT * FROM users WHERE email = ?",
    [decoded_email],
  );

  if (user.length > 0) {
    const code = nanoid(6);
    const expiry_time = new Date(Date.now() + 5 * 60 * 1000);
    await election_db.query(
      "UPDATE users SET verification_code = ?, expiry_date = ? WHERE email = ?",
      [code, expiry_time, decoded_email],
    );
    send_email(
      decoded_email,
      "Email Verification",
      format_email_message(code),
    ).catch(console.error);
    res.status(200).json({
      message: "Verification code resent successfully",
      success: true,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

router.post("/verify_email", async (req, res) => {
  const { email, code } = req.body;
  const decoded_email = decodeURIComponent(email.replace("%20", "+"));
  const date = new Date(Date.now());
  const [user] = await election_db.query(
    "SELECT * FROM users WHERE email = ? AND verification_code = ? AND expiry_date > ?",
    [decoded_email, code, date],
  );
  console.log(user);

  if (user.length > 0) {
    await election_db.query(
      "UPDATE users SET verified = true WHERE email = ?",
      [decoded_email],
    );
    res
      .status(200)
      .json({ message: "Email verified successfully", is_valid: true });
  } else {
    res.status(403).json({
      message: "Invalid verification code or Invalid email",
      is_valid: false,
    });
  }
});

router.post("/logout", with_auth, async (req, res) => {
  remove_token_cookie(res);
  res.status(200).json({ message: "You have successfully logged out" });
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
      res.status(400).json({ message: "Address already set" });
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

    res.status(200).json({
      message: "Contract address updated successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error writing address", error: err.message });
  }
});

router.get("/contract_address", (req, res) => {
  try {
    console.log("I am being asked");
    const file_content = fs.readFileSync(filePath, "utf-8");
    const addresses = JSON.parse(file_content);
    const address = addresses["election address"];

    res.status(200).json({
      message: "Contract address fetched successfully",
      address,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error reading address", error: err.message });
  }
});

export default router;
