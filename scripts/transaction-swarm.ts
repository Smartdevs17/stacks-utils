
import { 
  makeContractCall, 
  broadcastTransaction, 
  stringAsciiCV,
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Debug Network Exports
const NetworkLib = require('@stacks/network');
const STACKS_TESTNET = NetworkLib.STACKS_TESTNET; 

dotenv.config({ path: '.env' });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runSwarm() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("PRIVATE_KEY missing");
    return;
  }
  
  // Hardcoded standard devnet address - assuming this key matches ST1PQ...
  // If checksum fails, ensure this address IS correct for the key 753b...
  const contractAddress = 'SP9AS5B36MKC0FVF4DE75A1EBPANXQ14AEH98BH0'; 
  const contractName = 'transaction-gen-v1';

  console.log(`🐜 swarm-v1: Starting Micro-Transaction Generator...`);
  console.log(`Target: ${contractAddress}.${contractName}`);

  const ITERATIONS = 50; 
  
  for (let i = 0; i < ITERATIONS; i++) {
    try {
        const functionName = (i % 5 === 0) ? 'super-ping' : 'ping';
        const functionArgs = (functionName === 'ping') ? [stringAsciiCV(`swarm_tx_${Date.now()}_${i}`)] : [];

        const txOptions = {
            contractAddress,
            contractName,
            functionName,
            functionArgs,
            senderKey: privateKey,
            network: STACKS_TESTNET,
            anchorBlockOnly: false, 
            fee: 1000,
        };

        const transaction = await makeContractCall(txOptions);
        const result = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
        
        console.log(`[Swarm] TX #${i+1} (${functionName}) Broadcast: ${result.txid}`);
        // If result.error exists, log it
        if ((result as any).error) {
             console.error(`[Swarm] Broadcast Error:`, (result as any).error);
        }
        
        await sleep(2000); 

    } catch (e: any) {
        console.error(`[Swarm] TX #${i+1} Failed:`, e.message);
        // If checksum error, it means contractAddress is bad string.
    }
  }
  console.log("🐜 swarm-v1: Batch Complete.");
}

runSwarm();
