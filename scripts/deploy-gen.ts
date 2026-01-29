
import { 
  makeContractDeploy, 
  broadcastTransaction, 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env' });

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
    // Decode address from transaction auth
    const StacksTx = require('@stacks/transactions');
    try {
        const addr = StacksTx.getAddressFromPrivateKey(privateKey, 26); // Explicit 26
        console.log("DERIVED ADDRESS:", addr);
    } catch(e) { console.log("Derivation failed in deploy:", e); }
    
    // We don't want to broadcast again if we just want the address, but fine.
    // It will error "ConflictingNonce" or similar if already done, which is fine.

    const result = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
    console.log('Transaction Generator V1 Broadcast:', result.txid);
  } catch (e) {
    console.error('Broadcast failed:', e);
  }
}

deployGen();
