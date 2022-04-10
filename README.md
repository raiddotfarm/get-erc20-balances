utility package used by raid apps, wrapper around [this registry](https://chainid.network/chains.json), updated every week.

### get chain name

```js
const find = require("@raiddotfarm/get-chain-name");

chainName = find(1);
console.log(chainName);
```

Output:

```bash
Ethereum Mainnet
```

### get chain metadata

```js
chainData = find(1);
console.log(chainData);
```

Output:

```json
{
  "chain": "ETH",
  "chainId": 1,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "etherscan",
      "standard": "EIP3091",
      "url": "https://etherscan.io"
    }
  ],
  "faucets": [],
  "icon": "ethereum",
  "infoURL": "https://ethereum.org",
  "name": "Ethereum Mainnet",
  "nativeCurrency": {
    "decimals": 18,
    "name": "Ether",
    "symbol": "ETH"
  },
  "networkId": 1,
  "rpc": [
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com"
  ],
  "shortName": "eth",
  "slip44": 60
}
```
