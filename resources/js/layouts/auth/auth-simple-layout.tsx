import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    assetSrc?: string; // Optional prop for the asset image source
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh">
            {/* Left column - Assets section */}
            <div className="hidden md:flex md:w-2/3 items-center justify-center p-6">
                <div className="text-muted-foreground flex items-center justify-center h-full">
                    <img src="/images/auth.png" alt="Login illustration" className="max-w-[60%] max-h-full object-contain" />
                </div>
            </div>

            {/* Right column - Login card */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-6 p-6 md:p-10">
                <Card className="w-full max-w-sm p-6">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-muted-foreground text-center text-sm">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    );
}
