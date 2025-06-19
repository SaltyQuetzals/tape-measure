import { WINDOW_SIZE } from "@/lib/constants";
import { computeTimeToBooking } from "@/lib/stats/computeTimeToBooking";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "../ui/card";
import { ChangeRateBadge } from "./internal/change-rate-badge";

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

const durationToTimeString = (duration: number) => {
    const totalSeconds = Math.floor(duration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
}

export function TimeToBookingCard(props: TimeToBookingCardProps) {
    const currentWindowTimeToBooking = props.timeToBooking.currentWindow.timeToBooking!;
    const allTimeTimeToBooking = props.timeToBooking.allTime.timeToBooking!;

    const currentWindowTimeToBookingChange = (currentWindowTimeToBooking - allTimeTimeToBooking) / allTimeTimeToBooking * 100;

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardDescription>Time to Booking</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {durationToTimeString(currentWindowTimeToBooking)}
                </CardTitle>
                <div className="absolute right-4 top-4">
                    <ChangeRateBadge change={currentWindowTimeToBookingChange} />
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    Time to booking this period {currentWindowTimeToBookingChange > 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
                </div>
                <div className="text-muted-foreground">
                    Time to booking over the last {WINDOW_SIZE} days
                </div>
            </CardFooter>
        </Card>
    )
}