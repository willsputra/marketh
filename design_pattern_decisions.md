# Design Pattern Decisions

Several contract design patterns are applied.

---
## Using IPFS

Images are stored on IPFS for better decentralization. Read file from input file, and upload it to IPFS.

```
    captureFile(event) {
      event.preventDefault()
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({ isLoading: true })
        this.setState({ buffer: Buffer(reader.result) }, () => {
  
          console.log('buffer', this.state.buffer)
          ipfs.files.add(this.state.buffer, (error, result) => {
            if(error) {
              console.error(error)
              return
            }
            this.setState({ ipfsHash: result[0].hash }, () => {
              this.setState({ imageUrl: `https://ipfs.io/ipfs/${this.state.ipfsHash}`})
              this.setState({ isLoading: false })
              console.log('ipfsHash', this.state.ipfsHash)
            })
            })
        })
      }
    }
```


---

## Ownership
The Ownable contract from zeppelin (installed with EthPM) restricts access to only the contract owner.

Importing from Zeppelin (from installed_contracts folder generated by EthPM):
```
import "zeppelin/contracts/ownership/Ownable.sol";
```

Usage:
```
function kill() public onlyOwner {
```

---

## Mortal
The kill() function allows the owner to destroy the contract and send all the Ether to the owner's address. 

```
function kill() public onlyOwner {
        selfdestruct(owner);
    }
```

---

## Circuit Breaker
This allows the owner to disable the contract.

```
    /** @dev Initialize CIRCUIT BREAKER */
    constructor() public {
        stopped = false;
    }

    /** @dev CIRCUIT BREAKER: Allows owner to deactivate the contract */
    function toggleContractActive() public onlyOwner {
        stopped = !stopped;
    }

    modifier stopInEmergency() {
        if(!stopped) _;
    }

    modifier onlyInEmergency() {
        if(stopped) _;
    }
```

---

## Restricting Access
Function modifiers are used to restrict access to some of the contract's functions.

Example:

With the modifier `onlyOwner`, only the contract owner is allowed to add an address as a store owner.
```
function addStoreOwner(address _recipient) public onlyOwner stopInEmergency{

...
```

With the modifier `onlyStoreOwner`, only store owners are allowed to add new stores or add new items.

```
function addStore(string _imageUrl, string _title, string _description) public onlyStoreOwner stopInEmergency {

...
```
```
function addItem(uint _storeId, string _imageUrl, string _title, string _description, uint _price, uint _quantity) public onlyStoreOwner {

...
```

---

## Withdrawal Pattern

For buying an item from a store, the withdrawal pattern is used instead of sending Ether directly using `send` call. That way, if the buy function fails, it will only affect that specific address and will not affect the rest of the contract.

```
function buy () public {

...

        pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]] = pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]]
        .add(items[_itemId].price);

...
```
```
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
```

---
## Fallback Function

The fallback function is executed if the contract receives plain Ether without any data.

```
function() external payable {

    }
```
