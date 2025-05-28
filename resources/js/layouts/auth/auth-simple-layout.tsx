import AppLogoIcon from '@/components/app-logo-icon';
import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    assetSrc?: string; // Optional prop for the asset image source
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh">
            {/* Left column - Assets section */}
            <div className="hidden items-center justify-center p-6 md:flex md:w-2/3">
                <div className="text-muted-foreground flex h-full items-center justify-center">
                    <img src="/images/auth.png" alt="Login illustration" className="max-h-full max-w-[100%] object-contain" />
                </div>
            </div>

            {/* Right column - Login card */}
            <div className="flex w-full flex-col items-center justify-center gap-6 p-6 md:w-1/2 md:p-10">
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
