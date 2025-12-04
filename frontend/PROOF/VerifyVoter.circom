pragma circom 2.0.0;


include "poseidon.circom";
include "eddsa.circom";
include "bitify.circom";


template VoterVerifier(LEVELS) {
    
    // Public Inputs

    // merkle tree inputs
    signal input merkle_root; // public
    // nullifier inputs
    signal input nullifier; // public


    // Private Inputs
    //basic inputs
    signal input official_id;

    signal input sid;
    // signature inputs
    signal input commitment;
    signal input A[256];
    signal input R8[256];
    signal input S[256];
    // merkle tree inputs
    signal input path[LEVELS];
    signal input path_indices[LEVELS];
    signal input actives[LEVELS];
    signal input leaf;

    
    
    component msg_bits = Num2Bits(254);
    msg_bits.in <== commitment;


    component ecds = EdDSAVerifier(254);
    for (var i=0; i < 254; i++) ecds.msg[i] <== msg_bits.out[i];

    for (var i=0; i < 256; i++) {
        ecds.A[i] <== A[i];
        ecds.R8[i] <== R8[i];
        ecds.S[i] <== S[i];
    }
    signal is_valid_signature <== 1;
    

    // 4. Verify Merkle inclusion
    // 4.1. Compute hID
    component hid_hasher = Poseidon(2);
    hid_hasher.inputs[0] <== official_id;
    hid_hasher.inputs[1] <== 1234; 
    signal hid <== hid_hasher.out;

    //4.2. Verify Existence in Merkle Tree
    component merkle_verifier = MerkleTreeChecker(LEVELS);
    merkle_verifier.leaf <== hid;
    merkle_verifier.root <== merkle_root;
    for (var i = 0; i < LEVELS; i++) {
        merkle_verifier.path[i] <== path[i];
        merkle_verifier.path_indices[i] <== path_indices[i];
        merkle_verifier.actives[i] <== actives[i];
    }
    
    // 5. Verify nullifier
    var NULLIFIER_TAG = 999999;
    component nullifier_hasher = Poseidon(2);
    nullifier_hasher.inputs[0] <== sid;
    nullifier_hasher.inputs[1] <== NULLIFIER_TAG;
    nullifier_hasher.out === nullifier;
}

template MerkleTreeChecker(LEVELS) {
    signal input leaf;
    signal input path[LEVELS];
    signal input path_indices[LEVELS];
    signal input actives[LEVELS];
    signal input root;

    signal current[LEVELS+1];
    component hashers[LEVELS];
    signal is_left[LEVELS];
    signal former_left_part[LEVELS];
    signal former_right_part[LEVELS];
    signal latter_left_part[LEVELS];
    signal later_right_part[LEVELS];
    current[0] <== leaf;

    signal valids[LEVELS];
    signal fillers[LEVELS];
    for (var i = 0; i < LEVELS; i++) {
        hashers[i] = Poseidon(2);
        is_left[i] <== 1 - path_indices[i];

        former_left_part[i] <== is_left[i] * path[i];
        former_right_part[i] <== (1-is_left[i]) * current[i];
        hashers[i].inputs[0] <== former_left_part[i] + former_right_part[i];

        latter_left_part[i] <== is_left[i] * current[i];
        later_right_part[i] <== (1-is_left[i]) * path[i];
        hashers[i].inputs[1] <== latter_left_part[i] + later_right_part[i];

        valids[i] <== hashers[i].out * actives[i];
        fillers[i] <== (1-actives[i]) * current[i];

        current[i+1] <== fillers[i] + valids[i];
    }
    root === current[LEVELS];
}


component main{public [merkle_root, nullifier]} = VoterVerifier(20);