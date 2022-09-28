# Anchor Counter Program

## Install dependencies

```bash
yarn
```

## Build rust code

```bash
anchor build
```

## Deploy on chain

```bash
anchor deploy
```

## Configure Chain to deploy

In the `Anchor.toml` file you can configure the `provider` for chain to deploy and the default wallet

```toml
[provider]
cluster = "localnet" //change the cluster to- devnet/testnet/mainnet for desired chain
wallet = "~/.config/solana/id.json"
```

## Copy IDL to frontend

```bash
yarn copy-idl
```

You can configure the copying location in the `copyIDL.js` file

```javascript
//update the directory
fs.writeFileSync('./app/public/idl.json', JSON.stringify(idl));
```
