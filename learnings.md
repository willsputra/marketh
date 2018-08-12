• RESET METAMASK - nonce not synced with blockchain
• sometimes your functions crap out for whatever reason after restarting truffle - migrate --reset
• initiate truffle: Market.address() - find out the address
• Market.deployed().then(function(instance){ app = instance })
• accessing a variable: app.admin() | app.storeOwnersCount()
• accessing an array: app.stores.call(0)
