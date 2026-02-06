"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Check,
    Clock,
    AlertCircle,
    Calendar,
    Zap,
} from "lucide-react";

export interface RoadmapMilestone {
    id: string;
    quarter: string;
    title: string;
    description: string;
    status: "completed" | "in-progress" | "upcoming";
    features?: string[];
    date?: string;
    duration?: string;
}

interface RoadmapCardProps {
    title?: string;
    description?: string;
    milestones: RoadmapMilestone[];
    className?: string;
}

export const RoadmapTimeline: React.FC<RoadmapCardProps> = ({
    title = "Step-by-Step Evolution",
    description = "Your strategic path to mastery",
    milestones,
    className,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const getStatusIcon = (status: RoadmapMilestone["status"]) => {
        switch (status) {
            case "completed":
                return <Check className="h-4 w-4" />;
            case "in-progress":
                return <Clock className="h-4 w-4" />;
            case "upcoming":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: RoadmapMilestone["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-500 border-green-700";
            case "in-progress":
                return "bg-primary border-primary";
            case "upcoming":
                return "bg-muted border-border";
            default:
                return "bg-muted border-border";
        }
    };

    return (
        <div ref={containerRef} className={cn("w-full max-w-5xl mx-auto py-8", className)}>
            <div className="relative">
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

                <svg
                    className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 pointer-events-none overflow-visible"
                    style={{ height: "100%" }}
                >
                    <motion.line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="100%"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        style={{ pathLength }}
                    />
                </svg>

                <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className={cn(
                                "relative grid md:grid-cols-2 gap-8 items-center",
                                index % 2 === 0 ? "md:text-right" : "md:text-left"
                            )}
                        >
                            <div className={cn(
                                "md:col-span-1",
                                index % 2 === 0 ? "md:order-1" : "md:order-2"
                            )}>
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/40 backdrop-blur-sm border-border/50">
                                    <CardHeader>
                                        <div className={cn(
                                            "flex items-center gap-2 mb-2",
                                            index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                                        )}>
                                            <Badge
                                                variant={
                                                    milestone.status === "completed" || milestone.status === "in-progress"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className={cn(
                                                    milestone.status === "in-progress" ? "bg-primary/20 text-primary border-primary/20" : ""
                                                )}
                                            >
                                                {milestone.quarter}
                                            </Badge>
                                            {(milestone.date || milestone.duration) && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {milestone.date || milestone.duration}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className={cn(
                                            "flex items-center gap-2",
                                            index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                                        )}>
                                            {index % 2 !== 0 && getStatusIcon(milestone.status)}
                                            {milestone.title}
                                            {index % 2 === 0 && getStatusIcon(milestone.status)}
                                        </CardTitle>
                                        <CardDescription>{milestone.description}</CardDescription>
                                    </CardHeader>
                                    {(milestone.features && milestone.features.length > 0) && (
                                        <CardContent>
                                            <ul className={cn(
                                                "space-y-2",
                                                index % 2 === 0 ? "flex flex-col items-end" : ""
                                            )}>
                                                {milestone.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                                        {index % 2 !== 0 && <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                                                        <span>{feature}</span>
                                                        {index % 2 === 0 && <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    )}
                                </Card>
                            </div>

                            <div className={cn(
                                "absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center top-0 md:top-auto h-full md:h-auto",
                                index % 2 === 0 ? "md:order-2" : "md:order-1"
                            )}>
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className={cn(
                                        "h-12 w-12 rounded-full border-4 flex items-center justify-center bg-background z-10",
                                        getStatusColor(milestone.status)
                                    )}
                                >
                                    {milestone.status === "in-progress" && (
                                        <motion.div
                                            className="absolute h-full w-full rounded-full bg-primary/20"
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                    <div className="relative z-10 text-background">
                                        {getStatusIcon(milestone.status)}
                                    </div>
                                </motion.div>
                            </div>

                            <div className={cn(
                                "hidden md:block",
                                index % 2 === 0 ? "md:order-2" : "md:order-1"
                            )} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const HorizontalRoadmap: React.FC<RoadmapCardProps> = ({
    title = "Timeline",
    description = "Your learning journey",
    milestones,
    className,
}) => {
    return (
        <Card className={cn("w-full shadow-xl bg-card/40 backdrop-blur-sm border-border/50", className)}>
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-0 right-0 top-4 h-px bg-border" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.id}
                                className="relative pt-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.15 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className={cn(
                                        "absolute left-1/2 top-2 -translate-x-1/2 h-4 w-4 rounded-full flex items-center justify-center",
                                        milestone.status === "completed" || milestone.status === "in-progress"
                                            ? "bg-primary"
                                            : "bg-muted"
                                    )}
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-background" />
                                </motion.div>

                                <Badge
                                    variant={
                                        milestone.status === "completed" || milestone.status === "in-progress"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="mb-2 text-[11px]"
                                >
                                    {milestone.quarter}
                                </Badge>

                                <h4 className="text-sm font-medium mb-1">{milestone.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{milestone.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
