import { useState, useEffect, useRef } from "react";

export const usePolling = (callback, interval = 3000, enabled = true) => {
    const [isPolling, setIsPolling] = useState(enabled);
    const savedCallback = useRef();
    const intervalRef = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!isPolling) return;

        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current();
            }
        };

        intervalRef.current = setInterval(tick, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [interval, isPolling]);

    const start = () => setIsPolling(true);
    const stop = () => setIsPolling(false);

    return { isPolling, start, stop };
};
