export const defaultMenuType = 'menu-hidden'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/app/blockexplorer';
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
  {
    id: 1,
    name: 'Ledgerium Mainnet',
    url: 'http://testnet.ledgerium.net:2002',
    faucetUrl: 'null',
    type: 'mainnet',
  },
  {
    id: 2,
    name: 'Ledgerium Testnet',
    url: 'http://testnet.ledgerium.net:2002',
    faucetUrl: 'http://testnet.ledgerium.net:5577',
    type: 'testnet',

  },
  {
    id: 3,
    name: 'Ledgerium Devnet',
    url: 'http://138.197.193.201:2002',
    faucetUrl: 'http://testnet.ledgerium.net:5577',
    type: 'testnet',
  },
  {
    id: 4,
    name: 'Localhost',
    url: 'http://localhost:2002',
    faucetUrl: 'http://testnet.ledgerium.net:5577',
    type: 'testnet',
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
export const baseURL = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')).url : defaultNetworks[0].url
export const connectedNetwork = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')) : defaultNetworks[0]
