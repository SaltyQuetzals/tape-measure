import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import data from './data.json'
import { AppSidebar } from '@/components/app-sidebar'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { computeResolutionRates } from '../../lib/stats/computeResolutionRate'
import { WINDOW_SIZE } from '@/lib/constants'
import { computeTimeToBooking } from '@/lib/stats/computeTimeToBooking'

export default async function Page() {
  // Create a Date representing 14 days ago
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(now.getDate() - WINDOW_SIZE);

  const currentWindowResolutionRates = await computeResolutionRates(windowStart);
  const previousResolutionRates = await computeResolutionRates(undefined, windowStart);

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
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards resolutionRates={resolutionRates} timeToBooking={timeToBooking} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
