import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "../../ui/card";
import { ChangeRateBadge } from "./change-rate-badge";
import { WINDOW_SIZE } from "@/lib/constants";

/**
 * Props for the shared metric card component
 */
export interface MetricCardProps {
  /** The title/description of the metric */
  title: string;
  /** The current value to display */
  value: string | number;
  /** The percentage change from baseline */
  change: number;
  /** The trend description text */
  trendText: string;
  /** The subtitle/context text */
  subtitle: string;
  /** Optional custom subtitle (overrides default WINDOW_SIZE text) */
  customSubtitle?: string;
  /** Optional formatter for the value */
  valueFormatter?: (value: string | number) => string;
}

/**
 * Shared base component for metric cards that displays a value with change indicator
 */
export function MetricCard({
  title,
  value,
  change,
  trendText,
  subtitle,
  customSubtitle,
  valueFormatter = (val) => String(val)
}: MetricCardProps) {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {valueFormatter(value)}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <ChangeRateBadge change={change} />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {trendText} <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          {customSubtitle || `${subtitle} over the last ${WINDOW_SIZE} days`}
        </div>
      </CardFooter>
    </Card>
  );
} 