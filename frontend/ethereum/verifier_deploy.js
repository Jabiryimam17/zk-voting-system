import ether from "./ether";
import verifier_contract from "./contracts/build/verifier_cont";
import { ContractFactory } from "ethers";

export default async function verifier_deploy() {
  const factory = new ContractFactory(
    verifier_contract.abi,
    verifier_contract.bytecode,
    ether
  );

  const contract = await factory.deploy();
  await contract.waitForDeployment();
  return contract.target;
}
