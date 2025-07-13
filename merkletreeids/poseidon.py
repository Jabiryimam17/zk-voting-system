from circomlibpy.poseidon import PoseidonHash

poseidon = PoseidonHash()
inputs = [int.from_bytes(b"example_value1")]
result = poseidon.hash(1, inputs)
print("Python Poseidon result:", result)