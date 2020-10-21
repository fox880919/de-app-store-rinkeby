import PackageStore from '@/contracts/PackageStore.json'

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545'
    }
  },

  contracts: [PackageStore],
  events: {
    PackageStore: ['newPackageEvent', 'newPackageVersionEvent', 'EditPackage', 'deletePackage', 'deletePackageVersion']
  },
  polls: {
    accounts: 250
  }
}

export default options
