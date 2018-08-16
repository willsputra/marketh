const Marketh = artifacts.require('./Marketh.sol')

contract('Marketh', (accounts) => {

    it('should set a store owner to true and increase storeOwnersCount to 1.', async () => {
        const markethInstance = await Marketh.deployed()

        await markethInstance.addStoreOwner(accounts[1])

        const storeOwners = await markethInstance.storeOwners(accounts[1])
        const storeOwnersCount = await markethInstance.storeOwnersCount()

        assert.equal(storeOwners, true, 'The value is not true.')
        assert.equal(storeOwnersCount, 1, 'The value is not 1.')
    })   
    
    it('should allow a store owner to add a store and increase storesCount to 1', async () => {
        const markethInstance = await Marketh.deployed()

        await markethInstance.addStoreOwner(accounts[1])
        await markethInstance.addStore("imgurl","title","desc",{ from: accounts[1] })

        const stores = await markethInstance.stores(0)
        const storesCount = await markethInstance.storesCount()

        assert.equal(stores[0], "imgurl", "The value is wrong")
        assert.equal(stores[1], "title", "The value is wrong")
        assert.equal(stores[2], "desc", "The value is wrong")

        assert.equal(storesCount, 1, 'The value is not 1.')
    })   

})
