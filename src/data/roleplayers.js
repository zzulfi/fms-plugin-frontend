import teams from "./teams.js";

const rolePlayers = [
    {
        id: 1,
        name: "Admin",
        accessLevel: "Full",
        mail : "admin@example.com",
        password: "admin123"
    },
    {
        id: 2,
        name: `${teams[0].name} Lead`,
        accessLevel: "Limited",
        mail : "user@example.com",
        password: "user123"
    },
    {
        id: 3,
        name: `${teams[1].name} Lead`,
        accessLevel: "Limited",
        mail : "user2@example.com",
        password: "user123"
    },
    {
        id: 4,
        name: `${teams[2].name} Lead`,
        accessLevel: "Limited",
        mail : "user3@example.com",
        password: "user123"
    },
    {
        id: 5,
        name: `${teams[3].name} Lead`,
        accessLevel: "Limited",
        mail : "user4@example.com",
        password: "user123"
    }
]

export default rolePlayers;