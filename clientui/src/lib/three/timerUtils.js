import * as THREE from "three";

export function hasThreeTimer() {
    return typeof THREE.Timer !== "undefined";
}

export function createTimer() {
    if (hasThreeTimer()) {
        const timer = new THREE.Timer();
        return {
            start: () => timer.start(),
            getElapsedTime: () => timer.getElapsed(),
            getDelta: () => timer.getDelta(),
            get delta() {
                return timer.getDelta();
            },
            get elapsed() {
                return timer.getElapsed();
            },
            update: () => {
                // THREE.Timer auto-updates, no need to manually call
            },
            dispose: () => {
                // Clean up if needed
            },
        };
    }

    const startTime = performance.now();
    let lastTime = startTime;
    let deltaTime = 0;

    return {
        start: () => {
            // Clock already started on creation
        },
        getElapsedTime: () => {
            return (performance.now() - startTime) / 1000;
        },
        getDelta: () => {
            const now = performance.now();
            deltaTime = (now - lastTime) / 1000;
            lastTime = now;
            return deltaTime;
        },
        get delta() {
            return this.getDelta();
        },
        get elapsed() {
            return this.getElapsedTime();
        },
        update: () => {
            this.getDelta();
        },
        dispose: () => {
            // No resources to clean up
        },
    };
}

export function adaptClock(clock) {
    if (hasThreeTimer() && clock instanceof THREE.Timer) {
        return clock;
    }

    if (clock instanceof THREE.Clock) {
        return {
            start: () => clock.start(),
            getElapsedTime: () => clock.getElapsedTime(),
            getDelta: () => clock.getDelta(),
            get delta() {
                return clock.getDelta();
            },
            get elapsed() {
                return clock.getElapsedTime();
            },
            update: () => {
                clock.getDelta();
            },
            dispose: () => {
                // Clock doesn't need disposal
            },
        };
    }

    return clock;
}

export function suppressThreeWarnings() {
    if (typeof window === "undefined") return;

    const originalWarn = console.warn;
    console.warn = (...args) => {
        const message = args[0];
        if (
            typeof message === "string" &&
            (message.includes("THREE.Clock") ||
                message.includes("This module has been deprecated") ||
                message.includes("THREE.Quaternion.multiplyQuaternions"))
        ) {
            return;
        }
        originalWarn(...args);
    };
}

export function useTimerCompat() {
    const timerRef = React.useRef(null);

    React.useEffect(() => {
        if (!timerRef.current) {
            timerRef.current = createTimer();
            timerRef.current.start();
        }

        return () => {
            timerRef.current?.dispose();
        };
    }, []);

    return {
        get elapsed() {
            return timerRef.current?.elapsed ?? 0;
        },
        get delta() {
            return timerRef.current?.delta ?? 0;
        },
        timer: timerRef.current,
    };
}