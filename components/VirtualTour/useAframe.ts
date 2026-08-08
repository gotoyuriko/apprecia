import { useEffect, useState } from "react";

const AFRAME_SRC = "https://aframe.io/releases/1.4.0/aframe.min.js";

/**
 * Loads A-Frame on demand and reports whether the global AFRAME is ready.
 *
 * A-Frame bundles its own copy of Three.js (0.147), so loading it on every page
 * put a second Three.js alongside the npm `three` used by AppreciaView on "/".
 * Only the /tour pages render a <Scene>, so they pull it in themselves.
 *
 * Callers must not render <Scene>/<Entity> or touch AFRAME until this is true:
 * aframe-react passes object-valued props straight to setAttribute, which only
 * understands objects once A-Frame has upgraded the custom element.
 */
export default function useAframe(): boolean {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if ("AFRAME" in window) {
            setReady(true);
            return;
        }

        let script = document.querySelector<HTMLScriptElement>(
            `script[src="${AFRAME_SRC}"]`
        );
        if (!script) {
            script = document.createElement("script");
            script.src = AFRAME_SRC;
            document.head.appendChild(script);
        }

        const onLoad = () => setReady(true);
        script.addEventListener("load", onLoad);
        return () => script?.removeEventListener("load", onLoad);
    }, []);

    return ready;
}
