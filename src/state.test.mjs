import { describe, it, expect, afterAll } from '@jest/globals';

import {
    addDoc, getDocs, deleteDoc, getCountFromServer,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import state from './state.js';

describe('Firebase', () => {
    const testDoc = {name: 'fewljwkfeewflkjfds'};
    it('Is sane', () => {
        expect(true).toStrictEqual(true);
    });

    it('Can save a document to the test collection', async () => {
        await addDoc(collection(state.db, 'test'), testDoc);
        expect(
            (await getCountFromServer(collection(state.db, 'test'))).data().count
        ).toBeGreaterThan(0);
    });

    it('Can read a saved document', async () => {
        const querySnapshot = await getDocs(collection(state.db, 'test'));
        querySnapshot.forEach(document => expect(document.data()).toStrictEqual(testDoc));
        // You can also use document.id for stuff
    });

    it('Can delete all docs in the test collection', async () => {
        const querySnapshot = await getDocs(collection(state.db, 'test'));
        const promises = querySnapshot.docs.map(document => deleteDoc(
            doc(state.db, 'test', document.id)
        ));
        await Promise.all(promises);

        expect(
            (await getCountFromServer(collection(state.db, 'test')))
                .data().count
        ).toStrictEqual(0);
    });
});

afterAll(() => {
    terminate(state.db);
})