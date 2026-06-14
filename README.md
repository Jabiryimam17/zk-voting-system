# ZK‑Powered National Voting System (Portfolio Demonstration)

Privacy‑preserving, end‑to‑end cryptographic voting built with zk‑SNARKs, encrypted national‑ID data, and on‑chain verification. This repository showcases production‑grade blockchain, cryptography, and full‑stack skills across Solidity, Chainlink, Circom/snarkjs, Next.js, and Express/PostgreSQL.

## 🔥 Developer Expertise Showcased

🟣 Blockchain & Solidity Engineering
- Smart contract architecture (separate verifier, voting logic, utilities)
- Chainlink oracle integration and LINK token flows
- On‑chain/off‑chain verification patterns
- Gas‑aware Merkle root/proof handling

🔵 Zero‑Knowledge Proofs
- Circom 2.x circuits (Merkle inclusion, identity checks, nullifiers)
- Groth16 proving pipeline with snarkjs (WASM + witness generation)
- Poseidon hash compatibility between Circom and BN254 field

🟢 Cryptography
- AES‑256‑GCM client‑side encryption (password‑derived via PBKDF2)
- Encrypted identity blobs; commitment/nullifier schemes
- Poseidon‑based Merkle trees using ffjavascript & poseidon‑lite

🟠 Backend & Infrastructure
- Express API (ESM), JWT sessions/cookies, CORS hardening
- PostgreSQL integration for elections, parties, users

🔴 Frontend
- Next.js 15 App Router, React 19, Tailwind CSS 4, Mantine/MUI
- In‑browser witness building and proof generation


## 📦 Project Summary
This system enables anonymous, eligibility‑verified voting where:
- No plaintext identity leaves the client.
- Every vote is linked to a real identity (via encrypted database + Merkle proofs) without revealing who.
- Double‑voting is prevented using nullifiers.
- Verification happens on‑chain and in zero knowledge.


## 🧩 Encrypted National ID Database (External System)
- Stores AES‑256‑GCM encrypted citizen records.
- Each encrypted entry is a Poseidon leaf in a Merkle tree.
- Provides the Merkle root and per‑voter Merkle paths to the voting client.


## 🧠 Client‑Side Flow
1) User enters ID + password
- PBKDF2 derives AES key → decrypts identity secret + nullifier seed.

2) Build zk witness in browser
- Provide decrypted private inputs + Merkle path + root to the circuit.

3) Generate proof (WASM + snarkjs)
- Send only proof and public inputs (root, nullifier, etc.) to chain.


## 🗳️ ZK Circuit Guarantees
- Voter exists in the encrypted national database (Merkle inclusion).
- Government reference root matches.
- Identity remains hidden; only commitments are public.
- Nullifier prevents double‑voting.


## 🖼 Architecture Overview
```
Encrypted National DB
┌─────────────────────────────────────┐
│ AES Encrypted Records               │
│ Poseidon Merkle Tree                │
│ Exposes: Root + Path                │
└──────────────┬──────────────────────┘
               │
               ▼
Client (Next.js)
┌─────────────────────────────────────┐
│ PBKDF2 → AES key; decrypt secrets   │
│ Build witness; run WASM; prove      │
└──────────────┬──────────────────────┘
               │ proof only
               ▼
Backend (Express + PostgreSQL)
┌─────────────────────────────────────┐
│ Stores encrypted blobs, parties,    │
│ auth, sessions                      │
└──────────────┬──────────────────────┘
               │
               ▼
Blockchain (Sepolia)
┌─────────────────────────────────────┐
│ Voting Contract                     │
│ Verifier Contract (Groth16)         │
│ Chainlink Oracle (eligibility)      │
└─────────────────────────────────────┘
```


## Tech Stack
- Frontend: Next.js 15, React 19, Tailwind 4, Mantine, MUI
- ZK/Crypto: Circom 2.x, snarkjs, ffjavascript, poseidon‑lite
- Blockchain: Solidity, Chainlink, ethers v6, Sepolia
- Backend: Express 5 (ESM), pg (PostgreSQL), JWT


## Monorepo Structure
```
.
├── backend/                      # Express API server (ESM)
│   ├── server.js                 # Entry point
│   ├── routes/                   # users, parties, …
│   └── database/CreateConnection.js
├── frontend/                     # Next.js 15 app
│   ├── src/app/…                 # App Router pages
│   ├── PROOF/                    # Circuits & artifacts
│   │   ├── VerifyVoter.circom
│   │   └── powersOfTau28_hez_final_17.ptau
│   └── ethereum/contracts/       # Solidity helpers (this repo)
│       ├── PartyManager.sol
│       └── TreasureManager.sol
├── ElectionProject/              # (Placeholder; not yet documented)
├── README.md
└── .env files (root, backend, frontend)
```


## Contracts (frontend/ethereum/contracts)
This repository includes two Solidity helper contracts used in the system flow. Core Verifier and Voting contracts are referenced by addresses in `.env` and are expected to be deployed separately (e.g., in a Hardhat/Foundry project).

1) PartyManager.sol
- Purpose: Integrates with a Chainlink oracle to verify that a political party exists/is eligible according to an off‑chain registry (served by the backend). When verified, it records the party as eligible on‑chain.
- Key pieces:
  - Uses `ChainlinkClient` and `ConfirmedOwner`.
  - `set_host(string)` sets the backend API base (e.g., `http://localhost:8080`).
  - `verify_party(...)` builds a Chainlink request to `GET <host>/is_party_exist?party_id=<ID>` and expects a JSON boolean at path `party_exist`.
  - `fulfill_verification_party(requestId, party_exist)` is the oracle callback. If `true`, it marks the party as verified in contract storage.
- System flow:
  1. Admin/owner triggers a verification request for a party.
  2. Chainlink oracle calls the backend endpoint.
  3. Backend responds; oracle returns `party_exist`.
  4. Contract marks the party verified; downstream contracts can then rely on this mapping to allow ballot registration or vote attribution.
- Notes:
  - Oracle, LINK token, fee, and jobId are currently constants/in‑contract. In production, parameterize via constructor or setters.
  - For safety, only the owner can initiate sensitive actions.

2) TreasureManager.sol
- Purpose: Treasury utilities for recovering assets held by the contract (LINK and native ETH). Useful when the contract receives funds to pay oracle fees or as part of admin workflows.
- Key pieces:
  - `withdraw_link()` transfers all LINK in the contract back to the owner.
  - `transfer_ether()` sends native ETH balance to the owner.
  - `withdraw_assets()` performs both, intended for internal/owner‑only usage.
- System flow:
  - After oracle jobs, recover leftover LINK/ETH to the admin wallet.

Referenced (external) contracts
- Verifier (Groth16): Deployed verifier that checks zk‑SNARK proofs produced by the Circom circuit.
- Voting: Maintains election state, accepted Merkle root(s), tracks nullifiers to prevent double‑votes, and records votes only if the verifier approves the proof and the nullifier is fresh.

Why split the contracts?
- Separation of concerns: zk verification (Verifier) vs application logic (Voting) vs oracle/treasury utilities (PartyManager/TreasureManager).
- Security and upgradability: you can rotate or upgrade the verifier without changing voting logic, and adjust oracle endpoints independently.


## Chainlink Oracle Lifecycle (Party Verification)
- Configure: `VERIFY_JOB_ID`, `ORACLE_ADDRESS`, `LINK_TOKEN_ADDRESS` in `.env` (see mapping below) and ensure the contract has LINK to pay fees.
- Request: `PartyManager.verify_party(...)` sends the request with the party id.
- Fulfill: Oracle calls `fulfill_verification_party` with the boolean result.
- Persist: Contract marks the party verified in storage.


## ZK Proving Pipeline (Groth16)
1) Circuit: `frontend/PROOF/VerifyVoter.circom`
2) Compile and setup (developer flow):
```
circom frontend/PROOF/VerifyVoter.circom --r1cs --wasm --sym -o frontend/PROOF/build
snarkjs groth16 setup frontend/PROOF/build/VerifyVoter.r1cs \
  frontend/PROOF/powersOfTau28_hez_final_17.ptau \
  frontend/PROOF/build/VerifyVoter_0000.zkey
snarkjs zkey export verifier frontend/PROOF/build/VerifyVoter_0000.zkey \
  frontend/PROOF/build/Verifier.sol
```
3) Frontend runtime:
- Build witness in browser → run WASM → create proof via `snarkjs`.
- Submit proof + public inputs (Merkle root, nullifier, etc.) to the on‑chain Verifier and Voting contracts.


## Environment Variables (root .env)
These variables connect the app to Sepolia contracts and the Chainlink oracle:
- VERIFY_JOB_ID=c1c5…aa3 — Chainlink job id used by PartyManager.
- ORACLE_ADDRESS=0x6090…9eFD — Chainlink operator/oracle address.
- LINK_TOKEN_ADDRESS=0x7798…4789 — LINK token on Sepolia.
- ELECTION_CONTRACT_ADDRESS — Deployed Voting contract address.
- VERIFIER_ADDRESS — Deployed Verifier contract address.
- RPC_URL / RPC_API_KEY / CHAIN_ID — Network provider configuration (Sepolia = 11155111).
- DB_* — Backend PostgreSQL connectivity.
- JWT_SECRET_KEY, APP_PASSWORD, EMAIL_SENDER — App security and notifications.


## Running (Development)
Backend API (Express):
```
cd backend
npm run dev
```

Frontend (Next.js):
```
cd frontend
npm run dev
```

Cross‑origin config: backend CORS allows `http://localhost:3000` with credentials.


## End‑to‑End Voting Flow
1) Admin sets the current Merkle root in the Voting contract and funds oracle/LINK as needed.
2) Voter logs into the client, decrypts their identity secrets (AES‑GCM via PBKDF2 password key).
3) Client builds the zk witness with Merkle path + commitments, generates proof.
4) Client submits transaction: `verify(proof)` on Verifier → Voting consumes the result + checks nullifier is unused → records vote.
5) If party eligibility is required, `PartyManager` verifies off‑chain party registry via Chainlink before allowing party to be listed/selected.


## Security Considerations
- Nullifiers prevent double‑votes; always check and mark nullifiers in Voting.
- Only ciphertext and commitments leave the client; plaintext identity never leaves the device.
- Hardcode minimization: prefer constructor/setter injection for oracle/job/token addresses.
- Rate limiting and session hardening on the backend; protect `/is_party_exist` and any sensitive endpoints.





## License
- Backend `package.json` declares license: ISC.
- Repository‑wide license file pending.


## Acknowledgements
- Circom, snarkjs, circomlib, ffjavascript, poseidon‑lite
- Chainlink
- Ethers.js
- Next.js, React, Tailwind CSS, Mantine, MUI
