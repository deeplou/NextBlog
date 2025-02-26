"use client";
import { useEffect } from 'react';
import styles from './root.module.css';

function Root({ children }) {
    useEffect(() => {
        const htmlElem = document.documentElement;

        function resFunc() {
            const resW = 520;
            const resH = 710;
            const defaultFS = 16;
            const fontW = Number((innerWidth * defaultFS / resW).toFixed(2));
            const fontH = Number((innerHeight * defaultFS / resH).toFixed(2));

            let resFS = null;

            switch (true) {
                case innerWidth < resW && innerHeight < resH:
                    resFS = Math.min(fontW, fontH);
                    break;
                case innerWidth < resW:
                    resFS = fontW;
                    break;
                case innerHeight < resH:
                    resFS = fontH;
                    break;
                default:
                    resFS = null;
                    break;
            }

            htmlElem.style.fontSize = resFS ? resFS + 'px' : '';
        }

        resFunc();
        window.onresize = resFunc;

        const rootElem = document.getElementById('root');

        function handleMouseMove(e) {
            const mousePos = { x: e.clientX, y: e.clientY };
            const backgroundStyle = `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, hsla(195, 100%, 50%, 0.8) 10%, transparent 70%)`;
            rootElem.style.backgroundImage = backgroundStyle;
        }
        window.addEventListener('mousemove', handleMouseMove);

        const allImgs = document.querySelectorAll('img');
        allImgs.forEach(i => i.draggable = false);

        return () => {
            window.removeEventListener('resize', resFs);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className={styles.root} id='root'>
            {children}
        </div>
    );
}

export default Root;
