import { ethers } from "ethers";
import abi from "./contracts/build/election_abi.js";
import ether from "./ether.js";

// Replace with your ACTUAL DEPLOYED CONTRACT ADDRESS
const contract_address = "0x00009689d20B47e0C3Ca5622801FdAdBd5b13c96";

// Initialize contract
let contract;
if (typeof window != "undefined") {
  contract = new ethers.Contract(contract_address, abi, ether.getSigner());
} else {
  contract = new ethers.Contract(contract_address, abi, ether);
}

export default contract;
