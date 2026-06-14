import { ContractFactory } from "ethers";
import { abi, bytecode } from "./contracts/build/election_cont";
import ether from "@ethereum/ether";
export default async function deploy_contract(verifier_address, merkle_root) {
  const factory = new ContractFactory(abi, bytecode, ether);
  const contract = await factory.deploy(verifier_address, merkle_root);
  await contract.waitForDeployment();
  return contract.target;
}
