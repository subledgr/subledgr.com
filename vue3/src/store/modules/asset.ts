// TODO add decimals to all assets
const chains = [
  { id: '3dpass', type: 'crypto', name: '3DPass', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/3dpass.png' },
  { id: 'aband', type: 'crypto', name: 'Aband', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'acala', type: 'crypto', name: 'Acala', active: true, 
    decimals: 12, parent: 'polkadot', parachain: true, code: 'ACA', logo: 'images/logos/chains/acala.svg' },

  { id: 'ajuna network', type: 'crypto', name: 'Ajuna Network', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/ajuna.png' },
  { id: 'aleph zero', type: 'crypto', name: 'Aleph Zero', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/aleph.svg' },
  { id: 'altair', type: 'crypto', name: 'Altair', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/altair.svg' },
  { id: 'amplitude', type: 'crypto', name: 'Amplitude', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/amplitude.svg' },




  { id: 'ares odyssey', type: 'crypto', name: 'Ares Odyssey', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/ares-odyssey.svg' },

  { id: 'astar', type: 'crypto', name: 'Astar', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/astar.png' },
  { id: 'automata', type: 'crypto', name: 'Automata', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/automata.png' },
  { id: 'aventus', type: 'crypto', name: 'Aventus', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/aventus.svg' },
  { id: 'bajun network', type: 'crypto', name: 'Bajun Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/bajun.png' },

  { id: 'basilisk', type: 'crypto', name: 'Basilisk', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/basilisk.png' },

  { id: 'bifrost', type: 'crypto', name: 'Bifrost', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/bifrost.svg' },
  { id: 'bifrost', type: 'crypto', name: 'Bifrost', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/bifrost.svg' },
  { id: 'bit.country pioneer', type: 'crypto', name: 'Bit.Country Pioneer', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/bitcountry.png' },
  { id: 'bitgreen', type: 'crypto', name: 'Bitgreen', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/bitgreen.png' },
  { id: 'bittensor', type: 'crypto', name: 'Bittensor', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/bittensor.png' },

  { id: 'bridgehub', type: 'crypto', name: 'BridgeHub', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/BridgeHub.svg' },
  { id: 'bridgehub', type: 'crypto', name: 'BridgeHub', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/BridgeHubBlack.svg' },
  { id: 'calamari', type: 'crypto', name: 'Calamari', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/calamari.png' },
  { id: 'centrifuge', type: 'crypto', name: 'Centrifuge', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/centrifuge.png' },

  { id: 'chainx', type: 'crypto', name: 'ChainX', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/chainx.svg' },
  { id: 'clover', type: 'crypto', name: 'Clover', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/clover.svg' },
  { id: 'collectives', type: 'crypto', name: 'Collectives', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/empty.svg' },


  { id: 'composable finance', type: 'crypto', name: 'Composable Finance', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/composableFinance.png' },


  { id: 'creditcoin', type: 'crypto', name: 'Creditcoin', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/creditcoin.png' },
  { id: 'crown sterling', type: 'crypto', name: 'Crown Sterling', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/crown-sterling.png' },
  { id: 'crust', type: 'crypto', name: 'Crust', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/crust.svg' },
  { id: 'crust network', type: 'crypto', name: 'Crust Network', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/crust-maxwell.svg' },
  { id: 'crust shadow', type: 'crypto', name: 'Crust Shadow', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/crustParachain.svg' },

  { id: 'dao ipci', type: 'crypto', name: 'DAO IPCI', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'darwinia', type: 'crypto', name: 'Darwinia', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/darwinia.svg' },
  { id: 'darwinia', type: 'crypto', name: 'Darwinia', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/empty.svg' },
  { id: 'darwinia crab', type: 'crypto', name: 'Darwinia Crab', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/empty.svg' },


  { id: 'debio', type: 'crypto', name: 'DeBio', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/debio.svg' },
  { id: 'dock', type: 'crypto', name: 'Dock', active: false, parent: '', parachain: false, code: 'DOCK', decimals: 6, logo: 'images/logos/nodes/dock-mainnet.png' },



  { id: 'dora factory', type: 'crypto', name: 'Dora Factory', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/dorafactory.png' },


  { id: 'edgeware', type: 'crypto', name: 'Edgeware', active: false, parent: '', parachain: false, code: 'EDGE', logo: 'images/logos/nodes/edgeware-white.png' },

  { id: 'efinity', type: 'crypto', name: 'Efinity', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/efinity.svg' },
  { id: 'encointer network', type: 'crypto', name: 'Encointer Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/encointer-blue.svg' },
  { id: 'equilibrium', type: 'crypto', name: 'Equilibrium', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/equilibrium.svg' },

  { id: 'fragnova', type: 'crypto', name: 'Fragnova', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/empty.svg' },

  { id: 'frequency', type: 'crypto', name: 'Frequency', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/frequency.svg' },




  { id: 'genshiro', type: 'crypto', name: 'Genshiro', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/genshiro.svg' },
  { id: 'gm', type: 'crypto', name: 'GM', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/gm.png' },

  { id: 'hashed network', type: 'crypto', name: 'Hashed Network', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/hashed.png' },

  { id: 'humanode', type: 'crypto', name: 'Humanode', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/empty.svg' },
  { id: 'hydradx', type: 'crypto', name: 'HydraDX', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/hydrate.png' },


  { id: 'imbue network', type: 'crypto', name: 'Imbue Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/imbue.png' },
  { id: 'integritee network', type: 'crypto', name: 'Integritee Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/integritee.svg' },
  { id: 'integritee shell', type: 'crypto', name: 'Integritee Shell', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'interlay', type: 'crypto', name: 'Interlay', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/interlay.svg' },
  { id: 'invarch tinkernet', type: 'crypto', name: 'InvArch Tinkernet', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/ipci.svg' },



  { id: 'joystream', type: 'crypto', name: 'Joystream', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/joystream.svg' },


  { id: 'kabocha', type: 'crypto', name: 'Kabocha', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/kabocha.svg' },
  { id: 'kapex', type: 'crypto', name: 'Kapex', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'karura', type: 'crypto', name: 'Karura', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/karura.svg' },
  { id: 'khala network', type: 'crypto', name: 'Khala Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/khala.svg' },
  { id: 'kico', type: 'crypto', name: 'KICO', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/kico.png' },
  { id: 'kilt spiritnet', type: 'crypto', name: 'KILT Spiritnet', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/kilt.png' },
  { id: 'kintsugi btc', type: 'crypto', name: 'Kintsugi BTC', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/kintsugi.png' },


  { id: 'kulupu', type: 'crypto', name: 'Kulupu', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/kulupu.svg' },
  { id: 'kusama', type: 'crypto', decimals: 12, name: 'Kusama', active: true, parent: '', parachain: false, code: 'KSM', logo: 'images/logos/chains/kusama.svg' },
  { id: 'kusari', type: 'crypto', name: 'Kusari', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/kusari.svg' },
  { id: 'kylin', type: 'crypto', name: 'Kylin', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/kylin.png' },

  { id: 'litentry', type: 'crypto', name: 'Litentry', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/litentry.png' },
  { id: 'litmus', type: 'crypto', name: 'Litmus', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/litmus.png' },
  { id: 'logion standalone', type: 'crypto', name: 'logion Standalone', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/logion.png' },


  { id: 'mangata', type: 'crypto', name: 'Mangata', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/mangata.png' },

  { id: 'manta', type: 'crypto', name: 'Manta', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/manta.png' },




  { id: 'moonbeam', type: 'crypto', name: 'Moonbeam', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/moonsama.png' },
  { id: 'moonriver', type: 'crypto', name: 'Moonriver', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/moonriver.svg' },


  { id: 'myriad', type: 'crypto', name: 'Myriad', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/myriad.svg' },

  { id: 'neatcoin', type: 'crypto', name: 'Neatcoin', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/empty.svg' },
  { id: 'nftmart', type: 'crypto', name: 'NFTMart', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/nftmart.png' },
  { id: 'nodle', type: 'crypto', name: 'Nodle', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/nodle.svg' },
  { id: 'origintrail', type: 'crypto', name: 'OriginTrail', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'parallel', type: 'crypto', name: 'Parallel', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/parallel.svg' },
  { id: 'parallel heiko', type: 'crypto', name: 'Parallel Heiko', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'pendulum', type: 'crypto', name: 'Pendulum', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/pendulum.svg' },
  { id: 'phala network', type: 'crypto', name: 'Phala Network', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/phala.svg' },
  { id: 'picasso', type: 'crypto', name: 'Picasso', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/picasso.svg' },
  { id: 'pichiu', type: 'crypto', name: 'Pichiu', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/pichiu.png' },
  { id: 'polkadex', type: 'crypto', name: 'Polkadex', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/polkadex.svg' },
  { id: 'polkadot', type: 'crypto', decimals: 10, name: 'Polkadot', active: true, parent: '', parachain: false, code: 'DOT', logo: 'images/logos/chains/polkadot.svg' },
  { id: 'polymesh mainnet', type: 'crypto', name: 'Polymesh Mainnet', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/polymesh.svg' },
  { id: 'quartz by unique', type: 'crypto', name: 'QUARTZ by UNIQUE', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/quartz.png' },
  { id: 'riodefi', type: 'crypto', name: 'RioDeFi', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/riodefi.png' },
  { id: 'robonomics', type: 'crypto', name: 'Robonomics', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/robonomics.svg' },
  { id: 'sherpax', type: 'crypto', name: 'SherpaX', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/sherpax.png' },
  { id: 'shiden', type: 'crypto', name: 'Shiden', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/shiden.png' },
  { id: 'snow network', type: 'crypto', name: 'SNOW Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/snowbridge.png' },
  { id: 'sora', type: 'crypto', name: 'SORA', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/sora-substrate.svg' },
  { id: 'sora', type: 'crypto', name: 'SORA', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/empty.svg' },
  { id: 'statemine', type: 'crypto', name: 'Statemine', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/statemine.svg' },
  { id: 'statemint', type: 'crypto', name: 'Statemint', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/statemint.png' },
  { id: 'subsocialx', type: 'crypto', name: 'SubsocialX', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/nodes/subsocialX.svg' },
  { id: 'subzero', type: 'crypto', name: 'subzero', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/empty.svg' },
  { id: 'swapdex', type: 'crypto', name: 'Swapdex', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/chains/swapdex.svg' },
  { id: 't3rn', type: 'crypto', name: 't3rn', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/t0rn.png' },
  { id: 'tanganika', type: 'crypto', name: 'Tanganika', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/tanganika.png' },
  { id: 'ternoa', type: 'crypto', name: 'Ternoa', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/ternoa.svg' },
  { id: 'the bifrost mainnet', type: 'crypto', name: 'The Bifrost Mainnet', active: false, parent: '', parachain: false, code: '', logo: 'images/logos/nodes/thebifrost.png' },
  { id: 'turing network', type: 'crypto', name: 'Turing Network', active: false, parent: 'kusama', parachain: true, code: '', logo: 'images/logos/chains/turing.png' },
  { id: 'unique network', type: 'crypto', name: 'Unique Network', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/unique.svg' },
  { id: 'watr network', type: 'crypto', name: 'Watr Network', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/chains/watr.png' },
  { id: 'zeitgeist', type: 'crypto', name: 'Zeitgeist', active: false, parent: 'polkadot', parachain: true, code: '', logo: 'images/logos/nodes/zeitgeist.png' },
  // { id: 'us dollar', type: 'fiat', name: 'US Dollar', active: true, parent: '', parachain: false, code: 'USD', logo: '' },
  // { id: 'british pound', type: 'fiat', decimals: 2, name: 'British Pound', active: true, parent: '', parachain: false, code: 'GBP', logo: '' },
  // { id: 'south african rand', type: 'fiat', name: 'South African Rand', active: false, parent: '', parachain: false, code: 'ZAR', logo: '' },
]

const asset = {
  namespaced: true,
  state: {
    list: chains,
  },
  mutations: {},
  actions: {}
}

export { asset } 
