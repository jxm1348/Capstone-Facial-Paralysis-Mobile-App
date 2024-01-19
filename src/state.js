// I have no idea if this is an antipattern or not.

// Run by useEffect hopefully exactly once by navigation.js.
const state = {};
export default state;

export function init() {
    state.demoGetUnread = () => {
        return 3;
    }
}

