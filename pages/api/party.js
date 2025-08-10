import election_db from "../../database/CreateConnection";
export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const [[party]] = await election_db.execute(
        "SELECT * FROM parties where ID=?",
        [req.query.party_id]
      );
      party["party_symbol"] = "http://localhost:3000/images/download.png";
      return res.status(200).json({ party: party });
    case "POST":
      const [[party_info]] = await election_db.execute(
        "SELECT party_name,party_leader_name, short_name FROM parties where short_name=?",
        [req.body.party_SN]
      );
      if (!party_info) {
        return res.status(404).json({ message: "Party not found" });
      }
      return res.status(200).json({ party: party_info });
  }
}
