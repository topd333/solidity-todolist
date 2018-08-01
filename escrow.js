solc = require('solc')
Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

source = `pragma solidity ^0.4.0;

contract Escrow {
    enum State {AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED}
    State public currentState;

    modifier buyerOnly() {
        require(msg.sender == buyer || msg.sender == arbiter);
        _;
    }

    modifier sellerOnly() {
        require(msg.sender == seller || msg.sender == arbiter);
        _;
    }

    modifier inState(State expectedState) {
        require(currentState == expectedState);
        _;
    }

    address public buyer;
    address public seller;
    address public arbiter;

    function Escrow(address _buyer, address _seller, address _arbiter) {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
    }

    function confirmPayment() buyerOnly inState(State.AWAITING_PAYMENT) payable {
        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() buyerOnly inState(State.AWAITING_DELIVERY) {
        seller.send(this.balance);
        currentState = State.COMPLETE;
    }

    function refundBuyer() sellerOnly inState(State.AWAITING_DELIVERY) {
        buyer.send(this.balance);
        currentState = State.REFUNDED;
    }
}`

compiled = solc.compile(source)

abi = JSON.parse(compiled.contracts[':Escrow'].interface)

bytecode = compiled.contracts[':Escrow'].bytecode

contract = new web3.eth.Contract(abi)

web3.eth.getAccounts().then(result => accounts = result)

buyer = accounts[0]

seller = accounts[1]

arbiter = accounts[2]

contract.deploy({data: bytecode, arguments: [buyer, seller, arbiter]}).send({from: seller, gas: 900000}).then(result => instance = result)

instance.options.address

instance.methods.currentState().call({from:buyer}).then(result => console.log(result))

instance.methods.confirmPayment().send({from: buyer, value:web3.utils.toWei(50, 'ether')}).then(result => console.log(result))

web3.eth.getBalance(instance.options.address).then(result => console.log(result))

web3.utils.fromWei(50000000000000000000, 'ether')

instance.methods.confirmDelivery().send({from: buyer}).then(reuslt => console.log(result))
