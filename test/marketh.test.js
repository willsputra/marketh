
const Marketh = artifacts.require('./Marketh.sol')

contract('Marketh', accounts => {

  it('should set a store owner to true and increase storeOwnersCount to 1.', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])

    const storeOwners = await markethInstance.storeOwners(accounts[1])
    const storeOwnersCount = await markethInstance.storeOwnersCount()

    assert.equal(storeOwners, true, 'The value is not true.')
    assert.equal(storeOwnersCount, 1, 'The value is not 1.')
  })

  it('should remove a store owner', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.removeStoreOwner(accounts[1])

    const storeOwners = await markethInstance.storeOwners(accounts[1])

    assert.equal(storeOwners, false, 'The value should be false.')
  })

  it('should allow a store owner to add a store and increase storesCount to 1', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    const stores = await markethInstance.stores(0)
    const storesCount = await markethInstance.storesCount()

    assert.equal(stores[0], 'imgurl', 'The value is wrong')
    assert.equal(stores[1], 'title', 'The value is wrong')
    assert.equal(stores[2], 'desc', 'The value is wrong')

    assert.equal(storesCount, 1, 'The value is not 1.')
  })

  it('should allow a store owner to remove a store', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.removeStore(0, { from: accounts[1] })

    const stores = await markethInstance.stores(0)

    assert.equal(stores[3], false, 'The value should be false')
  })

  it('should allow a store owner to add an item and increase itemsCount to 1', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })

    const items = await markethInstance.items(0)
    const itemsCount = await markethInstance.itemsCount()

    assert.equal(items[0], 0, 'The value is wrong')
    assert.equal(items[1], 'imgurl', 'The value is wrong')
    assert.equal(items[2], 'title', 'The value is wrong')
    assert.equal(items[3], 'desc', 'The value is wrong')
    assert.equal(items[4], 5, 'The value is wrong')
    assert.equal(items[5], 4, 'The value is wrong')

    assert.equal(itemsCount, 1, 'The value is not 1.')
  })

  it('should allow a store owner to remove an item', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })

    await markethInstance.removeItem(0, { from: accounts[1] })

    const items = await markethInstance.items(0)

    assert.equal(items[6], false, 'The value should be false')
  })

  it('should allow a store owner to edit an item', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })

    await markethInstance.editItem(0, 'imgurl2', 'title2', 'desc2', 6, 7, {
      from: accounts[1]
    })

    const items = await markethInstance.items(0)

    assert.equal(items[0], 0, 'The value is wrong')
    assert.equal(items[1], 'imgurl2', 'The value is wrong')
    assert.equal(items[2], 'title2', 'The value is wrong')
    assert.equal(items[3], 'desc2', 'The value is wrong')
    assert.equal(items[4], 6, 'The value is wrong')
    assert.equal(items[5], 7, 'The value is wrong')
  })

  //it should allow purchase
  it('should add pendingWithdrawals after purchasing', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })

    const items = await markethInstance.items(0)

    await markethInstance.buy(0, { 
      from: accounts[2],
      value: items[4]
    })

    const pendingAfter = await markethInstance.pendingWithdrawals(accounts[1])

    assert.equal(items[4].toNumber(), pendingAfter.toNumber(), 'The value is wrong')

  })

  //it should allow withdraw
  it('should decrease pendingWithdrawals to 0 after withdrawing', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })

    const items = await markethInstance.items(0)

    await markethInstance.buy(0, { 
      from: accounts[2],
      value: items[4]
    })

    const pendingBefore = await markethInstance.pendingWithdrawals(accounts[1])

    await markethInstance.withdraw({
      from: accounts[1]
    })

    const pendingAfter = await markethInstance.pendingWithdrawals(accounts[1])


    assert.equal(0, pendingAfter.toNumber(), 'The value is wrong')

  })

  //it should display correct PURCHASE HISTORY
  it('should display the correct purchase history', async () => {
    const markethInstance = await Marketh.new()

    await markethInstance.addStoreOwner(accounts[1])
    await markethInstance.addStore('imgurl', 'title', 'desc', {
      from: accounts[1]
    })

    await markethInstance.addItem(0, 'imgurl', 'title', 'desc', 5, 4, {
      from: accounts[1]
    })


    const items = await markethInstance.items(0)

    await markethInstance.buy(0, { 
      from: accounts[2],
      value: items[4]
    })

    await markethInstance.buy(0, { 
      from: accounts[2],
      value: items[4]
    })

    const purchaseHistory = await markethInstance.getPurchaseHistory(accounts[2])

    assert.equal(purchaseHistory.toString(5), [0,0], 'The value is wrong')

  })

})
