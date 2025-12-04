import { groth16 } from "snarkjs";
async function main(private_inputs) {
  const { proof, publicSignals } = await groth16.fullProve(
    private_inputs,
    "/VerifyVoter_js/VerifyVoter.wasm",
    "/verifier.zkey"
  );
  const vkey = await fetch("/verification_key.json").then((res) => res.json());
  const verify = await groth16.verify(vkey, publicSignals, proof);
  console.log("Verify: ", verify ? "Success" : "Failed");
  return { proof, publicSignals };
}

export default main;
