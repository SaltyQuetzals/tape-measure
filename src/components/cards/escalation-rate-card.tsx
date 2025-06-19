import { 
  MetricCard, 
  calculateEscalationRate, 
  calculatePercentageChange, 
  formatPercentage, 
  generateTrendText 
} from "./internal";

interface EscalationRateCardProps {
    escalationRates: { currentWindow: Record<string, number>, allTime: Record<string, number> }
}

export function EscalationRateCard(props: EscalationRateCardProps) {
    // Calculate escalation rates for current window and all time
    const currentWindowEscalationRate = calculateEscalationRate(props.escalationRates.currentWindow);
    const allTimeEscalationRate = calculateEscalationRate(props.escalationRates.allTime);
    
    // Calculate percentage change
    const change = calculatePercentageChange(currentWindowEscalationRate, allTimeEscalationRate);
    
    // Generate trend text
    const trendText = generateTrendText(change, "Escalations this period");

    return (
        <MetricCard
            title="Escalation Rate"
            value={currentWindowEscalationRate}
            change={change}
            trendText={trendText}
            subtitle="Escalations"
            valueFormatter={formatPercentage}
        />
    );
}