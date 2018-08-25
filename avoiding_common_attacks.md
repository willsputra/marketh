# Avoiding Common Attacks

Several measures are taken sto avoid common attacks.

---

## Re-entrancy
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
## Integer Overflow and Underflow
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
