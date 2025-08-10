import election_contract from "./election.js";
import { ethers } from "ethers";

async function get_host() {
  const host = await election_contract.host();
  console.log(host);
}

// get_host();
console.log();
