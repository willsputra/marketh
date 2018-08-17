pragma solidity ^0.4.0;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/ownership/Ownable.sol";

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

    constructor() public {
        // CIRCUIT BREAKER
        stopped = false;
    }

    function toggleContractActive() onlyOwner public {
        stopped = !stopped;
    }


    // MODIFIER storeOwner
    modifier onlyStoreOwner(){
        require(storeOwners[msg.sender] == true);
        _;
    }

    modifier stopInEmergency() {
        if(!stopped) _;
    }

    modifier onlyInEmergency() {
        if(stopped) _;
    }

    // FUNCTION addStoreOwner [OWNER] PRIVATE
    function addStoreOwner(address _recipient) public onlyOwner stopInEmergency{
        storeOwners[_recipient] = true;
        storeOwnersCount = storeOwnersCount.add(1);
    }

    // FUNCTION removeStoreOwner [OWNER] PRIVATE
    function removeStoreOwner(address _recipient) public onlyOwner stopInEmergency{
        storeOwners[_recipient] = false;
        storeOwnersCount = storeOwnersCount.sub(1);
    }

    // FUNCTION viewStoreOwners [OWNER] PRIVATE

    // FUNCTION addStore [STOREOWNER]
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

    // FUNCTION removeStore [STOREOWNER]
    function removeStore(uint _storeId) public onlyStoreOwner stopInEmergency {
        stores[_storeId].active = false;
    }

    // FUNCTION addItem [STOREOWNER]
    function addItem(uint _storeId, string _imageUrl, string _title, string _description, uint _price, uint _quantity) public onlyStoreOwner {
        require(storeToStoreOwner[_storeId] == msg.sender);

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

    // FUNCTION removeItem [STOREOWNER]
    function removeItem(uint _itemId) public onlyStoreOwner stopInEmergency {
        items[_itemId].active = false;
    }

    // FUNCTION editItem [STOREOWNER]
    function editItem(uint _itemId, string _imageUrl, string _title, string _description, uint _price, uint _quantity) public onlyStoreOwner {
        require(storeToStoreOwner[items[_itemId].storeId] == msg.sender);

        items[_itemId].imageUrl = _imageUrl;
        items[_itemId].title = _title;
        items[_itemId].description = _description;
        items[_itemId].price = _price;
        items[_itemId].quantity = _quantity;
    }


    // FUNCTION buyItem [STOREOWNER | BUYER] [CANNOT BUY FROM OWN STORE]
    function buy(uint _itemId) public payable stopInEmergency {
        require(msg.sender != storeToStoreOwner[items[_itemId].storeId]);
        require(msg.value == items[_itemId].price);
        require(items[_itemId].quantity > 0);
        
        pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]] =  pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]].add(items[_itemId].price);
        items[_itemId].quantity = items[_itemId].quantity.sub(1);
    }
    

    // FUNCTION withdraw
    function withdraw() public {

        
        uint amount = pendingWithdrawals[msg.sender];
        // Prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}