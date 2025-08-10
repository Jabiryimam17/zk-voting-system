import election_db from "../../database/CreateConnection";
import { generate_token, set_token_cookie } from "../../utilities/jwt.js";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      const { email, password } = req.body;
      const [[user]] = await election_db.execute(
        "SELECT * FROM users where email=? AND password=? AND verified=?",
        [email, password, true]
      );
      if (user.verified) {
        const token = generate_token({
          email: email,
          id: user["national_id"],
        });
        set_token_cookie(res, token);
        res.status(200).json("You have successfully logged in");
      } else {
        res.status(403).json("You are unauthorized");
      }
    }
  }
}
