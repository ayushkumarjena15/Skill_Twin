"use client";

import { Check, Circle, Clock, MessageSquare, Heart, MapPin, Award, GraduationCap, Briefcase } from "lucide-react";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

export function PlatformRoadmap() {
    const roadmapItems: TimelineItem[] = [
        {
            id: "1",
            title: "Q1 2024 - Foundation",
            description: "Core infrastructure and platform setup",
            timestamp: new Date("2024-01-01"),
            status: "completed",
            icon: <Briefcase className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">Authentication system</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">Database architecture</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">API development</span>
                    </div>
                </div>
            ),
        },
        {
            id: "2",
            title: "Q2 2024 - Core Features",
            description: "Essential product features and user experience",
            timestamp: new Date("2024-04-01"),
            status: "completed",
            icon: <GraduationCap className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">User dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">Real-time notifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">Mobile responsive design</span>
                    </div>
                </div>
            ),
        },
        {
            id: "3",
            title: "Q3 2024 - Enhancement",
            description: "Advanced features and integrations",
            timestamp: new Date("2024-07-01"),
            status: "active",
            icon: <Award className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-zinc-300">Third-party integrations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-zinc-300">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">AI-powered recommendations</span>
                    </div>
                </div>
            ),
        },
        {
            id: "4",
            title: "Q4 2024 - Scale",
            description: "Performance optimization and scaling",
            timestamp: new Date("2024-10-01"),
            status: "pending",
            icon: <MapPin className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Infrastructure scaling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Performance optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Global CDN deployment</span>
                    </div>
                </div>
            ),
        },
        {
            id: "5",
            title: "Q1 2025 - Innovation",
            description: "Next-generation features and capabilities",
            timestamp: new Date("2025-01-01"),
            status: "pending",
            icon: <Heart className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Machine learning models</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Advanced automation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Enterprise features</span>
                    </div>
                </div>
            ),
        },
        {
            id: "6",
            title: "Q2 2025 - Expansion",
            description: "Market expansion and new verticals",
            timestamp: new Date("2025-04-01"),
            status: "pending",
            icon: <MessageSquare className="h-4 w-4" />,
            content: (
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">International markets</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Multi-language support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-zinc-300">Strategic partnerships</span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-zinc-400 bg-clip-text text-transparent">Product Roadmap</h2>
                    <p className="text-muted-foreground text-lg">
                        Our journey to building the future of technology
                    </p>
                </div>
                <Timeline
                    items={roadmapItems}
                    variant="spacious"
                    showTimestamps={true}
                    timestampPosition="top"
                />
            </div>
        </div>
    );
}
