import React, {ForwardedRef, forwardRef, HTMLAttributes, useEffect, useRef, useState} from 'react';
import './CrossFade.scss';

export interface CrossFaderProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    destroyOnFadeOutComplete?: boolean;
    onFadeOutComplete?: () => void;
    onFadeInComplete?: () => void;
    distinctKey?: string | number;
    delay?: number;
}

export const CrossFader = forwardRef(
    function CrossFader({
                           children,
                           className,
                           onFadeOutComplete,
                           onFadeInComplete,
                           destroyOnFadeOutComplete = true,
                           distinctKey,
                           delay = 0,
                           ...props
                       }: CrossFaderProps, ref: ForwardedRef<HTMLDivElement>) {
        const prevRef = useRef<HTMLDivElement>(null);
        const curRef = useRef<HTMLDivElement>(null);

        const [listenersAdded, setListenersAdded] = useState(false);
        const [prevKey, setPrevKey] = useState<string | number | null>(null);

        const [curActiveElement, setCurActiveElement] = useState<React.ReactNode | null>(null);
        const [prevActiveElement, setPrevActiveElement] = useState<React.ReactNode | null>(null);
        const [fadeIndex, setFadeIndex] = useState(0);
        const [fadeOutDone, setFadeOutDone] = useState(false);
        const [curTimeout, setCurTimeout] = useState<number | null>(null);

        useEffect(() => {
            if (delay) {
                if (curTimeout) {
                    clearTimeout(curTimeout);
                }
                setCurTimeout(setTimeout(() => {
                    crossFade(children, distinctKey);
                }, delay) as unknown as number);
            } else {
                crossFade(children, distinctKey);
            }
        }, [children, distinctKey]);

        const crossFade = (next: React.ReactNode, nextKey?: string | number) => {
            if (next === prevActiveElement || (nextKey && nextKey === prevKey)) {
                return;
            }
            setFadeOutDone(false);
            setPrevActiveElement(curActiveElement);
            setPrevKey(nextKey ?? null);
            setCurActiveElement(next);
            setFadeIndex((cur) => (cur + 1) % 2);
        };
        const onFadeOutDone = () => {
            setFadeOutDone(true);
            onFadeOutComplete?.();
        }

        const onFadeInDone = () => {
            onFadeInComplete?.();
        }

        if (!listenersAdded) {
            if (prevRef.current) {
                prevRef.current.addEventListener("webkitAnimationEnd", onFadeOutDone,false);
                prevRef.current.addEventListener("animationend", onFadeOutDone,false);
                prevRef.current.addEventListener("onanimationend", onFadeOutDone,false);
            }

            if (curRef.current) {
                curRef.current.addEventListener("webkitAnimationEnd", onFadeInDone,false);
                curRef.current.addEventListener("animationend", onFadeInDone,false);
                curRef.current.addEventListener("onanimationend", onFadeInDone,false);
            }
            setListenersAdded(true);
        }


        return (
            <div {...props} ref={ref} className={`react-cross-fader-container ${className ?? ''}`}>
                <div ref={fadeIndex === 0 ? curRef : prevRef}
                     className={`react-cross-fader-element ${fadeIndex === 0 ? 'fade-in' : 'fade-out'}`}>
                    {
                        !(fadeOutDone && fadeIndex === 1 && destroyOnFadeOutComplete)
                        && (fadeIndex === 0 ? curActiveElement : prevActiveElement)
                    }
                </div>
                <div ref={fadeIndex === 1 ? curRef : prevRef}
                     className={`react-cross-fader-element ${fadeIndex === 1 ? 'fade-in' : 'fade-out'}`}>
                    {
                        !(fadeOutDone && fadeIndex === 0 && destroyOnFadeOutComplete)
                        && (fadeIndex === 1 ? curActiveElement : prevActiveElement)
                    }
                </div>
            </div>
        );
    });
