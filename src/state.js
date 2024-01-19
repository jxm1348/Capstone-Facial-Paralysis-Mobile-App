// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
    demoPatientMessages: [
        {name:'John Doe', unread: 2},
        {name:'Mark Peschel', unread: 1},
        {name:'Gabriel Marx', unread: 0},
        {name:'Quinn Wilson', unread: 0},
      ],
};

export function init() {
    state.demoGetUnread = () => {
        return state.demoPatientMessages.reduce((acc, patient) => acc + patient.unread, 0);
    }
}

init();
export default state;

