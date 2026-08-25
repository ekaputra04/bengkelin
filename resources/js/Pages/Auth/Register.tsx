import { LogIn } from "lucide-react";
import { FormEventHandler } from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Spinner } from "@/Components/ui/spinner";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex flex-col items-center gap-1 mb-16 text-center">
                <h1 className="font-bold text-2xl">Daftar ke Sistem</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Masukkan data untuk mendaftar
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nama" />

                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="block mt-1 w-full"
                        autoComplete="name"
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        disabled={processing}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block mt-1 w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        disabled={processing}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                    />

                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block mt-1 w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                        disabled={processing}
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
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
                            Daftar
                        </>
                    )}
                </Button>

                <div className="mt-8 text-muted-foreground text-sm">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="underline underline-offset-4"
                    >
                        Masuk
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
