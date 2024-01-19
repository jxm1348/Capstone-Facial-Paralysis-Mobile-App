// I have no idea if this is an antipattern or not.
const state = {
    demoIsDebug: true,
};
export default state;

export function init() {
    state.demoGetUnread = () => {
        return 3;
    }
}

init();

