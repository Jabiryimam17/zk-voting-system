import { ethers } from "ethers";
import { abi } from "./contracts/build/election_cont.js";
import ether from "./ether.js";

import axios from "axios";

export default function contact_interface(contract_address) {
  return new ethers.Contract(contract_address, abi, ether);
}

const election_host =
  process.env.NEXT_PUBLIC_ELECTION_HOST || "http://localhost:8080";

export async function election_contract() {
  const response = await axios.get(
    `${election_host}/api/users/contract_address`,
    {
      withCredentials: true,
    }
  );
  return contact_interface(response.data["address"]);
}
