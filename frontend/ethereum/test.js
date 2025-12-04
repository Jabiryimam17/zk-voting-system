import { election_contract } from "./election.js";
import { ethers } from "ethers";

async function get_host() {
  console.log(await election_contract.fetch_parties());
  const host = await election_contract.host();
  console.log(host);
}

get_host();
console.log();
