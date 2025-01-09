import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  contest,
  endElection,
  getContestantList,
  getWinner,
  startElection,
  voteForCandidate
} from "./config/blockchain";

const App = () => {
  const [candidateName, setCandidateName] = useState("");
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [winner, setWinner] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });

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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };


  const handleStartElection = async () => {
    setLoading(true);
    try {
      await startElection();
      showNotification('Election started successfully!', 'success');
    } catch (error) {
      showNotification('Failed to start election', 'error');
    }
    setLoading(false);
  };


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

  const handleEndElection = async () => {
    setLoading(true);
    try {
      await endElection();
      showNotification('Election ended successfully!', 'success');
    } catch (error) {
      showNotification('Failed to end election', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <ConnectButton className="float-right" />

        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 text-center">
          Election DApp
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Registration Card */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 border border-white/20 shadow-xl transform transition hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-3">🗳️</span>
              Register Candidate
            </h2>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
              className="w-full bg-white/50 border-2 border-indigo-100 rounded-xl p-4 mb-4 focus:outline-none focus:border-indigo-400 transition"
            />
            <button
              onClick={() => contest(candidateName)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition duration-200 hover:from-indigo-700 hover:to-purple-700"
            >
              Register Candidate
            </button>
          </div>

          {/* Contestants List Card */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 border border-white/20 shadow-xl">
  <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
    <span className="bg-indigo-100 p-2 rounded-lg mr-3">📋</span>
    Contestants
  </h2>
  <ul className="space-y-3 max-h-72 overflow-y-auto">  {/* Added max height and scroll behavior */}
    {contestants.map((name, index) =>
      <li
        key={index}
        className="bg-white/50 p-4 rounded-xl font-medium text-gray-700 flex items-center"
      >
        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          {index + 1}
        </span>
        {name}
      </li>
    )}
  </ul>
</div>

                  {/* Admin Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Admin Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={handleStartElection}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              Start Election
            </button>
            <button
              onClick={handleEndElection}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              End Election
            </button>
          </div>
        </div>

          {/* Voting Card */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 border border-white/20 shadow-xl md:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-3">✉️</span>
              Cast Your Vote
            </h2>
            <select
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
              className="w-full bg-white/50 border-2 border-indigo-100 rounded-xl p-4 mb-4 focus:outline-none focus:border-indigo-400 transition"
            >
              <option value="">-- Select a Candidate --</option>
              {contestants.map((candidate, index) =>
                <option key={index} value={candidate}>
                  {candidate}
                </option>
              )}
            </select>
            <button
              onClick={handleVote}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading
                ? <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                : "Submit Vote"}
            </button>
          </div>

          {/* Winner Card */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 border border-white/20 shadow-xl md:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-3">👑</span>
              Winner Announcement
            </h2>
            <button
              onClick={winnerAnnounce}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition duration-200 hover:from-green-700 hover:to-teal-700 mb-6"
            >
              Announce Winner
            </button>
            <div className="text-center">
              {winner
                ? <div className="animate-fade-in bg-green-50 p-6 rounded-xl">
                    <h3 className="text-3xl font-bold text-green-800">
                      🎉 Winner 🎉
                    </h3>
                    <p className="text-2xl font-semibold text-green-700 mt-2">
                      {winner}
                    </p>
                  </div>
                : <p className="text-gray-500 italic">
                    Results will be displayed here...
                  </p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
