const SHA256 = require('crypto-js/sha256');
const readline = require('readline');
var fs = require('fs');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash(); 
        }

        console.log("Block mined: " + this.hash);
        console.log("Nonce equals to " + this.nonce);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("12/12/2012", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('\nBlock successfully mined!\n');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance = balance - trans.amount;
                }

                if(trans.toAddress === address){
                    balance = balance + trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }    
        }
        return true;
    }
}

// testing program
/*
var myCoin = new Blockchain();

const nameInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

nameInput.question("Give us your nickname. ", (nickname) => {
    var userAddress = nickname + "-address";
    var userNickname = nickname;
    console.log(`Hello, ${nickname}!\n Would you like to make a transaction, ${nickname}?`);

    nameInput.close();
});

myCoin.createTransaction(new Transaction('public-key1', 'public-key2', 100));
myCoin.createTransaction(new Transaction('public-key2', 'public-key1', 50));

console.log(userNickname);
console.log(userAddress);

console.log('Starting the miner . . .');
myCoin.minePendingTransactions(userAddress.toString());

console.log(`Balance of ${userAddress} is ` + myCoin.getBalanceOfAddress(userAddress.toString()));

console.log('Starting the miner once more . . .');
myCoin.minePendingTransactions(userAddress.toString());

console.log(`Balance of ${userAddress} is ` + myCoin.getBalanceOfAddress('name-address') + 'MyCoins.');
*/
// ----------------------------------------------------------------------------

const amount = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

amount.question("Please specify how many blocks would you like to mine? ", (answer) => {
    console.log(`Starting the process of mining ${answer} blocks of MyCoin . . .`);

    for( let i = 1; i < answer; i++)
    {
        let date = new Date();
        console.log(`Mining block ${i} . . .`)

        myCoin.addBlock(new Block(i, date.toString(), { amount: (Math.floor(Math.random() * 6) + 1) }));
    }

    fs.writeFile("blockchain.txt", JSON.stringify(myCoin, null, 4), function(error){
        if(error){
            return console.log(error);
        }
        console.log('Details of your blockchain have been succesfully saved in the file!');
    });

    amount.close();
});



/*
console.log("Is block chain valid? " + myCoin.isChainValid());

myCoin.chain[1].data = { amount: 10000 };
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

console.log("Is block chain valid? " + myCoin.isChainValid());
*/