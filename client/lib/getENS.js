import Web3 from 'web3'
import ENS from 'ethereum-ens'
import publicresolver from './contracts/PublicResolver.json'

const resolveENS = (resolve) => {
  let { web3 } = window

  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
  const localProvider = `http://localhost:8545`

  if (alreadyInjected) {
    console.log(`Injected web3 detected.`)
    window.ens = new ENS(web3.currentProvider)
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    const provider = new Web3.providers.HttpProvider(localProvider)
    window.ens = new ENS(provider)
  }

  resolve(ens)


  window.ens.reverse('0x7d20cb28c496a76173ee828ecacfb08deb379e8d', publicresolver.abi).name().then(response => console.log(response))
}

export default () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveENS(resolve)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveENS(resolve)
    }
  })
