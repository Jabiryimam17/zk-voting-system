import { BrowserProvider, JsonRpcProvider } from "ethers";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

let ether;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const provider = new BrowserProvider(window.ethereum);
  async function request_permission() {
    await provider.send("eth_requestAccounts", []);
  }

  try {
    request_permission();
    const signer = await provider.getSigner();
    ether = signer;
    console.log("Web3 initialized with MetaMask!");
  } catch (error) {
    console.error("User denied account access: ", error);
  }
} else {
  const api = process.env.RPC_URL;
  console.log(api);
  ether = new JsonRpcProvider(api);
  console.log("Ether initialized with Infura!");
}

export default ether;
