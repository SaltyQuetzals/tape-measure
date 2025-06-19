import { WINDOW_SIZE } from "@/lib/constants";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "../ui/card";

function ChangeRateBadge({ change }: { change: number }) {
    return (
        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {change > 0 ? <><TrendingUpIcon className="size-3" />+{change.toFixed(2)}%</> : <><TrendingDownIcon className="size-3" />{change.toFixed(2)}%</>}
        </Badge>
    )
}

interface ResolutionRateCardProps {
    resolutionRates: { currentWindow: Record<string, number>, allTime: Record<string, number> }
}

export function ResolutionRateCard(props: ResolutionRateCardProps) {
    const currentWindowResolved = Object.values(props.resolutionRates.currentWindow).reduce((acc, curr) => acc + curr, 0);
    const allTimeResolved = Object.values(props.resolutionRates.allTime).reduce((acc, curr) => acc + curr, 0);
  
    const RESOLVED_STATUSES = [
      "abandoned",
      "booked",
      "declined",
      "do_not_contact",
      "spam",
      "wrong_number"
    ];
  
    const currentWindowResolvedCount = RESOLVED_STATUSES.reduce((acc, curr) => acc + props.resolutionRates.currentWindow[curr], 0);
    const allTimeResolvedCount = RESOLVED_STATUSES.reduce((acc, curr) => acc + props.resolutionRates.allTime[curr], 0);
  
    const currentWindowResolutionRate = (currentWindowResolvedCount > 0 ? currentWindowResolvedCount / currentWindowResolved : 0) * 100;
    const allTimeResolutionRate = (allTimeResolvedCount > 0 ? allTimeResolvedCount / allTimeResolved : 0) * 100;
  
    const currentWindowResolutionRateChange = (currentWindowResolutionRate - allTimeResolutionRate) / allTimeResolutionRate * 100;
    return <Card className="@container/card">
        <CardHeader className="relative">
            <CardDescription>Resolution Rate</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {currentWindowResolutionRate.toFixed(2)}%
            </CardTitle>
            <div className="absolute right-4 top-4">
                <ChangeRateBadge change={currentWindowResolutionRateChange} />
            </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                Trending {currentWindowResolutionRateChange > 0 ? "up" : "down"} <>{currentWindowResolutionRateChange > 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}</>
            </div>
            <div className="text-muted-foreground">
                Resolved cases over the last {WINDOW_SIZE} days
            </div>
        </CardFooter>
    </Card>
}