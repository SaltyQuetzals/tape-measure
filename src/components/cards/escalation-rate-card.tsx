import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "../ui/card";
import { WINDOW_SIZE } from "@/lib/constants";
import { ChangeRateBadge } from "./internal/change-rate-badge";

interface EscalationRateCardProps {
    escalationRates: { currentWindow: Record<string, number>, allTime: Record<string, number> }
}

export function EscalationRateCard(props: EscalationRateCardProps) {
    const currentWindowEscalations = props.escalationRates.currentWindow["blocked_needs_human"];
    const currentWindowTotal = Object.values(props.escalationRates.currentWindow).reduce((acc, curr) => acc + curr, 0);
    const currentWindowEscalationRate = currentWindowEscalations / currentWindowTotal;

    const allTimeEscalations = props.escalationRates.allTime["blocked_needs_human"];
    const allTimeTotal = Object.values(props.escalationRates.allTime).reduce((acc, curr) => acc + curr, 0);
    const allTimeEscalationRate = allTimeEscalations / allTimeTotal;
    const currentWindowEscalationRateChange = (currentWindowEscalationRate - allTimeEscalationRate) / allTimeEscalationRate * 100;

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardDescription>Escalation Rate</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {currentWindowEscalationRate.toFixed(2)}%
                </CardTitle>
                <div className="absolute right-4 top-4">
                    <ChangeRateBadge change={currentWindowEscalationRateChange} />
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    Escalations this period {currentWindowEscalationRateChange > 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
                </div>
                <div className="text-muted-foreground">
                    Escalations over the last {WINDOW_SIZE} days
                </div>
            </CardFooter>
        </Card>
    )
}