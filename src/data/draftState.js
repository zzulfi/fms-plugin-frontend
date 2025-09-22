import teams from "./teams.js";

const draftState = {
    isActive: false,
    currentTurn: 0, // Index of the team whose turn it is
    round: 1,
    maxRounds: 5, // Each team can pick 5 participants
    turnOrder: [0, 1, 2, 3], // Team indices in order
    draftHistory: []
};

export default draftState;          