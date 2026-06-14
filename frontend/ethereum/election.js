import { ethers } from "ethers";
import { abi } from "./contracts/build/election_cont.js";
import ether from "./ether.js";

import axios from "axios";

export default function contact_interface(contract_address) {
  return new ethers.Contract(contract_address, abi, ether);
}

import { election_host } from "../config";

export async function election_contract() {
  const response = await axios.get(
    `${election_host}/api/users/contract_address`,
    {
      withCredentials: true,
    }
  );
  return contact_interface(response.data["address"]);
}
