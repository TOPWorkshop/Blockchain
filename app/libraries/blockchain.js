import crypto from 'crypto';
import config from 'config';
import moment from 'moment';

class Block {
  constructor(data = null, index = 0, previousHash, timestamp = moment()) {
    this.data = data;
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;

    this.hash = crypto.createHash(config.get('blockchain.hashAlgorithm')).update(this.content, 'utf8').digest();
  }

  get content() {
    return `${this.data} ${this.index} ${this.timestamp} ${this.previousHash}`;
  }
}

class Blockchain {
  constructor() {
    this.blocks = [];
  }

  initBlockchain() {
    this.blocks.push(new Block());
  }

  addBlock(data) {
    const block = new Block(data, this.lastBlock.index + 1, this.lastBlock.hash);
    this.blocks.push(block);

    return block;
  }

  get lastBlock() {
    if (this.blocks.length === 0) {
      throw new Error('Blockchain is empty');
    }

    return this.blocks[this.blocks.length - 1];
  }
}

export default new Blockchain();
