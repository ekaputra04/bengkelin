import { LogIn } from "lucide-react";
import { FormEventHandler } from "react";

import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Spinner } from "@/Components/ui/spinner";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            {status && (
                <div className="mb-4 font-medium text-green-600 text-sm">
                    {status}
                </div>
            )}

            <div className="flex flex-col items-center gap-1 mb-16 text-center">
                <h1 className="font-bold text-2xl">Masuk ke Sistem</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Masukkan email dan password untuk masuk
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block mt-1 w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        disabled={processing}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block mt-1 w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        disabled={processing}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex justify-end items-center mt-4">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 hover:text-gray-900 text-sm underline"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    "remember",
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-gray-600 text-sm">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <Button
                    type="submit"
                    className="mt-4 w-full"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Spinner />
                            Proses
                        </>
                    ) : (
                        <>
                            <LogIn />
                            Masuk
                        </>
                    )}
                </Button>

                <div className="mt-8 text-muted-foreground text-sm">
                    Tidak punya akun?{" "}
                    <Link
                        href="/register"
                        className="underline underline-offset-4"
                    >
                        Daftar
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
