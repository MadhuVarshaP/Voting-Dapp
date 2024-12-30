import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { contest, endElection, getContestantList, getWinner, startElection, voteForCandidate } from './config/blockchain';

const App = () => {
  const [candidateName, setCandidateName] = useState("");
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(""); 
  const [winner, setWinner] = useState("");

  useEffect(() => {
    startElection();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900 flex flex-col items-center py-8 px-4">
      <ConnectButton />
      <h1 className="text-5xl font-extrabold text-purple-800 mt-4 mb-6">Election DApp</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Register Candidate</h2>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Candidate Name"
          className="w-full border border-purple-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => contest(candidateName)}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Register
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mt-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Contestant List</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {contestants.map((name, index) => (
            <li key={index} className="mb-2 text-lg">{name}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mt-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Vote for a Candidate</h2>
        <label className="block mb-2 text-lg font-medium">Select Candidate</label>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">-- Select a Candidate --</option>
          {contestants.map((candidate, index) => (
            <option key={index} value={candidate}>{candidate}</option>
          ))}
        </select>
        <button
          onClick={handleVote}
          className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold ${loading ? "opacity-50" : "hover:bg-blue-700"} transition`}
          disabled={loading}
        >
          {loading ? "Submitting Vote..." : "Vote"}
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mt-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Winner</h2>
        <button
          onClick={winnerAnnounce}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Announce Winner
        </button>
        <div className="mt-4 text-center text-gray-800">
          {winner ? (
            <p className="text-xl font-bold">🎉 Winner: {winner} 🎉</p>
          ) : (
            <p className="text-md text-gray-500">No winner announced yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
