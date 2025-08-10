import election_db from "../../database/CreateConnection";
export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const { email, code } = req.body;
      const decoded_email = decodeURIComponent(email.replace("%20", "+"));
      const date = new Date(Date.now());
      const [is_eligible_user] = await election_db.query(
        "SELECT * FROM users WHERE email=? AND verification_code=? AND expiry_date>?",
        [decoded_email, code, date]
      );
      if (is_eligible_user.length > 0) {
        await election_db.query(
          "UPDATE users set verified=true where email=?",
          [decoded_email]
        );
        res
          .status(200)
          .json({
            message: "Email is verified. Please continue..",
            is_valid: true,
          });
      } else {
        res
          .status(403)
          .json({ message: "Email Not available", is_valid: false });
      }
  }
}
