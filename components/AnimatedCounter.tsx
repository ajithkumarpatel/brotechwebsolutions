import React, { useState, useEffect, useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';

interface AnimatedCounterProps {
    icon: React.ReactNode;
    target: number;
    label: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ icon, target, label }) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const count = useCountUp(isInView ? target : 0, 2000);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="text-center p-4">
            <div className="mb-2">{icon}</div>
            <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                {count}+
            </p>
            <p className="text-lg text-dark-text mt-2">{label}</p>
        </div>
    );
};

export default AnimatedCounter;
