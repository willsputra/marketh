# Avoiding Common Attacks

Several measures are taken to avoid common attacks.

---

## Avoiding Re-entrancy
In the withdraw function, `pendingWithdrawals` is set to 0 before withdrawing the balance to avoid re-entrancy attack.
```
function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
```

---

## Avoiding DoS with (Unexpected) revert
Withdrawal pattern (pull payment instead of push) is applied to avoid reverts in the case of failed payments.

```
function buy(uint _itemId) public payable stopInEmergency {
        require(msg.sender != storeToStoreOwner[items[_itemId].storeId], "You are not able to buy your own item.");
        require(msg.value == items[_itemId].price, "Value transferred is not the same as price.");
        require(items[_itemId].quantity > 0, "This item is sold out.");
        
        addressToItems[msg.sender].push(_itemId);
        
        pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]] = pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]]
        .add(items[_itemId].price);
        items[_itemId].quantity = items[_itemId].quantity.sub(1);
    }
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

## Avoiding Integer Overflow and Underflow
The SafeMath library from Zeppelin (installed via EthPM) is used to prevent integer overflow and underflow.

```
import "zeppelin/contracts/math/SafeMath.sol";
```

```
using SafeMath for uint;
```

Usage example:
```
items[_itemId].quantity = items[_itemId].quantity.sub(1);
```

SafeMath does this by checking the logic conditions of math operations, for example in `installed_contracts/SafeMath.sol`:
```
  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }
```
---
