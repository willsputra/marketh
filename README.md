# Marketh

Marketh is an online marketplace operating on the Ethereum blockchain.

With Marketh:
 * Store owners are able to **create stores**
 * Store owners are able to **list items on their stores**
 * Users are able to **buy items with ETH**, and the store owners will then be able to **withdraw their ETH balance**

 ## Running the live Rinkeby instance
Make sure your Metamask is running on Rinkeby, and visit [http:xx](http:xx)

---

## Running a local dev server

### Running the test and migration

1. Clone this repo
```
git clone https://github.com/willsputra/marketh.git
```

2. Run `npm install` to install the required modules
```
npm install
```

3. Run ganache-cli to start your blockchain on port 8545
```
ganache-cli
```

4. Run truffle test to run the test
```
truffle test
```

5. Run truffle migrate to compile and migrate the contract
```
truffle migrate --reset
```

### Running the client
1. Go to the client/ directory
```
cd client
```

2. Run `npm install` to install the required modules
```
npm install
```

3. Run `npm run dev` to start the client on `localhost:3000`
```
npm run dev
```

4. Make sure your MetaMask is running on the correct port (**http://localhost/8545** for `ganache-cli` or **http://localhost9545** for `truffle develop`), then go to localhost:3000 on your browser


### Quickstart
1. Go to Admin Tools and add an address as a store owner
2. Go to Store, and login to MetaMask as the store owner. You should be able to see an 'Add Store' button
3. Add a store
4. Add an item
5. Enjoy!

---