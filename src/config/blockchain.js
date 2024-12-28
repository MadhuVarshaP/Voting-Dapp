import Web3 from 'web3';
import { contractAddress, abi } from './abi';
let electionContract;
let web3 ;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);

  // Request MetaMask account access
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(() => {
      console.log("MetaMask connected.");
    })
    .catch((err) => {
      console.error("MetaMask connection rejected:", err.message);
    });

  electionContract = new web3.eth.Contract(abi, contractAddress);
} else {
  console.error("MetaMask is not installed. Please install MetaMask to use this DApp.");
}

// Functions for interacting with the contract

// Contest function
export const contest = async (candidateName) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await electionContract.methods
      .contest(candidateName)
      .send({ from: accounts[0] });
    console.log(`${candidateName} has been added as a candidate.`);
  } catch (err) {
    console.error("Error in contesting:", err.message);
  }
};

// Start Election
export const startElection = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    await electionContract.methods
      .startElection()
      .send({ from: accounts[0] });
    console.log("Election has started.");
  } catch (err) {
    console.error("Error in starting election:", err.message);
  }
};

// Get Contestants
export const getContestantList = async () => {
  try {
    const contestants = await electionContract.methods.getContestantList().call();
    console.log("Contestants:", contestants);
    return contestants;
  } catch (err) {
    console.error("Error in fetching contestant list:", err.message);
    return [];
  }
};

// Vote for Candidate
export const voteForCandidate = async (candidateName) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await electionContract.methods
      .votingForCandidates(candidateName)
      .send({ from: accounts[0] });
    console.log(`You voted for ${candidateName}.`);
  } catch (err) {
    console.error("Error in voting:", err.message);
  }
};

// End Election
export const endElection = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    await electionContract.methods
      .endElection()
      .send({ from: accounts[0] });
    console.log("Election has ended.");
  } catch (err) {
    console.error("Error in ending election:", err.message);
  }
};

// Get Winner
export const getWinner = async () => {
  try {
    const winner = await electionContract.methods.getWinner().call();
    console.log("Winner:", winner);
    return winner;
  } catch (err) {
    console.error("Error in fetching winner:", err.message);
    return null;
  }
};

// 1. contest
// 2. start the election
// 3. get all the contestants list
// 4. vote for the candidates
// 5. end election 
// 6. Get the winner announced