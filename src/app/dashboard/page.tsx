import { ChartLineInteractive } from '@/components/chart-line-interactive'
import { DashboardTable } from '@/components/dashboard-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { summaryResolutionRate } from '../../lib/stats/summaryResolutionRate'
import { WINDOW_SIZE } from '@/lib/constants'
import { computeTimeToBooking } from '@/lib/stats/computeTimeToBooking'
import { computeResolutionRateOverTime } from '@/lib/stats/computeResolutionRateOverTime'
import { db } from '@/db'
import { conversations } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { ActionPerformanceCard } from '@/components/cards/action-performance-card'
import { actionPerformance } from '@/lib/stats/actionPerformance'

export default async function Page() {
  const data = await db.select().from(conversations).orderBy(desc(conversations.urgency), desc(conversations.createdAt));

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

  const actionPerformances = await actionPerformance();

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
            <div className="px-4 lg:px-6">
              <DashboardTable data={data} />
            </div>
            <div className="px-4 lg:px-6">
              <ActionPerformanceCard actionPerformances={actionPerformances} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
