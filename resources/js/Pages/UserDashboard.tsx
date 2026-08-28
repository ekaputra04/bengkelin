import { CustomerDashboardHero } from "@/Components/CustomerDashboard/CustomerDashboardHero";
import { CustomerOperationsSummary } from "@/Components/CustomerDashboard/CustomerOperationsSummary";
import { CustomerOverviewStats } from "@/Components/CustomerDashboard/CustomerOverviewStats";
import { CustomerScheduleAndRequests } from "@/Components/CustomerDashboard/CustomerScheduleAndRequests";
import { CustomerStatusDistribution } from "@/Components/CustomerDashboard/CustomerStatusDistribution";
import { CustomerVehiclesAndHistory } from "@/Components/CustomerDashboard/CustomerVehiclesAndHistory";
import { CustomerDashboardProps } from "@/Components/CustomerDashboard/types";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TUser } from "@/types/types";
import { Head, usePage } from "@inertiajs/react";

export default function UserDashboard({
    overview,
    todaySummary,
    statusSummary,
    requestSummary,
    nextBooking,
    todayBookings,
    upcomingBookings,
    recentBookings,
    waitingRequests,
    vehicles,
}: CustomerDashboardProps) {
    const { auth } = usePage<{ auth: { user: TUser } }>().props;

    return (
        <DashboardLayout>
            <Head title="Dashboard Customer" />

            <div className="space-y-6">
                <CustomerDashboardHero
                    userName={auth.user.name}
                    date={todaySummary.date}
                    totalVehicles={overview.total_vehicles}
                    remainingRevenueOpen={overview.remaining_revenue_open}
                    nextBooking={nextBooking}
                />

                <CustomerOverviewStats
                    activeBookings={overview.active_bookings}
                    waitingRequests={overview.waiting_requests}
                    processingRequests={overview.processing_requests}
                    dpPaidTotal={overview.dp_paid_total}
                />

                <CustomerOperationsSummary
                    todaySummary={todaySummary}
                    overview={overview}
                />

                <CustomerStatusDistribution
                    statusSummary={statusSummary}
                    requestSummary={requestSummary}
                />

                <CustomerScheduleAndRequests
                    todayBookings={todayBookings}
                    upcomingBookings={upcomingBookings}
                    waitingRequests={waitingRequests}
                />

                <CustomerVehiclesAndHistory
                    recentBookings={recentBookings}
                    vehicles={vehicles}
                />
            </div>
        </DashboardLayout>
    );
}
