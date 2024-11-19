import Web3 from 'web3';

// Create Web3 instance
let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
} else {
  console.error("MetaMask is not installed.");
}

const contractAddress = "0x8513A6762e4C99DdF4f0938748a600bb73cdFF28";
const electionContract = new web3.eth.Contract(abi, contractAddress);



// Functions for interacting with the contract

// Contest function
export const contest = async (candidateName) => {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.contest(candidateName).send({ from: accounts[0] });
  console.log(`${candidateName} has been added as a candidate.`);
};

// Start Election
export const startElection = async () => {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.startElection().send({ from: accounts[0] });
  console.log("Election has started.");
};

// Get Contestants
export const getContestantList = async () => {
  const contestants = await electionContract.methods.getContestantList().call();
  console.log("Contestants:", contestants);
  return contestants;
};

// Vote for Candidate
export const voteForCandidate = async (candidateName) => {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.votingForCandidates(candidateName).send({ from: accounts[0] });
  console.log(`You voted for ${candidateName}.`);
};

// End Election
export const endElection = async () => {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.endElection().send({ from: accounts[0] });
  console.log("Election has ended.");
};

// Get Winner
export const getWinner = async () => {
  const winner = await electionContract.methods.getWinner().call();
  console.log("Winner:", winner);
  return winner;
};

// 1. contest
// 2. start the election
// 3. get all the contestants list
// 4. vote for the candidates
// 5. end election 
// 6. Get the winner announced