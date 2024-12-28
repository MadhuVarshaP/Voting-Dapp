import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { contest, endElection, getContestantList, getWinner, startElection, voteForCandidate } from './config/blockchain';

const App = () => {
  const [candidateName, setCandidateName] = useState("");
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState (false);
  const [selectedCandidate, setSelectedCandidate] = useState(""); 
  const [winner, setWinner] = useState("")
  // const handleContest = async () => {
  //   await electionContract.methods
  //     .contest(candidateName)
  //     .send({ from: window.ethereum.selectedAddress });
  //   alert(`${candidateName} has been registered as a candidate.`);
  // };

  // const fetchContestants = async () => {
  //   const list = await electionContract.methods.getContestantList().call();
  //   setContestants(list);
  // };

  useEffect(() => {
    startElection()
  },[])

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const list = await getContestantList();
        setContestants(list);
      } catch (err) {
        console.error("Error fetching contestants:", err.message);
      }
    };

    fetchCandidates();
  }, []);

  const winnerAnnounce = async () => {
    try {
      const winnerName = await getWinner(); 
      setWinner(winnerName);
    } catch (err) {
      console.error("Error fetching winner:", err.message);
      setWinner("Unable to fetch winner.");
    }
  };
  

  // Handle voting for a candidate
  const handleVote = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate to vote for.");
      return;
    }

    setLoading(true);
    try {
      await voteForCandidate(selectedCandidate);
      alert(`You successfully voted for ${selectedCandidate}!`);
    } catch (err) {
      console.error("Error while voting:", err.message);
      alert("An error occurred while voting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center py-8">
      <ConnectButton />
      <h1 className="text-4xl font-bold text-blue-600 mt-4">Election DApp</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Register Candidate</h2>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Candidate Name"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => contest(candidateName)}
          className="w-20 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contestant List</h2>
        <ul className="list-disc pl-5 text-gray-600">
          {contestants.map((name, index) => (
            <li key={index} className="mb-2">
              {name}
            </li>
          ))}
        </ul>
      </div>
      <h1 className="text-2xl font-bold my-4">Vote for a Candidate</h1>

      {/* Candidate Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Candidate</label>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- Select a Candidate --</option>
          {contestants.map((candidate, index) => (
            <option key={index} value={candidate}>
              {candidate}
            </option>
          ))}
        </select>
      </div>

      {/* Vote Button */}
      <button
        onClick={handleVote}
        className={`w-30 p-3 bg-blue-500 text-white rounded-md font-semibold ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Submitting Vote..." : "Vote"}
      </button>

      <div className="bg-white shadow-md rounded-lg p-6 mt-8 w-full max-w-md">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Winner</h2>
  <button
    onClick={winnerAnnounce}
    className="w-40 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
  >
    Announce Winner
  </button>
  <div className="mt-4 text-gray-800">
    {winner ? (
      <p className="text-lg font-bold">{winner}</p>
    ) : (
      <p className="text-sm text-gray-600">No winner announced yet.</p>
    )}
  </div>
</div>


    </div>
  );
};

export default App;
