import DataManager from "./dataManager.ts";

export const dataManager = new DataManager({
    whoami: "BlueMarble",
    schemaVersion: "",
    templates: [
        {
            coords: [0, 1, 2, 3],
            enabled: false,
            uuid: "BLAJSIAFBNIUBAWIFIOANWA",
        },
        {
            coords: [0, 1, 2, 3],
            name: "Test",
            enabled: false,
            authorID: 54,
            uuid: "BLAJSIAFBNIUBAWIFIOANWA",
        }
    ]
});
