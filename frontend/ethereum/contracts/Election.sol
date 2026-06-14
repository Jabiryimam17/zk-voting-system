// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./Verifier.sol";
import {PartyManager} from "./PartyManager.sol";
import {TreasureManager} from "./TreasureManager.sol";


contract Election is PartyManager, TreasureManager {

    Groth16Verifier public verifier;
    mapping(uint256=>bool) public nullifiers;
    bytes32 public merkle_root;
    uint32 public total_participants;

    constructor(address verifier_address, bytes32 _merkle_root) PartyManager() {
        verifier = Groth16Verifier(verifier_address);
        merkle_root = _merkle_root;
    }

    function set_merkle_root(bytes32 _merkle_root) public onlyOwner {
        merkle_root=_merkle_root;
    }

    function vote(
        uint256 nullifier,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input, // [merkle root, nullifier]
        bytes32 id_hash
    ) public {
        require(!nullifiers[nullifier], "Already voted");
        require(parties[id_hash].verified,"Invalid Party");
        require(input[0] == uint256(merkle_root));
        require(verifier.verifyProof(a,b,c,input),"Invalid Proof");
        nullifiers[nullifier] = true;
        parties[id_hash].supporters++;
        total_participants++;
    }


}