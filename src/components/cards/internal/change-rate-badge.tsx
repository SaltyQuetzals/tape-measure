import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export function ChangeRateBadge({ change }: { change: number }) {
    return (
        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {change > 0 ? <><TrendingUpIcon className="size-3" />+{change.toFixed(2)}%</> : <><TrendingDownIcon className="size-3" />{change.toFixed(2)}%</>}
        </Badge>
    )
}