const { getUserTronWeb,defaultTronWeb } = require('../utils/tron');

async function sendTrx(privateKey, fromAddress, toAddress, amount) {
  const tronWeb = getUserTronWeb(privateKey);

  try {
    const balance = await tronWeb.trx.getBalance(fromAddress);
    console.log('Баланс отправителя:', tronWeb.fromSun(balance));
    if (balance < amount) throw new Error('Недостаточно средств');

    const unsignedTx = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      amount,
      fromAddress
    );

    const signedTx = await tronWeb.trx.sign(unsignedTx, privateKey);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);

    if (result.result) {
      console.log('✅ TX Hash:', result.txid);
      return result.txid;
    } else {
      console.error('❌ Ошибка отправки:', result);
      throw new Error('Ошибка отправки транзакции');
    }

  } catch (err) {
    console.error('❗ Ошибка транзакции:', err.message);
    throw err;
  }
}


function toHexAddress(addr) {
  return defaultTronWeb.address.fromHex(addr);
}

async function saveTransactionToDb(tx) {
  const contract = tx.raw_data?.contract?.[0];
  const type = contract?.type;
  const value = contract?.parameter?.value || {};

  let fromAddress = null;
  let toAddress = null;
  let amount = null;

  switch (type) {
    case "TransferContract":
      fromAddress = value.owner_address ? toHexAddress(value.owner_address) : null;
      toAddress = value.to_address ? toHexAddress(value.to_address) : null;
      amount = value.amount ? value.amount / 1_000_000 : null; // TRX
      break;

    case "TriggerSmartContract":
      fromAddress = value.owner_address ? toHexAddress(value.owner_address) : null;
      toAddress = value.contract_address ? toHexAddress(value.contract_address) : null;
      break;

    case "VoteWitnessContract":
      fromAddress = value.owner_address ? toHexAddress(value.owner_address) : null;
      break;


    default:
      fromAddress = value.owner_address ? toHexAddress(value.owner_address) : null;
  }

  return {
    id: tx.txID,
    timestamp: tx.raw_data?.timestamp ? new Date(tx.raw_data.timestamp) : null,
    expiration: tx.raw_data?.expiration ? new Date(tx.raw_data.expiration) : null,
    contractType: type,
    rawData: tx.raw_data,
    signature: tx.signature || [],
    fromAddress,
    toAddress,
    amount,
  };
}


module.exports = {
  sendTrx,
  saveTransactionToDb
};
