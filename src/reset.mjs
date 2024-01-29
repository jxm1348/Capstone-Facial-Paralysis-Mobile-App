import {
    deleteDoc, getDocs, addDoc,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import state from './state.mjs';
// Ignores collections that we have not touched
// Valid collections at this time are:
// users
async function resetDb() {
    const querySnapshot = await getDocs(collection(state.db, 'users'));
    console.log("Got collection users with", querySnapshot.docs.length, "entries");
    const deletePromises = querySnapshot.docs.map(document => deleteDoc(
        doc(state.db, 'users', document.id)
    ));
    await Promise.all(deletePromises);
    terminate(state.db);
}

await resetDb();
