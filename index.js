import Server from './app';
import blockchain from './app/libraries/blockchain';

const server = new Server();

server.listen()
  .then(() => blockchain.initBlockchain());
