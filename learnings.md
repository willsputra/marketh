• RESET METAMASK - nonce not synced with blockchain
• sometimes your functions crap out for whatever reason after restarting truffle - migrate --reset
• initiate truffle: Market.address() - find out the address
• Market.deployed().then(function(instance){ app = instance })
• accessing a variable: app.admin() | app.storeOwnersCount()
• accessing an array: app.stores.call(0)
• https://github.com/zeit/next-codemod#url-to-withrouter
• http://balticdatascience.com/2017/11/27/solidity-gotchas/
• https://ethereum.stackexchange.com/questions/41858/transaction-gas-cost-in-truffle-test-case
• https://ethereum.stackexchange.com/questions/30139/testing-contract-withdrawal-pattern-with-truffle
• https://blog.codeinfuse.com/upload-multiple-files-to-cloudinary-using-react-dropzone-axios-27883c2a5ec6