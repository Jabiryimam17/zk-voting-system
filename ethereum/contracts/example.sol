// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;


import {Chainlink, ChainlinkClient } from "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
contract VerificationAPIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    event request_going_out(bytes32 indexed request_id);
    event response_status(bytes32 indexed request_id, bool is_valid);
    bool public verified=false;
    uint256 private constant fee = 0.1 * 10**18;
    string public host;
    bytes32 public job_ids;
    address public constant oracle = 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD;
    address public constant link_token = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

    constructor() ConfirmedOwner(msg.sender) {
        _setChainlinkToken(link_token);
        _setChainlinkOracle(oracle);
    }

    function set_host(string memory new_host) public {
        host = new_host;
    }

    function verify_selector(address election, string memory citizen_ID, bytes32 job_id) internal returns (bytes32) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            job_id, election,this.fulfill_verification.selector
        );
        string memory url = string.concat(host,"/verify?ID=", citizen_ID);


        req._add("get", url);
        req._add("path", "isValid");

        bytes32 request_id = _sendChainlinkRequest(req, fee);
        emit request_going_out(request_id);
        return request_id;
    }
    function fulfill_verification(bytes32 _request_ID,  bool isValid) public recordChainlinkFulfillment(_request_ID) {
        verified=isValid;
        emit response_status(_request_ID, isValid);
    }

    function fetch_parties(bytes32 job_id) public returns (bytes32) {
        Chainlink.Request memory req = _buildChainlinkRequest(job_id, address(this), this.fulfill_fetch_candidates.selector);
        string memory url =string.concat(host,"/parties");
        req._add("get",url);
        req._add("path","parties");
        bytes32 request_id = _sendChainlinkRequest(req, fee);
        emit request_going_out(request_id);
        return request_id;
    }
    function fulfill_fetch_candidates(bytes32 request_id, bytes32[] calldata parties) public virtual {}
    function example_oracle() public returns(bytes32) {
        job_ids = "c1c5e92880894eb6b27d3cae19670aa3";
        Chainlink.Request memory req = _buildChainlinkRequest(job_ids, address(this), this.fulfill_example.selector);
        string memory url = string.concat(host,"/example");
        req._add("get", url);
        req._add("path", "example");
        bytes32 request_id = _sendChainlinkRequest(req, fee);
        emit request_going_out(request_id);
        return request_id;
    }
    function fulfill_example(bytes32 request_id, bool example) public recordChainlinkFulfillment(request_id) {
        // Handle the example response
        verified = example;
        emit response_status(request_id, example);
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}

contract Election is VerificationAPIConsumer{
    mapping (bytes32 => uint) public party_supporters;
    bytes32[]  public parties;
    mapping(bytes32 => bool) has_made_choice;
    constructor() payable {
    }
    function fulfill_fetch_candidates(bytes32 request_id, bytes32[] calldata fetched_parties) public override {
        parties = fetched_parties;
        emit response_status(request_id, true);
    }
    function choice_party(bytes32 selector, bytes32 party, bytes32 job_id) public {
        verify_selector(address(this), string(abi.encodePacked(selector)),job_id);
        require(verified && !has_made_choice[selector]);
        has_made_choice[selector] = true;
        party_supporters[party]++;
    }

    function fetch_parties_status() public returns(bytes32[] memory) {
        insertion_sort();
        return parties;
    }

    function select_winner() public view returns( bytes32 winner) {
        require(msg.sender == owner(), "Only owner");
        require(parties.length > 0, "No Parties");
        winner = parties[0];
        uint winner_supporters = party_supporters[winner];
        bool is_duel;
        for (uint i = 1; i < parties.length; i++) {
            if (winner_supporters == party_supporters[parties[i]]) is_duel=true;
            else if (winner_supporters < party_supporters[parties[i]]) {
                is_duel = false;
                winner = parties[i];
                winner_supporters = party_supporters[winner];
            }
        }
        if (is_duel) {
            winner = "No Winners";
        }
    }

    function insertion_sort() public {

        for (uint i = 1; i < parties.length; i++) {
            bytes32 current_party = parties[i];
            uint current_supporters = party_supporters[current_party];
            uint j = i - 1;
            while (current_supporters > party_supporters[parties[j]] && j >= 0) {
                parties[j+1] = parties[j];
                j--;
            }
            parties[j++]=current_party;
        }
    }
}