"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        div.style.setProperty("--mouse-x", `${x}px`);
        div.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-3xl border border-zinc-800 bg-zinc-900/50 overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};
