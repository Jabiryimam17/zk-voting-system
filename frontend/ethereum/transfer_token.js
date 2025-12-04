import { ethers } from "ethers";
import ether from "./ether.js";
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];
export default async function transfer_token(LINK_ADDRESS, amount, to) {
  const link = new ethers.Contract(LINK_ADDRESS, ERC20_ABI, ether);
  const tx = await link.transfer(to, ethers.parseUnits(amount.toString(), 18));
  await tx.wait();
}
