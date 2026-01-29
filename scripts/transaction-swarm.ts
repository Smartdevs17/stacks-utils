
import { 
  makeContractCall, 
  broadcastTransaction, 
  stringAsciiCV,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '../.env' });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runSwarm() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("PRIVATE_KEY missing");
    return;
  }
  
  // This should match the deployed address from deploy-gen.ts
  // For this atomic run, we'll hardcode or grab from config if we had a shared one for scripts.
  // Using the deployer address as default.
  const contractAddress = 'ST1PQ24CH0EKEDT2R3S6A7D9D99N6B0X7FR05624W';
  const contractName = 'transaction-gen-v1';

  console.log("🐜 swarm-v1: Starting Micro-Transaction Generator...");

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
            anchorBlockOnly: false, // False for faster mempool acceptance on testnet
            fee: 1000, // Min fee
        };

        const transaction = await makeContractCall(txOptions);
        const result = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
        
        console.log(`[Swarm] TX #${i+1} (${functionName}) Broadcast: ${result.txid}`);
        
        // Wait a bit to avoid sequence errors if mempool is slow
        await sleep(2000); 

    } catch (e) {
        console.error(`[Swarm] TX #${i+1} Failed:`, e);
        await sleep(5000);
    }
  }
  console.log("🐜 swarm-v1: Batch Complete.");
}

runSwarm();
