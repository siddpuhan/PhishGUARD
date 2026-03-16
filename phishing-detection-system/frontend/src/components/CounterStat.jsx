import React, { useEffect, useRef, useState } from 'react';

const CounterStat = ({ end, duration = 2000, suffix = '', prefix = '', label }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    setIsVisible(true);
                    hasAnimated.current = true;
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const startTime = Date.now();
        const startValue = 0;
        const endValue = end;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Ease-out cubic function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(startValue + (endValue - startValue) * easeProgress);
            
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <div ref={ref} className="stat-card group">
            <div className="relative">
                <div className="text-8xl md:text-9xl font-display neon-text leading-none mb-4 tracking-tight">
                    {prefix}{count.toLocaleString()}{suffix}
                </div>
                <div className="h-[2px] w-16 bg-lime-400 mb-6 group-hover:w-32 transition-all duration-500"></div>
                <div className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-gray-400">
                    {label}
                </div>
            </div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );
};

export default CounterStat;
