import { ContractFactory } from "ethers";
import { abi, bytecode } from "./contracts/build/election_cont";
import ether from "@ethereum/ether";
export default async function deploy_contract(verifier_address) {
  const factory = new ContractFactory(abi, bytecode, ether);
  const contract = await factory.deploy(verifier_address);
  await contract.waitForDeployment();
  return contract.target;
}
