import { BrowserProvider, JsonRpcProvider } from "ethers";
import "dotenv/config"; // Load .env

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
  ether = new JsonRpcProvider(
    "https://sepolia.infura.io/v3/1f1788bcd8d14c68a184f3590be5193b"
  );
  console.log("Ether initialized with Infura!");
}

export default ether;
