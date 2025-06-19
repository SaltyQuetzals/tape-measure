import data from './data.json'
import { ChartLineInteractive } from '@/components/chart-line-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { summaryResolutionRate } from '../../lib/stats/summaryResolutionRate'
import { WINDOW_SIZE } from '@/lib/constants'
import { computeTimeToBooking } from '@/lib/stats/computeTimeToBooking'
import { computeResolutionRateOverTime } from '@/lib/stats/computeResolutionRateOverTime'

export default async function Page() {
  // Create a Date representing 14 days ago
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(now.getDate() - WINDOW_SIZE);

  const currentWindowResolutionRates = await summaryResolutionRate(windowStart);
  const previousResolutionRates = await summaryResolutionRate(undefined, windowStart);

  const resolutionRates = {
    currentWindow: currentWindowResolutionRates,
    allTime: previousResolutionRates
  }

  const currentWindowTimeToBooking = await computeTimeToBooking(windowStart);
  const previousTimeToBooking = await computeTimeToBooking(undefined, windowStart);

  const timeToBooking = {
    currentWindow: currentWindowTimeToBooking,
    allTime: previousTimeToBooking
  }

  const resolutionRateOverTime = await computeResolutionRateOverTime();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards resolutionRates={resolutionRates} timeToBooking={timeToBooking} />
            <div className="px-4 lg:px-6">
              <ChartLineInteractive resolutionRateOverTime={resolutionRateOverTime} />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
