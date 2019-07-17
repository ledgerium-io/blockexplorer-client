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

export const defaultNetworks = [
  {
    id: 1,
    name: 'Ledgerium Mainnet',
    url: 'http://testnet.ledgerium.net:2002'
  },
  {
    id: 2,
    name: 'Ledgerium Testnet',
    url: 'http://testnet.ledgerium.net:2002'
  },
  {
    id: 3,
    name: 'Ledgerium Devnet',
    url: 'http://138.197.193.201:2002'
  },
  {
    id: 4,
    name: 'Localhost',
    url: 'http://localhost:2002'
  }
]


export const networks = [...defaultNetworks]
export const baseURL = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')).url : defaultNetworks[0].url
export const connectedNetwork = localStorage.getItem('network') ? JSON.parse(localStorage.getItem('network')) : defaultNetworks[0]
