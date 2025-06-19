import { ResolutionRateCard } from "./cards/resolution-rate-card"
import { EscalationRateCard } from "./cards/escalation-rate-card"
import { TimeToBookingCard } from "./cards/time-to-booking-card"

interface SectionCardsProps {
  resolutionRates: { currentWindow: Record<string, number>, allTime: Record<string, number> }
  timeToBooking: { currentWindow: { count: number, timeToBooking: number | null }, allTime: { count: number, timeToBooking: number | null } }
}

export function SectionCards(props: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <ResolutionRateCard resolutionRates={props.resolutionRates} />
      <EscalationRateCard escalationRates={props.resolutionRates} />
      <TimeToBookingCard timeToBooking={props.timeToBooking} />
    </div>
  )
}
