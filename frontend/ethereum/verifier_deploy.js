import ether from "./ether";
import { abi, bytecode } from "./contracts/build/verifier_cont";
import { ContractFactory } from "ethers";

export default async function verifier_deploy() {
  const factory = new ContractFactory(abi, bytecode, ether);

  const contract = await factory.deploy();
  await contract.waitForDeployment();
  return contract.target;
}
