// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import {Chainlink, ChainlinkClient } from "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
contract PartyManager is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    uint256 private constant fee = 0.1 * 10**18;
    address public constant oracle = 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD;
    address public constant link_token = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    mapping(bytes32 => string) internal pending_party;
    mapping (bytes32 => bytes32) internal pending_party_verification;
    mapping (bytes32 => Party) public parties; // key-> id_hash
    struct Party {
        uint32 supporters;
        bool verified;
    }
    string public host;
    constructor() ConfirmedOwner(msg.sender) {
        _setChainlinkToken(link_token);
        _setChainlinkOracle(oracle);
    }
    function set_host(string memory new_host) public {
        host = new_host;
    }

    function add_verified_party(bytes32 party_id) public onlyOwner {
        require(party_id.length > 0, "Invalid Party ID");
        require(parties[party_id]==false, "Party already verified");
        bytes32 request_id = verify_party(party_id);
        pending_party_verification[request_id] = party_id;
    }

    function verify_party(bytes32 party_name, bytes32 id) public returns (bytes32) {
        bytes32 job_id = "c1c5e92880894eb6b27d3cae19670aa3";
        Chainlink.Request memory req = _buildChainlinkRequest(
            job_id, address(this),this.fulfill_verification_party.selector
        );
        string memory url = string.concat(host,"/is_party_exist?party_id=", id);

        req._add("get", url);
        req._add("path", "party_exist");

        bytes32 request_id = _sendChainlinkRequest(req, fee);
        return request_id;
    }

    function fulfill_verification_party(bytes32 _request_id,  bool party_exist) public recordChainlinkFulfillment(_request_id) {
        require(party_exist, "Party Is Not Verified!");
        bytes32 party_id = pending_party_verification[_request_id];
        parties[party_id]=Party({
            supporters: 0,
            verified:true
        });
        delete pending_party_verification[_request_id];
    }
};
