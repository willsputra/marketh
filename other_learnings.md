# Other Learnings

Personal learnings while creating this project.

## Smart contract related
* Make sure you **reset MetaMask** after restarting your locally running private blockchain, because the nonce will be different.
* If sometimes your functions crap out for whatever reason after restarting your locally running private blockchain, try resetting the migration with `migrate --reset`
* How to find out the contract address from Truffle: `Marketh.address()`
* To initiate your migrated contracts on Truffle: `Marketh.deployed().then(function(instance){ app = instance })`
* Accessing a variable example: `app.admin()` or `app.storeOwnersCount()`
* Accessing an array example: `app.stores.call(0)`
* Useful reference of Solidity gotchas: [http://balticdatascience.com/2017/11/27/solidity-gotchas/](http://balticdatascience.com/2017/11/27/solidity-gotchas/)
* [Transaction gas cost in Truffle test case](https://ethereum.stackexchange.com/questions/41858/transaction-gas-cost-in-truffle-test-case)
* [Testing contract withdrawal pattern with Truffle](https://ethereum.stackexchange.com/questions/30139/testing-contract-withdrawal-pattern-with-truffle)

## General front-end stuff
* [Getting the url parameter using Next router](https://github.com/zeit/next-codemod#url-to-withrouter)
* [Super simple image upload in React with Cloudinary, React Dropzone, Axios](https://blog.codeinfuse.com/upload-multiple-files-to-cloudinary-using-react-dropzone-axios-27883c2a5ec6)

## ENS and Rinkeby
* Helpful articles:
https://www.reddit.com/r/ethereum/comments/5nrg1b/reverse_resolution_now_available_on_ropsten_ens/
https://michalzalecki.com/register-test-domain-with-ens/
https://medium.com/the-ethereum-name-service/adding-ens-into-your-dapp-72eb6deac26b

* However, there seems no EIP181 Resolver yet on Rinkeby and no Reverse Registrar. Not supported on ethereum-ens too.
Next steps: 1) Deploy PublicResolver and ReverseRegistrar to Rinkeby 2) Try implementing ReverseRegistrar to ethereum-ens 3) Have fun!