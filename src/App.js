import React, { useState } from 'react';
import electionContract from './contracts/Election.sol';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const App = () => {
  const [candidateName, setCandidateName] = useState("");
  const [contestants, setContestants] = useState([]);

  const handleContest = async () => {
    await electionContract.methods.contest(candidateName).send({ from: window.ethereum.selectedAddress });
    alert(`${candidateName} has been registered as a candidate.`);
  };

  const fetchContestants = async () => {
    const list = await electionContract.methods.getContestantList().call();
    setContestants(list);
  };

  return (
    <div>
      <ConnectButton />
      <h1>Election DApp</h1>
      <div>
        <h2>Register Candidate</h2>
        <input 
          type="text" 
          value={candidateName} 
          onChange={(e) => setCandidateName(e.target.value)} 
          placeholder="Candidate Name"
        />
        <button onClick={handleContest}>Register</button>
      </div>

      <div>
        <h2>Contestant List</h2>
        <button onClick={fetchContestants}>Fetch List</button>
        <ul>
          {contestants.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
