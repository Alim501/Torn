const prisma = require("../db");
const { defaultTronWeb } = require('../utils/tron');
const transactionService = require("../services/transaction.service");

async function getBlockFromTron(number) {
  const block = await defaultTronWeb.trx.getBlockByNumber(number);
  return block;
}
async function getCurrentBlockFromTron() {
  const block = await defaultTronWeb.trx.getCurrentBlock();
  return block;
}
async function getAllBlocks() {
  const blocks = await prisma.block.findMany({
    orderBy: { number: "desc" },
    include: {
      transactions: true,
    },
  });
  return blocks;
}

async function saveBlockToDb(block) {
  const { blockID, block_header, transactions = [] } = block;
  const raw = block_header.raw_data;

  const txPromises = transactions.map((tx) =>
    transactionService.saveTransactionToDb(tx)
  );

  const formattedTransactions = await Promise.all(txPromises);

  return prisma.block.create({
    data: {
      id: blockID,
      number: raw.number,
      txTrieRoot: raw.txTrieRoot,
      witnessAddress: raw.witness_address,
      parentHash: raw.parentHash,
      timestamp: new Date(raw.timestamp),
      witnessSignature: block_header.witness_signature,
      transactions: {
        create: formattedTransactions,
      },
    },
  });
}

const TronWeb = require('tronweb');
function toHexAddress(hex) {
  return TronWeb.address.fromHex(hex);
}

async function checkIfBlockExists(blockID) {
  const block = await prisma.block.findUnique({
    where: { id: blockID },
  });
  return !!block;
}

module.exports = {
  getAllBlocks,
  getCurrentBlockFromTron,
  getBlockFromTron,
  saveBlockToDb,
  checkIfBlockExists,
};
