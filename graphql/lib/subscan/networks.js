const networks = [
  { name: "Polkadot", chainId: "polkadot", status: "live" },
  { name: "Kusama", chainId: "kusama", status: "live" },
  { name: "Darwinia2", chainId: "darwinia", status: "live" },
  { name: "Assethub Polkadot", chainId: "assethub-polkadot", status: "live" },
  { name: "Assethub Kusama", chainId: "assethub-kusama", status: "live" },
  { name: "Assethub Rococo", chainId: "assethub-rococo", status: "test" },
  { name: "Acala", chainId: "acala", status: "live" },
  { name: "Acala Mandala", chainId: "acala-testnet", status: "test" },
  { name: "Alephzero", chainId: "alephzero", status: "live" },
  { name: "Altair", chainId: "altair", status: "live" },
  { name: "Astar", chainId: "astar", status: "live" },
  { name: "Bajun", chainId: "bajun", status: "live" },
  { name: "Basilisk", chainId: "basilisk", status: "live" },
  { name: "Bifrost", chainId: "bifrost", status: "live" },
  { name: "Bifrost Kusama", chainId: "bifrost-kusama", status: "live" },
  { name: "Bifrost Testnet", chainId: "bifrost-testnet", status: "live" },
  { name: "Calamari", chainId: "calamari", status: "live" },
  { name: "Centrifuge", chainId: "centrifuge", status: "live" },
  { name: "Centrifuge Solo", chainId: "centrifuge-standalone-history", status: "live" },
  { name: "ChainX", chainId: "chainx", status: "live" },
  { name: "Clover", chainId: "clover", status: "live" },
  { name: "Clover Parachain", chainId: "clv", status: "live" },
  { name: "Clover Testnet", chainId: "clover-testnet", status: "test" },
  { name: "Composable", chainId: "composable", status: "live" },
  { name: "Crab2", chainId: "crab", status: "live" },
  { name: "Crust", chainId: "crust", status: "live" },
  { name: "Crust Maxwell", chainId: "maxwell", status: "test" },
  { name: "Crust Shadow", chainId: "shadow", status: "live" },
  { name: "DeepBrain Chain", chainId: "dbc", status: "live" },
  { name: "Dock", chainId: "dock", status: "live" },
  { name: "Dolphin", chainId: "dolphin", status: "test" },
  { name: "Edgeware", chainId: "edgeware", status: "live" },
  { name: "Efinity", chainId: "efinity", status: "live" },
  { name: "Encointer", chainId: "encointer", status: "live" },
  { name: "Equilibrium", chainId: "equilibrium", status: "live" },
  { name: "Genshiro", chainId: "genshiro", status: "live" },
  { name: "Humanode", chainId: "humanode", status: "live" },
  { name: "HydraDX", chainId: "hydradx", status: "live" },
  { name: "IntegriTEE", chainId: "integritee", status: "live" },
  { name: "Interlay", chainId: "interlay", status: "live" },
  { name: "Karura", chainId: "karura", status: "live" },
  { name: "Kintsugi", chainId: "kintsugi", status: "live" },
  { name: "Khala", chainId: "khala", status: "live" },
  { name: "krest", chainId: "krest", status: "live" },
  { name: "KILT Peregrine", chainId: "kilt-testnet", status: "test" },
  { name: "KILT Spiritnet", chainId: "spiritnet", status: "live" },
  { name: "Litmus", chainId: "litmus", status: "live" },
  { name: "Mangata", chainId: "mangatax", status: "live" },
  { name: "Moonbase", chainId: "moonbase", status: "test" },
  { name: "Moonbeam", chainId: "moonbeam", status: "live" },
  { name: "Moonriver", chainId: "moonriver", status: "live" },
  { name: "Nodle", chainId: "nodle", status: "live" },
  { name: "Origintrail", chainId: "origintrail", status: "live" },
  { name: "Origintrail Testnet", chainId: "origintrail-testnet", status: "test" },
  { name: "Pangolin", chainId: "pangolin", status: "test" },
  { name: "Pangolin Parachain", chainId: "pangolin-parachain", status: "test" },
  { name: "Pangoro", chainId: "pangoro", status: "test" },
  { name: "Parallel", chainId: "parallel", status: "live" },
  { name: "Parallel Heiko", chainId: "parallel-heiko", status: "live" },
  { name: "peaq", chainId: "peaq-testnet", status: "test" },
  { name: "Phala", chainId: "phala", status: "live" },
  { name: "Picasso", chainId: "picasso", status: "live" },
  { name: "Picasso Rococo", chainId: "picasso-rococo", status: "test" },
  { name: "Pioneer", chainId: "pioneer", status: "live" },
  { name: "Polkadex", chainId: "polkadex", status: "live" },
  { name: "Polymesh", chainId: "polymesh", status: "live" },
  { name: "Polymesh Testnet", chainId: "polymesh-testnet", status: "test" },
  { name: "Plasm", chainId: "plasm", status: "live" },
  { name: "Quartz", chainId: "quartz", status: "live" },
  { name: "Reef", chainId: "reef", status: "live" },
  { name: "Robonomics", chainId: "robonomics", status: "live" },
  { name: "Rococo", chainId: "rococo", status: "test" },
  { name: "Sakura", chainId: "sakura", status: "live" },
  { name: "Shibuya", chainId: "shibuya", status: "test" },
  { name: "Shiden", chainId: "shiden", status: "live" },
  { name: "SORA", chainId: "sora", status: "live" },
  { name: "Subspace", chainId: "subspace", status: "live" },
  { name: "Stafi", chainId: "stafi", status: "live" },
  { name: "Tanganika", chainId: "datahighway", status: "live" },
  { name: "Turing", chainId: "turing", status: "live" },
  { name: "Unique", chainId: "unique", status: "live" },
  { name: "Vara", chainId: "vara", status: "live" },
  { name: "Westend", chainId: "westend", status: "test" },
  { name: "Zeitgeist", chainId: "zeitgeist", status: "live" }
]

export default networks
