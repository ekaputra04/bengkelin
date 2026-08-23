import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function Page() {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="">Dashboard</div>
        </DashboardLayout>
    );
}
