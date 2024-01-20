// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
    demoPatients: [
        {name:'Mark Peschel', messages: [
            {read: false, deepRead: false, message: 'hi'},
            {read: true, deepRead: false, message: 'hi'},
            {read: true, deepRead: false, message: 'hi'},
        ]},
        {name:'Gabriel Marx', messages: [
            {read: true, deepRead: false, message: 'hi'},
        ]},
        {name:'John Doe', messages: [
            {read: false, deepRead: false, message: 'hi'},
            {read: false, deepRead: false, message: 'hi'},
        ]},
        {name:'Owen Wilson', messages: [
        ]},
      ],
    demoGetUnreadPatient(patient) {
        let total = 0;
        for (const {read} of patient.messages) {
            total += read ? 0 : 1;
        }
        return total;
    }
};

export function init() {

    state.demoGetUnreadTotal = () => state.demoPatients.reduce(
        (acc, patient) => acc + state.demoGetUnreadPatient(patient), 0
    );
    
    state.demoGetPatientByName = name => {
        return state.demoPatients.find(patient => patient.name === name);
    }
}

init();
export default state;

