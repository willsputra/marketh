# Marketh

Marketh is an online marketplace operating on the Ethereum blockchain.

With Marketh:
 * Store owners are able to **create stores**
 * Store owners are able to **list items on their stores**
 * Users are able to **buy items with ETH**, and the store owners will then be able to **withdraw their ETH balance**

 ## Running the live Rinkeby instance
Make sure your Metamask is running on Rinkeby, and visit [http:xx](http:xx)


 ## Running a local dev Server
 
 1. Install all the required modules
 ```
 $ npm install
 ```

 2. Start the Ethereum client (willl run on localhost:9545)
 ```
 $ truffle develop
 ```

 3. Once you're in truffle (develop), run the migration
 ```
 $ truffle(develop)> migration --reset
 ```

 4. To test, run
 ```
 $ truffle(develop)> test
```

5. To run the client, run
```
$ cd client
$ npm run dev
```

6. Go to **localhost:3000** on your browser, make sure your Metamask is pointed to 9545, have fun!