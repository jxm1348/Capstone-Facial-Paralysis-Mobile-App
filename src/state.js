const placeholderImages = [
    'https://mpeschel10.github.io/fa/test/face-f-at-rest.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyebrows-up.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyes-closed.png',
    'https://mpeschel10.github.io/fa/test/face-f-nose-wrinkle.png',
    'https://mpeschel10.github.io/fa/test/face-f-big-smile.png',
    'https://mpeschel10.github.io/fa/test/face-f-lips-puckered.png',
    'https://mpeschel10.github.io/fa/test/face-f-lower-teeth-bared.png',
]

const placeholderThumbnail = 'https://mpeschel10.github.io/fa/test/face-f-at-rest.png';

// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
    demoPatients: [
        {name:'Owen Wilson', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: '1970-01-01'},
        {name:'Mark Peschel', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 20, 2024", read: false, deepRead: false, message: '', images: placeholderImages},
            {date: "Jan 13, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Jan 6, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 30, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 23, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 16, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
        ], latestMessage: '2024-01-20'},
        {name:'Gabriel Marx', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 6, 2024", read: true, deepRead: true, message: 'Hi.', images: placeholderImages},
        ], latestMessage: '2024-01-06'},
        {name:'John Doe', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 19, 2024, 3:38 pm", read: false, deepRead: false, message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
            {date: "Jan 19, 2024, 3:17 pm", read: false, deepRead: false, message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
        ], latestMessage: '2024-01-19'},
        {name:'Denzel W', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: '1970-01-01'},
        {name:'Ameila Earhart', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: '1970-01-01'},
        {name:'Brad Pitt', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: '1970-01-01'},
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

