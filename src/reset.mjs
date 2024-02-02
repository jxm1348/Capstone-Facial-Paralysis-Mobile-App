import {
    deleteDoc, getDocs, addDoc,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import state from './state.mjs';

const placeholderThumbnail = 'https://mpeschel10.github.io/fa/test/face-f-at-rest.png';
const placeholderImages = [
    'https://mpeschel10.github.io/fa/test/face-f-at-rest.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyebrows-up.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyes-closed.png',
    'https://mpeschel10.github.io/fa/test/face-f-nose-wrinkle.png',
    'https://mpeschel10.github.io/fa/test/face-f-big-smile.png',
    'https://mpeschel10.github.io/fa/test/face-f-lips-puckered.png',
    'https://mpeschel10.github.io/fa/test/face-f-lower-teeth-bared.png',
]

async function deleteCollection(collectionName) {
    const querySnapshot = await getDocs(collection(state.db, collectionName));
    console.debug(`Deleting collection ${collectionName} with ${querySnapshot.docs.length} entries.`);
    const deletePromises = querySnapshot.docs.map(document => deleteDoc(
        doc(state.db, 'users', document.id)
    ));
    await Promise.all(deletePromises);
}

const defaultUsers = [
    {name:'Owen Wilson', thumbnail: placeholderThumbnail, messages: [
    ], latestMessage: null},
    {
        name:'Mark Peschel', thumbnail: placeholderThumbnail, messages: {
            0: {date: 'Jan 20, 2024', read: false, deepRead: false, message: '', images: placeholderImages},
            1: {date: 'Jan 15, 2024', read: true, deepRead: true, message: 'Test message without images.', images: []},
            2: {date: 'Jan 13, 2024', read: true, deepRead: true, message: '', images: placeholderImages},
            3: {date: 'Jan 6, 2024', read: true, deepRead: true, message: '', images: placeholderImages},
            4: {date: 'Dec 30, 2023', read: true, deepRead: true, message: '', images: placeholderImages},
            5: {date: 'Dec 23, 2023', read: true, deepRead: true, message: '', images: placeholderImages},
            6: {date: 'Dec 16, 2023', read: true, deepRead: true, message: '', images: placeholderImages},
        }, latestMessage: '2024-01-20'
    },
    {name:'Gabriel Marx', thumbnail: placeholderThumbnail, messages: {
        0: {date: 'Jan 6, 2024', read: true, deepRead: true, message: 'Hi.', images: placeholderImages},
    }, latestMessage: '2024-01-06'},
    {name:'John doe', thumbnail: placeholderThumbnail, messages: {
        0: {date: 'Jan 19, 2024, 3:38 pm', read: false, deepRead: false, message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
        1: {date: 'Jan 19, 2024, 3:17 pm', read: false, deepRead: false, message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
    }, latestMessage: '2024-01-19'},
    {name:'Denzel W', thumbnail: placeholderThumbnail, messages: [
    ], latestMessage: null},
    {name:'Ameila Earhart', thumbnail: placeholderThumbnail, messages: [
    ], latestMessage: null},
    {name:'Brad Pitt', thumbnail: placeholderThumbnail, messages: [
    ], latestMessage: null},
];

const defaultMessages = [
    {date: 'Jan 20, 2024', from: 'Mark Peschel', to: 'Jane doe', read: false, deepRead: false, message: '', images: placeholderImages},
    {date: 'Jan 15, 2024', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: 'Test message without images.', images: []},
    {date: 'Jan 13, 2024', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: '', images: placeholderImages},
    {date:  'Jan 6, 2024', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: '', images: placeholderImages},
    {date: 'Dec 30, 2023', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: '', images: placeholderImages},
    {date: 'Dec 23, 2023', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: '', images: placeholderImages},
    {date: 'Dec 16, 2023', from: 'Mark Peschel', to: 'Jane doe', read: true, deepRead: true, message: '', images: placeholderImages},
    {date:  'Jan 6, 2024', from: 'Gabriel Marx', to: 'Jane doe', read: true, deepRead: true, message: 'Hi.', images: placeholderImages},
    {date: 'Jan 19, 2024, 3:38 pm', read: false, from: 'John doe', to: 'Jane doe', deepRead: false, message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
    {date: 'Jan 19, 2024, 3:17 pm', read: false, from: 'John doe', to: 'Jane doe', deepRead: false, message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
];

const tables = {
    users: defaultUsers,
    messages: defaultMessages,
};

// Deletes everything and then re-uploads a test dataset.
// Valid collections at this time are:
// users, messages
async function resetTable(name) {
    const table = tables[name];
    await deleteCollection(name);

    console.log('Inserting', table.length, 'records into collection', name);
    await Promise.all(
        table.map(entry => addDoc(collection(state.db, name), entry))
    );
}

await Promise.all(Object.entries(tables).map(([name, entry]) => resetTable(name)));
// Closing the database connection is necessary so node.js doesn't hang after the reset function is done.
terminate(state.db);
