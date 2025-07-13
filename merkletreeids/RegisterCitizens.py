import random
import subprocess
import json
from circomlibpy.poseidon import PoseidonHash
from merkletreeids.MerkleTree import MerkleTreeDB



PUBLIC_SALT = 1234
NULLIFIER_TAG = 999999
MERKLE_TREE_LEVELS = 20




class VoterRegister():

    def __init__(self):
        self.merkle_tree = MerkleTreeDB("temp")
        self.poseidon_instance = PoseidonHash()

    def register_voter(self, official_id):
        sid = random.randint(0, 2**256)
        hid = self.poseidon_instance.hash(2,[official_id, PUBLIC_SALT])
        commitment = self.poseidon_instance.hash(2,[hid, sid])
        nullifier = self.poseidon_instance.hash(2,[sid, NULLIFIER_TAG])
        
        
        self.merkle_tree.add_leaf(hid)
        merkle_path, merkel_path_dirs = self.merkle_tree.get_merkle_path(hid)
        signature = self.generate_signature(hid, sid)

        return {
            "sid":sid,
            "hid":hid,
            "commitment":commitment,
            "nullifier":nullifier,
            "signature":signature,
            "merkle_path":merkle_path,
            "merkle_path_dirs":merkel_path_dirs

        }
    
    def generate_signature(self,hid:int, sid:int):
        node_path = "node"
        js_script = "GenSign.js"

        result = subprocess.run(
            [node_path, js_script, str(hid), str(sid)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode != 0: raise RuntimeError(f"JS Error: {result.stderr}")

        return json.loads(result.stdout)


Registral = VoterRegister()

print(Registral.generate_signature(1234567,12344657))