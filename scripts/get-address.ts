import { getAddressFromPrivateKey } from '@stacks/transactions';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("PRIVATE_KEY missing");
  process.exit(1);
}

// Derive testnet address (version 26)
const address = getAddressFromPrivateKey(privateKey);
console.log(address);
