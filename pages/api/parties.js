import election_db from "../../database/createConnection";

export default async function parties(req, res) {
  switch (req.method) {
    case "GET": {
      const [parties] = await election_db.execute("SELECT * FROM parties");
      res.status(200).json({ message: parties });
    }
  }
}
