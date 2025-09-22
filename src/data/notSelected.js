import participants from "./participants";

let notSelectedParticipants = [...participants];
notSelectedParticipants.shift();

export default notSelectedParticipants;