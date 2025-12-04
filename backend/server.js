import express from "express";
import cors from "cors";
import party_routes from "./routes/parties.js";
import users_routes from "./routes/users.js";
import dotenv from "dotenv";
import cookie_parser from "cookie-parser";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true, // allow cookies
  }),
);

app.use("/api/users", users_routes);

app.use("/api/parties", party_routes);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server is running on port ${port}`));
