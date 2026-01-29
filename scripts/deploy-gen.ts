
import { 
  makeContractDeploy, 
  broadcastTransaction, 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '../.env' });

async function deployGen() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("PRIVATE_KEY missing");
    return;
  }

  const contractPath = path.join(__dirname, '../contracts/transaction-gen-v1.clar');
  const codeBody = fs.readFileSync(contractPath, 'utf8');

  const txOptions = {
    contractName: 'transaction-gen-v1',
    codeBody,
    senderKey: privateKey,
    network: STACKS_TESTNET,
    anchorBlockOnly: true,
  };

  try {
    const transaction = await makeContractDeploy(txOptions);
    const result = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
    console.log('Transaction Generator V1 Broadcast:', result.txid);
  } catch (e) {
    console.error('Broadcast failed:', e);
  }
}

deployGen();
