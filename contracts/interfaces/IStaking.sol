// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

interface IStaking {
    function createValidator(
        bytes32 name,
        uint256 commissionRate, 
        uint256 commissionMaxRate, 
        uint256 commissionMaxChangeRate, 
        uint256 minSelfDelegation
    ) external returns (address val);
    function finalize(
        address[] calldata _signerAdds, 
        uint256[] calldata _votingPower, 
        bool[] calldata _signed
    ) external;
    function doubleSign(address signerAddr, uint256 votingPower, uint256 height) external;
    function mint() external returns (uint256 fees);
    function totalSupply() external view returns (uint256);
    function totalBonded() external view returns (uint256);
    function allValsLength() external view returns (uint);
    function delegate(address delAddr, uint256 amount) external;
    function burn(uint256 amount) external;
    function setToken(uint256 amount) external;
    function removeDelegation(address delAddr) external;
    function withdrawRewards(address payable _to, uint256 _amount) external;
    function updateSigner(address signerAddr) external;

    // @dev Emitted when validator is created;
    event CreateValidator(
        bytes32 _name,
        address payable _valAddr,
        uint256 _commissionRate,
        uint256 _commissionMaxRate,
        uint256 _commissionMaxChangeRate,
        uint256 _minSelfDelegation
    );
    
    // function getValidatorsByDelegator(address delAddr)  external view returns (address[] memory);
    // function applyAndReturnValidatorSets() external returns (address[] memory, uint256[] memory);
    // function getValidatorsByDelegator() external view returns (address[] memory);
}