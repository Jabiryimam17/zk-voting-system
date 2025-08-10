

import { ethers } from "ethers";
import 'dotenv/config';  // Load .env

let ether;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    console.log("I am in the browser environment with MetaMask installed");
    ether = new ethers.providers.Web3Provider(window.ethereum);
    async function request_permission(){
        try {
            await window.ethereum.send( 'eth_requestAccounts',[]);
        } catch (error) {
            console.error("User denied account access");
        }
    }
    try {
        request_permission();
        console.log("Web3 initialized with MetaMask!");
    } catch (error) {
        console.error("User denied account access: ", error);
    }
}

else {
    ether = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/1f1788bcd8d14c68a184f3590be5193b");
    console.log("Ether initialized with Infura!");
}

export default ether;