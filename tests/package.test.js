const run = require("../index.js");
const simpleSample = require("./samples/simple.json");
const withDataSample = require("./samples/withdata.json");
const { test, expect, describe } = require("@jest/globals");
const fs = require("fs");

const fromBlock = 14555103;
const toBlock = 14555203;
const rpc = "homestead";
const pagination = 50;

describe("Basic Tests", () => {
  test("Should use default RPC when none provided", async () => {
    const balances = await run(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      undefined,
      fromBlock,
      toBlock
    );
    check(balances, simpleSample);
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
    check(balances, simpleSample);
  });

  test("Should work properly with data provided beforehand", async () => {
    const balances = await run(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      rpc,
      fromBlock,
      toBlock,
      simpleSample,
      50
    );
    check(balances, withDataSample);
  });
});

function check(balances, sample) {
  Object.keys(balances).forEach((key) => {
    expect(balances[key]).toBe(sample[key]);
  });
}
