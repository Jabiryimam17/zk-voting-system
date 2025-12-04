# ZK‑Powered National Voting System (Ethiopia)

Privacy‑preserving, national‑scale voting system leveraging zero‑knowledge proofs, modern cryptography, and blockchain oracles. Voters authenticate with a single password while proofs and cryptographic commitments protect privacy and integrity. The system integrates zk‑SNARKs (Circom/snarkjs), Poseidon/Merkle trees, and Chainlink for secure on‑chain/off‑chain interactions. Backend services manage election data, while a Next.js frontend delivers the user experience.



## Features
- Zero‑knowledge authentication and eligibility proofs (Circom/snarkjs)
- Commitment trees (Poseidon hash, Merkle trees) for inclusion/exclusion proofs
- On‑chain integration via ethers.js and Chainlink services (oracle/LINK token)
- Frontend: Next.js 15 (App Router) with Tailwind CSS 4, React 19
- Backend: Express 5 with MySQL2 and JWT authentication
- Secure cookie/session handling and CORS for local dev


## Tech Stack
- Language: TypeScript/JavaScript (project uses JavaScript/ESM modules)
- Frontend: Next.js 15, React 19, Tailwind CSS 4, Mantine, MUI
- ZK/crypto: circomlib, circomlibjs, snarkjs, ffjavascript, poseidon‑lite
- Blockchain: ethers.js; Chainlink (`@chainlink/contracts`); Sepolia testnet via Infura
- Backend: Node.js (ESM), Express 5, MySQL2
- Package manager: npm (package‑lock.json present)


## Monorepo Structure
```
.
├── backend/                # Express API server (ESM)
│   ├── server.js           # Entry point (PORT from .env)
│   ├── routes/
│   │   ├── users.js        # User routes (auth, etc.)
│   │   └── parties.js      # Party registration + verification flow
│   └── database/
│       └── CreateConnection.js  # MySQL connection pool via env
├── frontend/               # Next.js 15 app (App Router under src/app)
│   ├── src/app/...         # Pages/routes
│   ├── PROOF/              # Circuits & proving artifacts (ptau, .circom)
│   │   ├── VerifyVoter.circom
│   │   └── powersOfTau28_hez_final_17.ptau
│   └── utilities/          # Local crypto libs (ignored circomlibjs build)
├── ElectionProject/        # (Listed in repo; purpose TBD)  ← TODO: document
├── package.json            # Root (minimal), no scripts
├── package-lock.json
└── .env files              # Root, backend, frontend
```


## Requirements
- Node.js 20+ (LTS recommended)
- npm 10+
- MySQL 8+
- Git
- Optional (for circuit work):
  - circom 2.x (native compiler)
  - snarkjs (CLI) — already in frontend deps for in‑app usage




Shared/root `.env` (used by tooling and/or frontend):
```
VERIFY_JOB_ID=...                # Chainlink job ID for verification (Sepolia) ← TODO: confirm service type
ORACLE_ADDRESS=0x...             # Chainlink Oracle (Sepolia)
LINK_TOKEN_ADDRESS=0x...         # LINK token (Sepolia)
ELECTION_CONTRACT_ADDRESS=0x...  # Voting contract address (Sepolia) ← TODO: ABI/source link
VERIFIER_ADDRESS=0x...           # On‑chain verifier contract address
RPC_API_KEY=...                  # Infura/Alchemy API key
RPC_URL=https://sepolia.infura.io/v3/${RPC_API_KEY}
CHAIN_ID=11155111                # Sepolia

# Database (do NOT expose in frontend in production)
DB_USER_NAME=...
DB_PASSWORD=...
DB_PORT=3306
DB_NAME=election
DB_HOST=localhost

# App secrets (back‑end usage)
APP_PASSWORD='...'
EMAIL_SENDER=...
JWT_SECRET_KEY=...
```

Backend `backend/.env` (used by Express API):
```
DB_USER_NAME=...
DB_PASSWORD=...
DB_PORT=3306
DB_NAME=election
DB_HOST=localhost
APP_PASSWORD='...'
EMAIL_SENDER=...
JWT_SECRET_KEY=...
PORT=8080                        # Server port (server.js defaults to 5000 if unset)
```

Frontend `frontend/.env` (used by Next.js; only include non‑secret/public values in production builds):
```
VERIFY_JOB_ID=...
ORACLE_ADDRESS=0x...
LINK_TOKEN_ADDRESS=0x...
ELECTION_CONTRACT_ADDRESS=0x...
VERIFIER_ADDRESS=0x...
RPC_API_KEY=...
RPC_URL=...
CHAIN_ID=11155111

# NOTE: DB_* and sensitive secrets should NOT be here for production. ← TODO: refactor
```


## Installation
Clone and install dependencies for both apps.

```
git clone <this-repo-url>
cd Voting

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```


## Database Setup (MySQL)
1. Create database and user matching your `.env`.
2. Apply schema/migrations. ← TODO: add SQL schema/migrations to repo
3. Ensure connectivity:
   - File: `backend/database/CreateConnection.js` reads from `backend/.env`.


## ZK Proving Setup
- Circuits: `frontend/PROOF/VerifyVoter.circom`
- PTAU: `frontend/PROOF/powersOfTau28_hez_final_17.ptau` (already present)

Typical flow (if compiling/updating circuits):
```
# 1) Compile Circom circuit (requires circom binary installed)
circom frontend/PROOF/VerifyVoter.circom --r1cs --wasm --sym -o frontend/PROOF/build

# 2) Trusted setup (example with Groth16; adjust paths as needed)
snarkjs groth16 setup frontend/PROOF/build/VerifyVoter.r1cs \
  frontend/PROOF/powersOfTau28_hez_final_17.ptau \
  frontend/PROOF/build/VerifyVoter_0000.zkey

# 3) Export verification key and verifier contract
snarkjs zkey export verificationkey frontend/PROOF/build/VerifyVoter_0000.zkey \
  frontend/PROOF/build/verification_key.json

snarkjs zkey export verifier frontend/PROOF/build/VerifyVoter_0000.zkey \
  frontend/PROOF/build/Verifier.sol

# 4) Generate/verify proofs (CLI or in‑app via snarkjs)
```

Notes:
- The app uses Poseidon/Merkle trees (via `poseidon-lite`, `circomlib`, `ffjavascript`) for efficient commitments.
- Verifier and election contracts are referenced via env addresses; deployment scripts/ABIs are not included here. ← TODO: add hardhat/foundry project or ABIs


## Running (Development)
Backend API (Express):
```
cd backend
npm run dev        # nodemon server.js, listens on PORT (default 5000, .env uses 8080)
```

Frontend (Next.js):
```
cd frontend
npm run dev        # next dev --turbopack (default http://localhost:3000)
```

Cross‑origin config:
- `backend/server.js` enables CORS for `http://localhost:3000` with `credentials: true`.


## Available Scripts

Root:
- No scripts (only `nanoid` dependency declared).

Backend (`backend/package.json`):
- `npm run dev` — Start API with nodemon on `server.js`
- `npm test` — Placeholder (no tests yet)

Frontend (`frontend/package.json`):
- `npm run dev` — Start Next.js with Turbopack
- `npm run build` — Build production bundle
- `npm run start` — Start production server
- `npm run lint` — Lint via Next.js


## API (Backend)
- Base URL: `http://localhost:<PORT>` (default 5000; `.env` sets 8080)
- Routes (discovered):
  - `GET /api/parties` — Fetch parties (auth required)
  - `GET /api/parties/:id` — Fetch party by id (auth required)
  - `POST /api/parties` — Register/verify a party (calls `http://localhost:5000/verify_party`) ← TODO: document `/verify_party`
  - `GET /` — Health check (“Hello World!”)
- Middleware: `with_auth` for protected routes

TODO:
- Document `users` routes, auth flow, and token lifecycle
- Add OpenAPI/Swagger spec


## Blockchain Integration
- Network: Sepolia testnet (`CHAIN_ID=11155111`)
- Provider: Infura via `RPC_URL`/`RPC_API_KEY`
- Contracts: `ELECTION_CONTRACT_ADDRESS`, `VERIFIER_ADDRESS` (addresses set via env)
- Oracles: Chainlink (`@chainlink/contracts`); `VERIFY_JOB_ID`, `ORACLE_ADDRESS`, `LINK_TOKEN_ADDRESS` used for verification workflows
- Client: `ethers` v6 for contract interactions

Highlights for blockchain developer review:
- zk‑SNARK proof generation/verification pipeline with Circom/snarkjs
- Poseidon hash and Merkle commitments for voter/anonymity sets
- On‑chain verifier and election contract separation of concerns
- Chainlink integration to bridge off‑chain verification or data fetching into on‑chain flows

TODO:
- Add contract ABIs, deployment scripts, and link to source code (Hardhat/Foundry) for reproducibility
- Document gas considerations and batching strategies for large voter sets
- Provide audit checklist and invariants (no double vote, liveness, censorship resistance)



## License
- Backend `package.json` declares license: ISC.
- Repository‑wide license file is not present. ← TODO: add `LICENSE` (ISC or desired license) at repo root.


## Acknowledgements
- Circom, snarkjs, circomlib
- Chainlink
- Ethers.js
- Tailwind CSS, Next.js, React
