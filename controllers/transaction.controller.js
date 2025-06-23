const transactionService = require("../services/transaction.service");

async function sendTransaction(req, res) {
  const { toAdress, amount } = req.body;
  const { address, privateKey } = req.user;

  try {
    const txid = await transactionService.sendTrx(
      privateKey,
      address,
      toAdress,
      amount
    );

    res.json({
      success: true,
      txid,
      message: "Transaction sent successfully"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Ошибка при отправке транзакции',
    });
  }
}

module.exports = {
  sendTransaction,
};
