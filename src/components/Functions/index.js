import Web3 from 'web3';
const web3 = new Web3();

function addressType(address) {
  return new Promise((resolve) => {
    if(!address) {
      resolve('Contract Creation')
    }
    web3.eth.getCode(address, (code) => {
      if(code === "0x") {
        resolve("Contract Call")
      } else {
        resolve("Transaction")
      }
    })
  })
}

export {
   addressType
};
