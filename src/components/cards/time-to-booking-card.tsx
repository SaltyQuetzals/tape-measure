import { 
  MetricCard, 
  calculatePercentageChange, 
  formatDuration, 
  generateTrendText 
} from "./internal";

interface TimeToBookingCardProps {
    timeToBooking: {
        currentWindow: {
            count: number;
            timeToBooking: number | null;
        }, allTime: {
            count: number;
            timeToBooking: number | null;
        }
    }
}

export function TimeToBookingCard(props: TimeToBookingCardProps) {
    const currentWindowTimeToBooking = props.timeToBooking.currentWindow.timeToBooking!;
    const allTimeTimeToBooking = props.timeToBooking.allTime.timeToBooking!;

    // Calculate percentage change
    const change = calculatePercentageChange(currentWindowTimeToBooking, allTimeTimeToBooking);
    
    // Generate trend text
    const trendText = generateTrendText(change, "Time to booking this period");

    return (
        <MetricCard
            title="Time to Booking"
            value={currentWindowTimeToBooking}
            change={change}
            trendText={trendText}
            subtitle="Time to booking"
            valueFormatter={formatDuration}
        />
    );
}