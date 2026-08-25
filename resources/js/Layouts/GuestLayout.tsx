import { PropsWithChildren } from "react";

import { Link } from "@inertiajs/react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="grid lg:grid-cols-2 min-h-svh">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center md:justify-start gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-medium"
                    >
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-8"
                        />
                        <h1 className="font-semibold text-primary text-lg">
                            Bengkelin
                        </h1>
                    </Link>
                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div className="w-full max-w-xs">{children}</div>
                </div>
            </div>
            <div className="hidden lg:block relative bg-muted">
                <img
                    src="/images/bengkel.png"
                    alt="Image"
                    className="absolute inset-0 dark:brightness-[0.2] dark:grayscale w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
