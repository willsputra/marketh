pragma solidity ^0.4.22;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/ownership/Ownable.sol";

/** @title Marketh */
contract Marketh is Ownable {

    using SafeMath for uint;
    
    struct Item {
        uint storeId;
        string imageUrl;
        string title;
        string description;
        uint price;
        uint quantity;
        bool active;
    }
    
    struct Store {
        string imageUrl;
        string title;
        string description;
        bool active;
    }

    Store[] public stores;
    
    Item[] public items;
    
    mapping(uint => address) public storeToStoreOwner;
    mapping(address => uint[]) public storeOwnerToStores;
    
    mapping(uint => uint) public itemToStore;

    mapping(address => bool) public storeOwners;
    
    uint public storeOwnersCount;
    uint public storesCount;
    uint public itemsCount;
    
    mapping (address => uint) pendingWithdrawals;
    //GETTER FOR PENDINGWITHDRAWALS!!

    bool stopped; 

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


    modifier onlyStoreOwner(){
        require(storeOwners[msg.sender] == true, "You are not a store owner.");
        _;
    }

    /** @dev Adds an address as a Store Owner.
      * @param _recipient Address of the Store Owner.
      */       
    function addStoreOwner(address _recipient) public onlyOwner stopInEmergency{
        storeOwners[_recipient] = true;
        storeOwnersCount = storeOwnersCount.add(1);
    }

    /** @dev Removes a Store Owner.
      * @param _recipient Address of the Store Owner.
      */    
    function removeStoreOwner(address _recipient) public onlyOwner stopInEmergency{
        storeOwners[_recipient] = false;
        storeOwnersCount = storeOwnersCount.sub(1);
    }

    /** @dev Adds a Store.
      * @param _imageUrl Image URL of the Store
      * @param _title Title of the Store
      * @param _description Description of the Store
      */    
    function addStore(string _imageUrl, string _title, string _description) public onlyStoreOwner stopInEmergency {
        Store memory newStore = Store({
            imageUrl: _imageUrl,
            title: _title,
            description: _description,
            active: true
        });
        
        storeToStoreOwner[storesCount] = msg.sender;
        storeOwnerToStores[msg.sender].push(storesCount);

        stores.push(newStore);

        storesCount = storesCount.add(1);
    }

    /** @dev Removes a Store.
      * @param _storeId ID of the Store (index in stores array)
      */ 
    function removeStore(uint _storeId) public onlyStoreOwner stopInEmergency {
        stores[_storeId].active = false;
    }

    /** @dev Adds an Item.
      * @param _storeId ID of the Store (index in stores array)
      * @param _imageUrl Image URL of the Item
      * @param _title Title of the Item
      * @param _description Description of the Item
      * @param _price Price of the Item
      * @param _quantity Quantity of the Item
      */    
    function addItem(uint _storeId, string _imageUrl, string _title, string _description, uint _price, uint _quantity) public onlyStoreOwner {
        require(storeToStoreOwner[_storeId] == msg.sender, "You are not the owner of this store.");

        Item memory newItem = Item({
            storeId: _storeId,
            imageUrl: _imageUrl,
            title: _title,
            description: _description,
            price: _price,
            quantity: _quantity,
            active: true
        });

        items.push(newItem);
        
        itemToStore[itemsCount] = _storeId;

        itemsCount = itemsCount.add(1);
     }

    /** @dev Removes an Item.
      * @param _itemId ID of the Item (index in items array)
      */ 
    function removeItem(uint _itemId) public onlyStoreOwner stopInEmergency {
        items[_itemId].active = false;
    }

    /** @dev Edits an Item.
      * @param _itemId ID of the Item (index in items array)
      * @param _imageUrl Image URL of the Item (new)
      * @param _title Title of the Item (new)
      * @param _description Description of the Item (new)
      * @param _price Price of the Item (new)
      * @param _quantity Quantity of the Item (new)
      */   
    function editItem(uint _itemId, string _imageUrl, string _title, string _description, uint _price, uint _quantity) public onlyStoreOwner {
        require(storeToStoreOwner[items[_itemId].storeId] == msg.sender, "You are not the store owner of this item.");

        items[_itemId].imageUrl = _imageUrl;
        items[_itemId].title = _title;
        items[_itemId].description = _description;
        items[_itemId].price = _price;
        items[_itemId].quantity = _quantity;
    }


    /** @dev Buys an Item.
      * @param _itemId ID of the Item (index in items array)
      */   
    function buy(uint _itemId) public payable stopInEmergency {
        require(msg.sender != storeToStoreOwner[items[_itemId].storeId], "You are not able to buy your own item.");
        require(msg.value == items[_itemId].price, "Value transferred is not the same as price.");
        require(items[_itemId].quantity > 0, "This item is sold out.");
        
        pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]] = pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]].add(items[_itemId].price);
        items[_itemId].quantity = items[_itemId].quantity.sub(1);
    }
    
    /** @dev Withdraws the balance.
      */   
    function withdraw() public {

        
        uint amount = pendingWithdrawals[msg.sender];
        // Prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}