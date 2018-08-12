pragma solidity ^0.4.0;

contract Marketh {
    
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

    address public admin;

    mapping(address => bool) public storeOwners;
    
    uint public storeOwnersCount;
    uint public storesCount;
    uint public itemsCount;
    
    mapping (address => uint) pendingWithdrawals;


    constructor() public {
        admin = msg.sender;
    }

    // MODIFIER admin
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // MODIFIER storeOwner
    modifier onlyStoreOwner(){
        require(storeOwners[msg.sender] == true);
        _;
    }

    // FUNCTION addStoreOwner [ADMIN] PRIVATE
    function addStoreOwner(address _recipient) public onlyAdmin {
        storeOwners[_recipient] = true;
        storeOwnersCount++;
    }

    // FUNCTION removeStoreOwner [ADMIN] PRIVATE
    function removeStoreOwner(address _recipient) public onlyAdmin {
        storeOwners[_recipient] = false;
        storeOwnersCount--;
    }

    // FUNCTION viewStoreOwners [ADMIN] PRIVATE

    // FUNCTION addStore [STOREOWNER]
    function addStore(string _imageUrl, string _title, string _description) public onlyStoreOwner {
        Store memory newStore = Store({
            imageUrl: _imageUrl,
            title: _title,
            description: _description,
            active: true
        });
        
        storeToStoreOwner[storesCount] = msg.sender;
        storeOwnerToStores[msg.sender].push(storesCount);

        stores.push(newStore);

        storesCount++;
    }

    // FUNCTION removeStore [STOREOWNER]
    function removeStore(uint _storeId) public onlyStoreOwner {
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

        itemsCount++;
     }

    // FUNCTION removeItem [STOREOWNER]
    function removeItem(uint _itemId) public onlyStoreOwner {
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
    function buy(uint _itemId) public payable {
        require(msg.sender != storeToStoreOwner[items[_itemId].storeId]);
        require(msg.value == items[_itemId].price);
        require(items[_itemId].quantity > 0);
        
        pendingWithdrawals[storeToStoreOwner[items[_itemId].storeId]] += items[_itemId].price;
    }
    

    // FUNCTION withdraw
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}