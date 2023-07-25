import { PromiseClass } from '../utility';
import type { TCommonStore } from '@deriv/stores/types';

const ServerTime = (() => {
    let clock_started = false;
    const pending = new PromiseClass();
    let common_store: TCommonStore;

    const init = (store: TCommonStore) => {
        if (!clock_started) {
            common_store = store;
            pending.resolve(common_store.server_time);
            clock_started = true;
        }
    };

    const get = () => (clock_started && common_store.server_time ? common_store.server_time.clone() : undefined);

    return {
        init,
        get,
        timePromise: () => (clock_started ? Promise.resolve(common_store.server_time) : pending.promise),
    };
})();

export default ServerTime;