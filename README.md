🇪🇹 ZK-Powered National Voting System (Ethiopia)
Zero-Knowledge, Encrypted Identity, and Blockchain-Verified Elections

A production-grade, cryptographically secure, national-scale voting system demonstrating expertise in Solidity, zk-SNARKs, Merkle trees, Chainlink oracles, and backend/frontend integration.

This project is engineered to function like a real-world governmental voting system, providing a showcase of advanced blockchain engineering, zero-knowledge proof systems, and security-first software design.

🔥 Developer Expertise Showcased in This Project

This system demonstrates professional-level experience across:

🟣 Blockchain & Solidity Engineering

Smart contract architecture (voting contract, verifier contract)

Chainlink oracle / external adapter integration

LINK token payments & oracle request lifecycle

On-chain/off-chain data verification

Gas-optimized Merkle root + proof handling

Modular Solidity contract design (verifier, voting, utilities)

🔵 Zero-Knowledge Proof Systems

Circom 2.x circuit design (Merkle inclusion, identity checks, nullifiers)

zk-SNARK Groth16 proving pipeline (snarkjs)

Witness generation, WASM execution, proof creation in frontend

Poseidon hash implementation (matching Circom & BN254 field)

Secure commitment schemes for anonymous voter validation

🟢 Cryptography

Client-side AES-256-GCM encryption (password-derived keys)

PBKDF2 key derivation

Encrypted identity blob storage

Hash-based nullifiers to prevent double-votes

Poseidon-based Merkle trees using ffjavascript & poseidon-lite

🟠 Backend & Infrastructure

Express API with JWT + session/cookie ISO security

MySQL integration for election, party, and user data

Clean ESM module structure

Full CORS, cookie, and API hardening for multi-app dev environments

🔴 Frontend

Next.js 15 App Router

Proof generation in-browser

Full cryptographic flow executed client-side

UI built with Tailwind CSS 4, Mantine, MUI

This portfolio project shows that you can build end-to-end cryptographic, blockchain, and full-stack systems — the exact skillset demanded by modern blockchain teams.

📦 Project Summary

Privacy-preserving voting built with:

Zero-knowledge proofs (Circom, snarkjs)

Encrypted national identity data (AES + Merkle tree)

Blockchain verification (ethers.js + Solidity contracts)

Off-chain verification via Chainlink Oracle networks

Fully client-side proof generation & password-based decryption

This system ensures:

No plaintext ID ever leaves the client

No server or contract can identify a voter

Every vote is linked to an authentic national identity

Double-voting is cryptographically impossible

Verification happens entirely on-chain & in zero-knowledge

🧩 Encrypted National ID Database Integration

This project integrates with a separate identity database system you built, which stores AES-encrypted citizen records inside a Poseidon Merkle tree.
This forms the cryptographic backbone for national-scale eligibility proof.

🔐 Identity Project (External)

Stores encrypted national ID data (AES-256-GCM)

Each encrypted entry → Poseidon Merkle tree leaf

Provides Merkle root + paths to the voting system

No plaintext PII anywhere

🧠 Client-Side Flow

User enters ID + password

Password → PBKDF2 → AES key

Identity secret, nullifier, and commitments encrypted client-side

During voting → decrypt locally using password

Provide decrypted values as private inputs to zk-circuit

🗳️ ZK Circuit Guarantees

Voter exists in the encrypted national database

Merkle root matches government reference

Voter identity stays fully hidden

Nullifier prevents double voting

Only ciphertext leaves the device

🖼 Architecture Diagram
                          Encrypted National DB
                ┌──────────────────────────────────────┐
                │ AES-Encrypted Citizen Records        │
                │ Poseidon Merkle Tree                 │
                │ Exposes: Merkle Root + Merkle Path   │
                └───────────────┬──────────────────────┘
                                │
                                ▼
           ┌────────────────────────────────────────────────────┐
           │                    Client (Next.js)                │
           │────────────────────────────────────────────────────│
           │ - Password → AES key                               │
           │ - Decrypt identity, nullifier                      │
           │ - Build witness, run WASM, generate proof          │
           └───────────────┬────────────────────────────────────┘
                           │ proof only
                           ▼
           ┌────────────────────────────────────────────────────┐
           │               Backend (Express + MySQL)            │
           │────────────────────────────────────────────────────│
           │ Stores encrypted blobs, parties, auth, sessions    │
           └───────────────┬────────────────────────────────────┘
                           │
                           ▼
           ┌────────────────────────────────────────────────────┐
           │                Blockchain (Sepolia)                │
           │────────────────────────────────────────────────────│
           │ Solidity Voting Contract                           │
           │ Solidity Verifier Contract (Groth16)               │
           │ Chainlink Oracle (eligibility checks)              │
           └────────────────────────────────────────────────────┘

🛠 Tech Stack

ZK / CRYPTOGRAPHY
Circom • snarkjs • poseidon-lite • ffjavascript • AES-256-GCM • PBKDF2 • Merkle trees

BLOCKCHAIN
Solidity • Chainlink • ethers.js v6 • LINK token • Sepolia

FRONTEND
Next.js 15 • React 19 • Tailwind CSS 4 • Mantine • MUI

BACKEND
Express 5 • MySQL2 • JWT • ESM modules

🔗 Blockchain Contracts & Oracle Integration

Your system includes:

✔ On-chain zk-SNARK Verifier (Groth16)

Generated from Circom using snarkjs.
Deployed to Sepolia via environment-configured addresses.

✔ Voting Contract

Tracks votes

Holds Merkle roots

Accepts zk-verified votes

Uses nullifiers to prevent double-votes

Accepts Chainlink-based eligibility data

✔ Chainlink Oracle Integration

Job IDs, request/response pipeline

External verification endpoints

LINK token transfers and consumption

✔ ethers.js Integration

The frontend and backend support full on-chain execution:

vote submission

nullifier check

transaction flow

oracle triggering

✔ Your Blockchain Experience (Explicit Portfolio Statement)

This project demonstrates hands-on experience in:

Building production-ready Solidity smart contracts

Designing zk-SNARK-verified voting flows

Implementing Poseidon Merkle commitments compatible with Circom

Integrating Chainlink oracles to bridge off-chain data

Managing on-chain verification pipelines (proof → contract → state transition)

Writing, verifying, and deploying contracts to Sepolia

Architecting systems combining frontend cryptography, backend APIs, and blockchain logic

Structuring multi-contract systems (Verifier + Application Logic)

This README is now perfectly shaped for hiring managers, blockchain teams, and technical interviewers.
