import React, {useState, useEffect} from 'react';
import './style.css';
import Web3 from 'web3';
import abi from './abi.json';
const address = '0x4343fd7650b0166d9d9ac2C94958F2E0c7d0fdc7';


function App() {
  const [web3, setWeb3] = useState(null);
  
  const [contract, setContract] = useState('');
  const [account, setAccount] = useState('');
  const [listnfts, setListNfts] = useState([]);
  useEffect(()=> {
    const init = async ()=>{
      if(window.ethereum){
        const web3 = new Web3(window.ethereum);
        const accs = await window.ethereum.request({method:"eth_requestAccounts"});
        setWeb3(web3);
        setAccount(accs[0]);
        
        console.log(account)
        const contract = new web3.eth.Contract(abi.abi, address);
        setContract(contract); 
        const totalSupply = await contract.methods._tokenIds().call();
        console.log(totalSupply)
        let nfts = [];
        for(let i=1; i<=totalSupply; i++){
          let token = await contract.methods.getOwnerOfToken(i).call();
          // console.log(token.toLocaleLowerCase(), account.toLocaleLowerCase())
          // if(token.toLocaleLowerCase() == account.toLocaleLowerCase()){
            let obj = {token,id:i}
            nfts.push(obj);
          // } 
        }
        setListNfts(nfts);  
        console.log(nfts);
        // store list of NFTs
        // const nfts = [];
        // const totalSupply = await contract.methods._tokenIds().call();
        // for(let i=0; i<totalSupply; i++){
        //   let token = await contract.methods.getOwnerOfToken(i).call();
        //   console.log(token)
        //   nfts.push(token);
        // }
        // console.log(nfts);
      }

      
       



      // const contract = new web3.eth.Contract(abi.abi, address);
      // setContract(contract); 
      // console.log(contract)

      // const accounts = await web3.eth.getAccounts();
      // setAccount(accounts[0]);
    };
    init();
  },[]);
  const handleMint = async () => {
    // console.log("khasim")
    try{
      const options = {
        from:account,
        value: "1000000000000000"
      };
      console.log(contract);
      console.log(options);
      // safeMintFun();
      await contract.methods.mintNFT(account).send(options);
      // async function safeMintFun(){
      //   console.log("sharif")
      //   await contract.methods.safeMint(account, 1).send(options);
      //   console.log("khasim")
      // }
      // alert("NFT minted")

    } catch(e){
      console.log(e);
    }
  }
  return (
    <div className="App" >
        <h1 style={{textAlign:"center",}}>Whrrl NFT Minting Project</h1>
        <div style={{marginTop:"5%"}}>
        <button onClick={handleMint} className="primarybutton">Mint</button>
        <div >
          <h2>List of NFTs</h2>
           <table border={1}>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              
            {
              listnfts.map(
              obj => 
              <tr key = {obj.id}>
                <td> { obj.id} </td>   
                <td> {obj.token}</td>
              </tr>
              )
            }

              
            </tbody>


           </table>
        </div>
        </div>
    </div>
  );
}

export default App;
