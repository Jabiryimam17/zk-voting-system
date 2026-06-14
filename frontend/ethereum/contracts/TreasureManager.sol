// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {Chainlink, ChainlinkClient } from "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
abstract contract TreasureManager is ChainlinkClient {
    function withdraw_link() public {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
    function transfer_ether() internal {
        payable(msg.sender).transfer(address(this).balance);
    }
    function withdraw_assets() internal {
        withdraw_link();
        transfer_ether();
    }
}
