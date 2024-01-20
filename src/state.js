// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
    demoPatients: [
        {name:'Mark Peschel', messages: [
            {read: false, message: 'hi'},
            {read: true, message: 'hi'},
            {read: true, message: 'hi'},
        ]},
        {name:'Gabriel Marx', messages: [
            {read: true, message: 'hi'},
        ]},
        {name:'John Doe', messages: [
            {read: false, message: 'hi'},
            {read: false, message: 'hi'},
        ]},
        {name:'Owen Wilson', messages: [
        ]},
      ],
};

export function init() {
    state.demoGetUnreadPatient = patient => {
        let total = 0;
        for (const {read} of patient.messages) {
            total += read ? 0 : 1;
        }
        console.log("Got unread count for patient", patient.name, "value", total);
        return total;
    }

    state.demoGetUnreadTotal = () => state.demoPatients.reduce(
        (acc, patient) => acc + state.demoGetUnreadPatient(patient), 0
    );
    
    state.demoGetPatientByName = name => {
        return state.demoPatients.find(patient => patient.name === name);
    }
}

init();
export default state;

