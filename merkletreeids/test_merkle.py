import os
import tempfile
import shutil
import pytest
from hashlib import sha256
from merkletreeids.__init__ import MerkleTreeDB

@pytest.fixture
def temp_db_path():
    dirpath = tempfile.mkdtemp()
    yield dirpath
    shutil.rmtree(dirpath)

def test_initialize_db(temp_db_path):
    tree = MerkleTreeDB(temp_db_path)
    assert tree.db.get(b'root') == b''
    assert tree.db.get(b'total_leaves') == b'\x00\x00\x00\x00'
    tree.close()

def test_add_leaf_and_root(temp_db_path):
    tree = MerkleTreeDB(temp_db_path)
    leaf1 = sha256(b'leaf1').digest()
    leaf2 = sha256(b'leaf2').digest()
    tree.add_leaf(leaf1)
    tree.add_leaf(leaf2)
    # After adding two leaves, root should be hash(leaf1+leaf2)
    expected_root = sha256(leaf1 + leaf2).digest()
    assert tree.db.get(b'root') == expected_root
    tree.close()

def test_get_merkle_path(temp_db_path):
    tree = MerkleTreeDB(temp_db_path)
    leaves = [sha256(f'leaf{i}'.encode()).digest() for i in range(4)]
    for leaf in leaves:
        tree.add_leaf(leaf)
    # Test path for leaf 2
    path, indices = tree.get_merkle_path(leaves[2])
    assert isinstance(path, list)
    assert isinstance(indices, list)
    assert len(path) > 0
    tree.close()

def test_leaf_not_found(temp_db_path):
    tree = MerkleTreeDB(temp_db_path)
    leaf = sha256(b'notfound').digest()
    with pytest.raises(ValueError):
        tree.get_merkle_path(leaf)
    tree.close()
