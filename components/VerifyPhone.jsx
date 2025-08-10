import React, { useState } from "react";
import { Button, Modal, Header, Icon, Form, Input } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useRouter } from "next/router";
import "./VerificationPopup.module.css";
import axios from "axios";
import { ethers, BigNumber } from "ethers";
import election_contract from "../ethereum/election.js";
import decrypt from "../utilities/decryptit.js";
import gen_proof from "../PROOF/GenProof/GenProof.js";

async function fetch_user_data(id, password) {
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:5000/voter_info?id=${id}`,
    });
    const merkle_path = response.data["merkle_path"];
    const secrets = response.data["secret"];
    const decrypted_secret = await decrypt(
      secrets[1],
      password,
      secrets[3],
      secrets[2]
    );
    return { merkle_path, decrypted_secret };
  } catch (error) {
    console.error("Error fetching merkle path:", error);
  }
}

const VerificationPopup = (props) => {
  const router = useRouter();

  const [is_loading, set_is_loading] = useState(false);
  const [is_verified, set_is_verified] = useState(false);
  const [show_verification_modal, set_show_verification_modal] =
    useState(false);
  const [password, set_password] = useState("");
  const [official_id, set_official_id] = useState("");

  const handle_initial_submit = async () => {
    if (!official_id || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const { merkle_path, decrypted_secret } = await fetch_user_data(
        official_id,
        password
      );
      const inputs = {
        sid: decrypted_secret.sid,
        official_id: official_id,
        nullifier: decrypted_secret.nullifier,
        R8: decrypted_secret.R8,
        S: decrypted_secret.S,
        A: decrypted_secret.A,
        commitment: decrypted_secret.commitment,
        leaf: merkle_path.leaf,
        path: merkle_path.path,
        path_indices: merkle_path.path_indices,
        actives: merkle_path.actives,
        merkle_root: merkle_path.merkle_root,
      };
      console.log(merkle_path.merkle_root);

      await verify(inputs);
      set_show_verification_modal(true);
    } catch (error) {
      alert("Invalid ID or password.");
    }
  };
  const verify = async (inputs) => {
    set_is_loading(true);
    try {
      const { proof, publicSignals: public_signals } = await gen_proof(inputs);
      const a = [proof.pi_a[0], proof.pi_a[1]];
      const b = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ];
      const c = [proof.pi_c[0], proof.pi_c[1]];
      const public_inputs = [public_signals[0], public_signals[1]];
      const a_bn = a.map((x) => BigNumber.from(x));
      const b_bn = b.map((pair) => pair.map((x) => BigNumber.from(x)));
      const c_bn = c.map((x) => BigNumber.from(x));
      const public_inputs_bn = public_inputs.map((x) => BigNumber.from(x));
      const transaction = await election_contract.vote(
        public_inputs_bn[1],
        a_bn,
        b_bn,
        c_bn,
        public_inputs_bn,
        ethers.utils.formatBytes32String(props.party_id)
      );
      await transaction.wait();
      router.push("/");
    } catch (error) {
      console.log("error: ", error);
      alert("Verification failed. Please input the correct id and password.");
      set_is_verified(false);
    } finally {
      props.set_confirmed(false);
      set_is_loading(false);
    }
  };
  const handle_close = () => {
    props.set_confirmed(false);
    set_is_verified(false);
    set_show_verification_modal(false);
    set_official_id("");
    set_password("");
  };

  return (
    <div className="verification-container">
      {!show_verification_modal && (
        <Modal open={true} onClose={handle_close} size="tiny" closeIcon>
          <Header icon="user secret" content="Authenticate to Vote" />
          <Modal.Content>
            <Form>
              <Form.Field required>
                <label>National ID</label>
                <Input
                  placeholder="Enter your national ID"
                  value={official_id}
                  onChange={(e) => set_official_id(e.target.value)}
                />
              </Form.Field>
              <Form.Field required>
                <label>Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => props.set_confirmed(false)}>Cancel</Button>
            <Button primary onClick={handle_initial_submit}>
              Vote
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  );
};

export default VerificationPopup;
