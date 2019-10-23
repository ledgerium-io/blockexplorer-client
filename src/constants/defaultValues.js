export const defaultMenuType = 'menu-hidden'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/blockexplorer';
export const subHiddenBreakpoint=1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale='en';
export const localeOptions=[
    {id:'en',name:'English'},
    // {id:'es',name:'Español'},
];
export const searchPath = "/app/search"
export const servicePath = "https://api.coloredstrategies.com"

let networkList = [
  // {
  //   id: 1,
  //   name: 'Ledgerium Mainnet',
  //   url: 'http://toorak.ledgerium.net/blockexplorersvc',
  //   faucetUrl: 'http://toorak.ledgerium.net/faucet',
  //   type: 'mainnet',
  // },
  {
    id: 2,
    name: 'Ledgerium Toorak Testnet',
    http: 'http://toorak.ledgerium.io/blockexplorersvc',
    ws: 'http://toorak.ledgerium.io',
    faucetUrl: 'http://toorak.ledgerium.io/faucetsvc',
    type: 'testnet',

  },
  {
    id: 3,
    name: 'Ledgerium Flinders Testnet',
    http: 'http://flinders.ledgerium.io/blockexplorersvc',
    ws: 'http://flinders.ledgerium.io',
    faucetUrl: 'http://flinders.ledgerium.io/faucetsvc',
    type: 'testnet',
  },
  {
    id: 4,
    name: 'Localhost',
    http: 'http://localhost:2002',
    ws: 'http://localhost:2002',
    faucetUrl: 'http://localhost:5577',
    type: 'custom',
  }
]

export const originalNetworkCount = networkList.length

if(localStorage.getItem('customNetworks')) {
    const customNetworks = JSON.parse(localStorage.getItem('customNetworks'))
    for(let i=0; i<customNetworks.length; i++) {
      networkList.push(customNetworks[i])
    }
}
export const defaultNetworks = networkList
export const networks = [...networkList]
export const baseURL = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')).http : defaultNetworks[0].http
export const connectedNetwork = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')) : defaultNetworks[0]
