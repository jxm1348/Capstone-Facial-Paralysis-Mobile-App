const placeholderImages = [
    'https://mpeschel10.github.io/fa/test/face-f-at-rest.svg',
    'https://mpeschel10.github.io/fa/test/face-f-eyebrows-up.svg',
    'https://mpeschel10.github.io/fa/test/face-f-eyes-closed.svg',
    'https://mpeschel10.github.io/fa/test/face-f-nose-wrinkle.svg',
    'https://mpeschel10.github.io/fa/test/face-f-big-smile.svg',
    'https://mpeschel10.github.io/fa/test/face-f-lips-puckered.svg',
    'https://mpeschel10.github.io/fa/test/face-f-lower-teeth-bared.svg',
]

// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
    demoPatients: [
        {name:'Mark Peschel', messages: [
            {date: "Jan 20, 2024", read: false, deepRead: false, message: '', images: placeholderImages},
            {date: "Jan 13, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Jan 6, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
        ]},
        {name:'Gabriel Marx', messages: [
            {date: "Jan 6, 2024", read: true, deepRead: true, message: 'Hi.', images: placeholderImages},
        ]},
        {name:'John Doe', messages: [
            {date: "Jan 19, 2024, 3:38 pm", read: false, deepRead: false, message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
            {date: "Jan 19, 2024, 3:17 pm", read: false, deepRead: false, message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
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

