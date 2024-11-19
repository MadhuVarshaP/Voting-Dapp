// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election{
    struct Candidate{
        string name;
        uint votes;
    }

    address public owner;
    constructor(){
        owner= msg.sender;
    }

    bool public electionStarted; //default value for bool electionStarted = false
    bool public electionEnded;


    mapping (string => Candidate) public candidates;
    mapping (string => bool) public contestantCheck;
    mapping (address => bool) public voted;
    
    string[] public candidateNames;

// step -1
    function contest(string memory name) public {
        require(!electionStarted,"Election is already started");
        require(!contestantCheck[name],"already exists");

        candidates[name] = Candidate(name,0);
        contestantCheck[name] = true;

        candidateNames.push(name);
    }

// step -2
    function startElection() public {
        require(msg.sender == owner,"You're not the owner");
        electionStarted = true;
        electionEnded = false;
    }
    
//step -3 
    function getContestantList() public view returns (string[] memory){
        return candidateNames;
    }

//step -4
    function votingForCandidates(string memory name) public {
        require(electionStarted,"Election not started yet");
        require(contestantCheck[name], "Candidate not exist");
        require(!voted[msg.sender],"You have already voted");

        voted[msg.sender] = true;
        candidates[name].votes +=1;
    }

//step -5
    function endElection() public {
        require(owner == msg.sender, "You're not the owner");
        require(!electionEnded,"Election has already ended");
        electionEnded = true;
        electionStarted = false;
    }

//step -6
    function getWinner() public view returns (string memory winner){
        require(electionEnded, "Election us not ended");
        uint maxVotes = 0;
        for (uint i=0; i< candidateNames.length; i++) {
            string memory candidateName = candidateNames[i];
            uint voteCount = candidates[candidateName].votes;

                if (voteCount > maxVotes){
                maxVotes = voteCount;
                winner = candidateName;
            }
        }
        return winner;
    }
}


// processes in voting 
// 1. contest
// 2. start the election
// 3. get all the contestants list
// 4. vote for the candidates
// 5. end election 
// 6. Get the winner announced