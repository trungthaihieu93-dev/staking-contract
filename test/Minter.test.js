const { assertRevert } = require("./utils");

const Staking = artifacts.require("StakingTest");
const Minter = artifacts.require("Minter");


contract("Minter", async (accounts) => {

    async function mint(num) {
        const instance = await Staking.deployed();
        for (var i =0; i < num; i ++) {
            await instance.mint();
        }
    }

    it("mint", async () => {
        const staking = await Staking.deployed();
        await staking.createMinterTest();
        const minter = await Minter.at(await staking.minter())
        
        const totalSupply = web3.utils.toWei("1000", "ether");
        const totalBonded = web3.utils.toWei("1", "ether");
        await staking.setTotalSupply(totalSupply);
        await staking.setTotalBonded(totalBonded);
        await minter.setInflation(0);
        await minter.setAnnualProvision(0);
        await staking.mint();

        // inflation min
        let inflation = await minter.inflation.call();
        assert.equal(inflation.toString(), web3.utils.toWei("0.02", "ether")) // 2%

        const blockProvision = await minter.getBlockProvision.call();
        // 1000 * 2% / 5 = 10
        assert.equal(blockProvision.toString(),  web3.utils.toWei("4.000000000000000000", "ether"));

        await staking.mint();

        inflation = await minter.inflation.call();
        assert.equal(inflation.toString(), web3.utils.toWei("0.029971542401821286", "ether")) // 2%

        await mint(5);

        // inflation max: 20%
        inflation = await minter.inflation.call();
        assert.equal(inflation.toString(), web3.utils.toWei("0.07", "ether"));

        await staking.setTotalSupply(totalSupply);
        await staking.setTotalBonded(totalSupply);
        await staking.mint();

        inflation = await minter.inflation.call();
        assert.equal(inflation.toString(), web3.utils.toWei("0.051428571428571429", "ether"));

        await mint(5); // 1 year
        let newTotalSupply = await staking.totalSupply.call();
        await staking.setTotalBonded(newTotalSupply.toString());

        await mint(5); // 1 year
        newTotalSupply = await staking.totalSupply.call();
        await staking.setTotalBonded(newTotalSupply.toString());

        await mint(5); // 1 year


        // inflation min : 2%
        inflation = await minter.inflation.call();
        assert.equal(inflation.toString(), web3.utils.toWei("0.02", "ether")) // 7%
    })

    it("not mint", async () => {
        const staking = await Staking.deployed();
        await staking.transferOwnership(accounts[1], {from: accounts[0]})
        await assertRevert(staking.mint(), "Reason given: Ownable: caller is not the owner.")
    })
})