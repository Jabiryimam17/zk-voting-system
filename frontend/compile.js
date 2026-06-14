const path = require("path");
const fs = require("fs");
const solc = require("solc");

// 1. Resolve paths
const contractsDir = path.resolve(__dirname, "ethereum", "contracts");

const findImports = (importPath) => {
  try {
    let fullPath;
    if (importPath.startsWith("@chainlink")) {
      fullPath = path.resolve(__dirname, "node_modules", importPath);
    } else {
      fullPath = path.resolve(contractsDir, importPath);
    }
    const content = fs.readFileSync(fullPath, "utf8");
    return { contents: content };
  } catch (error) {
    return { error: "File not found: " + importPath };
  }
};

const source = fs.readFileSync(path.join(contractsDir, "Election.sol"), "utf8");

// 2. Setup Standard JSON Input
const input = {
  language: "Solidity",
  sources: {
    "Election.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["metadata", "abi", "evm.bytecode"],
      },
    },
  },
};

// 3. Compile
const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

// Check for errors
if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
}

// 4. Extract and Save the exact Metadata JSON file natively
if (
  output.contracts &&
  output.contracts["Election.sol"] &&
  output.contracts["Election.sol"]["Election"]
) {
  const contractOutput = output.contracts["Election.sol"]["Election"];
  const buildPath = path.resolve(__dirname, "ethereum", "contracts", "build");
  if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath, { recursive: true });

  // Parse the stringified metadata so it writes as a clean, pretty JSON file
  const cleanMetadata = JSON.parse(contractOutput.metadata);

  fs.writeFileSync(
    path.join(buildPath, "Election_metadata.json"),
    JSON.stringify(cleanMetadata, null, 2)
  );
  fs.writeFileSync(
    path.join(buildPath, "Election_abi.json"),
    JSON.stringify(contractOutput.abi, null, 2)
  );

  // Update election_cont.js with new ABI and bytecode
  const jsContent = `export const abi = ${JSON.stringify(
    contractOutput.abi,
    null,
    2
  )};
export const bytecode = "${contractOutput.evm.bytecode.object}";
`;
  fs.writeFileSync(path.join(buildPath, "election_cont.js"), jsContent);

  // Also compile Verifier.sol and update verifier_cont.js
  const verifierOutput =
    output.contracts["Verifier.sol"] &&
    output.contracts["Verifier.sol"]["Groth16Verifier"];
  if (verifierOutput) {
    const verifierJsContent = `export const abi = ${JSON.stringify(
      verifierOutput.abi,
      null,
      2
    )};
export const bytecode = "${verifierOutput.evm.bytecode.object}";
`;
    fs.writeFileSync(
      path.join(buildPath, "verifier_cont.js"),
      verifierJsContent
    );
  }

  console.log(
    "🎉 Success! Metadata and ABI generated in ethereum/contracts/build/"
  );
} else {
  if (!output.errors) {
    console.error(
      "Unknown Compilation Error: output.contracts['Election.sol']['Election'] is missing"
    );
  }
}
