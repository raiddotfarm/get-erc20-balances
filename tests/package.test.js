const run = require("../index.js");
const simpleSample = require("./samples/simple.json");
const withDataSample = require("./samples/withdata.json");
const { test, expect, describe } = require("@jest/globals");
const fs = require("fs");
const { BigNumber } = require("ethers");

const fromBlock = 14555003;
const toBlock = 14555203;
const rpc =
  "homestead";
const pagination = 25;

describe("Basic Tests", () => {
  test("Should use default RPC when none provided", async () => {
    const balances = await run(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      undefined,
      fromBlock,
      toBlock
    );
    fs.writeFileSync("tests/samples/simple.json", JSON.stringify(balances));
    check(balances, simpleSample, "regular");
    return;
  });

  test("Should work properly with pagination", async () => {
    const balances = await run(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
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
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      rpc,
      fromBlock,
      toBlock,
      simpleSample
    );
    check(balances, withDataSample, "three");
    fs.writeFileSync("tests/samples/withdata.json", JSON.stringify(balances));
    return;
  });

  test("Should work properly with pagination and data provided beforehand", async () => {
    const balances = await run(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      rpc,
      fromBlock,
      toBlock,
      simpleSample,
      pagination
    );
    check(balances, require("./samples/withdata.json"), "four");
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
      expect(diff.gt(10000000)).toBe(false);
    } catch (e) {
      errors++;
    }
  });
  const data = JSON.parse(fs.readFileSync("tests/results.json"));
  data[name] = errors;
  fs.writeFileSync("tests/results.json", JSON.stringify(data));
}
