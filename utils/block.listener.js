const blockService = require("../services/block.service");

async function pollNewBlocks() {
  try {
    const block = await blockService.getCurrentBlockFromTron();

    const blockExists = await blockService.checkIfBlockExists(block.blockID);

    if (!blockExists) {
      console.log(`🧱 Новый блок #${block.blockID}`);
      await blockService.saveBlockToDb(block);
    } else {
      console.log(`⏩ Блок #${block.blockID} уже существует, пропускаем...`);
    }
  } catch (err) {
    console.error('Ошибка при опросе блока:', err);
  }
}

function startBlockPolling(intervalMs = 3000) {
  console.log(`📡 Запуск опроса блоков каждые ${intervalMs / 1000} секунд...`);
  setInterval(pollNewBlocks, intervalMs);
}

module.exports = { startBlockPolling };
