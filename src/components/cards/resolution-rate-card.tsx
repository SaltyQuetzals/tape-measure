import { 
  MetricCard, 
  calculateResolutionRate, 
  calculatePercentageChange, 
  formatPercentage, 
  generateTrendText 
} from "./internal";

interface ResolutionRateCardProps {
    resolutionRates: { currentWindow: Record<string, number>, allTime: Record<string, number> }
}

export function ResolutionRateCard(props: ResolutionRateCardProps) {
    // Calculate resolution rates for current window and all time
    const currentWindowResolutionRate = calculateResolutionRate(props.resolutionRates.currentWindow);
    const allTimeResolutionRate = calculateResolutionRate(props.resolutionRates.allTime);
    
    // Calculate percentage change
    const change = calculatePercentageChange(currentWindowResolutionRate, allTimeResolutionRate);
    
    // Generate trend text
    const trendText = generateTrendText(change, "Trending");

    return (
        <MetricCard
            title="Resolution Rate"
            value={currentWindowResolutionRate}
            change={change}
            trendText={trendText}
            subtitle="Resolved cases"
            valueFormatter={formatPercentage}
        />
    );
}