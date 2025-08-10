// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {Chainlink, ChainlinkClient } from "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
contract TreasureManager is ChainlinkClient, ConfirmedOwner(msg.sender) {
    function withdraw_link() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
    function transfer_ether() internal onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    function withdraw_assets() internal onlyOwner {
        withdraw_link();
        transfer_ether();
    }
}
