import {
    ArrowRight, CalendarCheck, Clock3, LayoutDashboard, LogOut, ShieldCheck, Wrench
} from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { TUser } from '@/types/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Welcome() {
    const auth = usePage().props.auth;
    const user = auth.user as TUser;

    return (
        <>
            <Head title="Bengkelin - Servis Kendaraan Lebih Mudah" />

            <div className="bg-background min-h-screen">
                <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-b">
                    <div className="flex justify-between items-center mx-auto px-4 sm:px-6 max-w-7xl h-16">
                        <Link href="/" className="shrink-0">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/logo.png"
                                    alt="Bengkelin"
                                    className="w-8 sm:w-9 aspect-square"
                                />

                                <div className="hidden sm:block">
                                    <h1 className="font-bold text-primary text-lg sm:text-xl leading-tight">
                                        Bengkelin
                                    </h1>

                                    <p className="text-[10px] text-muted-foreground sm:text-xs leading-tight">
                                        Sistem Reservasi Bengkel
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <p className="hidden lg:block font-semibold text-sm">
                                    Halo, {user.name}
                                </p>

                                <Link
                                    href={
                                        user.role === "admin"
                                            ? route("admin.dashboard")
                                            : route("customer.dashboard")
                                    }
                                >
                                    <Button
                                        size="sm"
                                        className="whitespace-nowrap"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />

                                        <span className="hidden sm:inline">
                                            Dashboard
                                        </span>
                                    </Button>
                                </Link>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="whitespace-nowrap"
                                    onClick={() => {
                                        router.post(route("logout"));
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />

                                    <span className="hidden sm:inline">
                                        Logout
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link href={route("login")}>
                                    <Button size="sm">Masuk</Button>
                                </Link>

                                <Link href={route("register")}>
                                    <Button size="sm" variant="outline">
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <main>
                    <section className="mx-auto px-6 pt-16 md:pt-24 pb-20 max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 bg-primary/10 mb-6 px-3 py-1.5 rounded-full text-primary text-sm">
                                <Wrench className="w-4 h-4" />
                                <span>Solusi servis kendaraan</span>
                            </div>

                            <h1 className="font-bold text-4xl md:text-6xl leading-tight tracking-tight">
                                Servis kendaraan jadi{" "}
                                <span className="text-primary">
                                    lebih mudah.
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
                                Atur jadwal servis kendaraan, pilih layanan, dan
                                pantau proses pengerjaan tanpa perlu antre lama
                                di bengkel.
                            </p>

                            <div className="flex sm:flex-row flex-col justify-center gap-3 mt-8">
                                <Link href={route("register")}>
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        Mulai Booking
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>

                                <Link href={route("login")}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        Sudah punya akun?
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-16 md:mt-20">
                            <img
                                src="/images/hero.png"
                                alt="Bengkelin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </section>

                    <section className="bg-muted/30 border-y">
                        <div className="mx-auto px-6 py-20 max-w-7xl">
                            <div className="mx-auto mb-12 max-w-2xl text-center">
                                <p className="font-medium text-primary text-sm">
                                    Lebih praktis
                                </p>

                                <h2 className="mt-2 font-semibold text-3xl tracking-tight">
                                    Semua kebutuhan servis dalam satu tempat
                                </h2>

                                <p className="mt-4 text-muted-foreground">
                                    Bengkelin membantu Anda mengatur servis
                                    kendaraan dengan proses yang lebih
                                    sederhana.
                                </p>
                            </div>

                            <div className="gap-5 grid md:grid-cols-3">
                                <FeatureCard
                                    icon={CalendarCheck}
                                    title="Booking Servis"
                                    description="Pilih kendaraan, layanan, dan waktu servis sesuai kebutuhan Anda."
                                />

                                <FeatureCard
                                    icon={Clock3}
                                    title="Jadwal Teratur"
                                    description="Dapatkan jadwal servis yang jelas tanpa perlu menunggu lama."
                                />

                                <FeatureCard
                                    icon={ShieldCheck}
                                    title="Proses Terpantau"
                                    description="Pantau status pengerjaan kendaraan Anda secara lebih mudah."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto px-6 py-20 max-w-7xl">
                        <div className="relative bg-primary px-6 md:px-12 py-12 rounded-2xl overflow-hidden text-primary-foreground">
                            <div className="z-10 relative max-w-2xl">
                                <h2 className="font-semibold text-3xl tracking-tight">
                                    Siap melakukan servis?
                                </h2>

                                <p className="opacity-80 mt-3">
                                    Daftarkan kendaraan Anda dan buat booking
                                    servis dengan mudah.
                                </p>

                                <Link href={route("register")}>
                                    <Button
                                        variant="secondary"
                                        className="mt-6"
                                    >
                                        Mulai Sekarang
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="flex sm:flex-row flex-col justify-between items-center gap-3 mx-auto px-6 py-6 max-w-7xl text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4" />

                            <span>© {new Date().getFullYear()} Bengkelin</span>
                        </div>

                        <span>Solusi servis kendaraan yang lebih praktis.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-background p-6 border rounded-xl">
            <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10">
                <Icon className="w-5 h-5 text-primary" />
            </div>

            <h3 className="mt-5 font-semibold">{title}</h3>

            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}
