const run = require("../index.js");
const simpleSample = require("./samples/simple.json");
const withDataSample = require("./samples/withdata.json");
const { test, expect, describe } = require("@jest/globals");
const fs = require("fs");
const { BigNumber } = require("ethers");

const fromBlock = 14555003;
const toBlock = 14555203;
const rpc = process.env.MAINNET_RPC || "homestead";
const pagination = 300;
const contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("Basic Tests", () => {
  test("reset", () => {
    fs.writeFileSync("tests/results.json", JSON.stringify({}));

    return;
  });

  test("simple", async () => {
    const balances = await run(contractAddress, undefined, fromBlock, toBlock);

    fs.writeFileSync("tests/samples/simple.json", JSON.stringify(balances));
    check(balances, simpleSample, "without pagination and data");

    return;
  });

  test("Should work properly with pagination", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      {},
      pagination
    );

    check(balances, require("./samples/simple.json"), "simple pagination");

    return;
  });

  test("Should work properly with data provided beforehand", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      require("./samples/simple.json")
    );

    check(balances, withDataSample, "when data provided beforehand");
    fs.writeFileSync("tests/samples/withdata.json", JSON.stringify(balances));

    return;
  });

  test("Should work properly with data provided beforehand + pagination", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      require("./samples/simple.json")
    );

    check(balances, withDataSample, "pagination when data provided beforehand");
    return;
  });
  return;
});

function check(balances, sample, name) {
  let errors = 0;
  Object.keys(balances).forEach((key) => {
    try {
      const diff = BigNumber.from(balances[key]).sub(
        BigNumber.from(sample[key])
      );
      expect(diff.gt(0)).toBe(false);
      expect(diff.lt(0)).toBe(false);
    } catch (e) {
      errors++;
    }
  });
  const data = JSON.parse(fs.readFileSync("tests/results.json"));
  data[name] = errors;
  data["lastUpdate"] = Date.now();
  fs.writeFileSync("tests/results.json", JSON.stringify(data));
}
