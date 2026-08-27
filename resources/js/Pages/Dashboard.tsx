import { DashboardHero } from "@/Components/Dashboard/DashboardHero";
import { OperationsSummary } from "@/Components/Dashboard/OperationsSummary";
import { OverviewStats } from "@/Components/Dashboard/OverviewStats";
import { ScheduleAndMechanics } from "@/Components/Dashboard/ScheduleAndMechanics";
import { StatusDistribution } from "@/Components/Dashboard/StatusDistribution";
import { DashboardProps } from "@/Components/Dashboard/types";
import { UpcomingAndWaiting } from "@/Components/Dashboard/UpcomingAndWaiting";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function Page({
    overview,
    todaySummary,
    statusSummary,
    requestSummary,
    todayBookings,
    upcomingBookings,
    waitingRequests,
    mechanicLoad,
}: DashboardProps) {
    return (
        <DashboardLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                <DashboardHero
                    date={todaySummary.date}
                    totalBookings={overview.total_bookings}
                    totalVehicles={overview.total_vehicles}
                    remainingRevenueOpen={overview.remaining_revenue_open}
                />

                <OverviewStats
                    activeWorkOrders={overview.active_work_orders}
                    waitingRequests={overview.waiting_requests}
                    activeMechanics={overview.active_mechanics}
                    dpCollectedThisMonth={overview.dp_collected_this_month}
                />

                <OperationsSummary
                    todaySummary={todaySummary}
                    overview={overview}
                />

                <StatusDistribution
                    statusSummary={statusSummary}
                    requestSummary={requestSummary}
                />

                <ScheduleAndMechanics
                    todayBookings={todayBookings}
                    mechanicLoad={mechanicLoad}
                />

                <UpcomingAndWaiting
                    upcomingBookings={upcomingBookings}
                    waitingRequests={waitingRequests}
                />
            </div>
        </DashboardLayout>
    );
}
