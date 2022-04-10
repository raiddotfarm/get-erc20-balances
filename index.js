const { ethers, BigNumber } = require("ethers");
const abi = require("./abi.json");
module.exports = async function getBalance(
  contract,
  rpc,
  startBlock,
  endBlock,
  data,
  paginateLimit
) {
  if (!contract) {
    throw new Error("Contract address is required");
  }
  if (!rpc) {
    console.warn(
      "No rpc provided, using default rpc - this might be very slow"
    );
  }
  if (!startBlock) {
    console.warn(
      "No start block provided, using default start block - this may or may not be slow"
    );
  }
  if (!endBlock) {
    console.warn(
      "No end block provided, using default end block - this may or may not be slow"
    );
  }
  if (!data) {
    console.warn("No data provided, calculating from scratch");
  }
  if (!paginateLimit) {
    console.warn(
      "No paginate limit provided, searching all blocks at once - this may cause an error if there are too many blocks"
    );
    paginateLimit = 0;
  }

  const provider = ethers.getDefaultProvider(rpc);
  const tokenContract = new ethers.Contract(contract, abi, provider);
  const lastBlock = endBlock || (await provider.getBlockNumber());
  let balances = data || {};
  if (!startBlock) {
    startBlock = 0;
  }
  if (paginateLimit > 0 && lastBlock - startBlock > paginateLimit) {
    currentBlock = startBlock;
    while (currentBlock < lastBlock) {
      const events = await getEvents(
        tokenContract,
        currentBlock,
        currentBlock + paginateLimit
      );
      balances = await fillData(balances, events);
      currentBlock += paginateLimit;
    }
  } else {
    const events = await getEvents(tokenContract, startBlock, lastBlock);
    balances = await fillData(balances, events);
  }

  Object.keys(balances).forEach((key) => {
    balances[key] = balances[key].toNumber();
  });
  delete balances["0x0000000000000000000000000000000000000000"];
  return balances;
};

async function getEvents(tokenContract, startBlock, endBlock) {
  return await tokenContract
    .queryFilter("*", startBlock + 1, endBlock)
    .then((events) => {
      events = events.filter((x) =>
        x.topics.includes(
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        )
      );
      return events;
    });
}

function fillData(balances, events) {
  const txns = events.map((x) => x.args);
  txns.forEach((item) => {
    const from = item.from;
    const to = item.to;
    const amount = item.value;
    if (!Object.keys(balances).includes(from)) {
      balances[from] = BigNumber.from(0);
    }
    if (!Object.keys(balances).includes(to)) {
      balances[to] = BigNumber.from(0);
    }

    balances[from] = BigNumber.from(balances[from]).sub(amount);

    balances[to] = BigNumber.from(balances[to]).add(amount);
  });
  return balances;
}
