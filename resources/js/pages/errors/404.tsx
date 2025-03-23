import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';

export default function NotFound({ error = 'Page Not Found', message = null }) {
    return (
        <>
            <Head title="Page Not Found" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-full max-w-md space-y-6">
                    {/* Error code */}
                    <h1 className="text-primary text-9xl font-extrabold">404</h1>

                    {/* Error illustration */}
                    <div className="relative mx-auto h-40 w-40">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                        >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 8h20" />
                            <path d="m8.5 14.5 7-5" />
                            <path d="m8.5 9.5 7 5" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-red-500"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                    </div>

                    {/* Error message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold tracking-tight">{error}</h2>
                        <p className="text-muted-foreground">{message || 'Sorry, the page you are looking for could not be found.'}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-3">
                        <Button variant="outline" onClick={() => router.visit('/')} className="w-full sm:w-auto">
                            Go to Homepage
                        </Button>
                    </div>
                </div>

                {/* Footer message */}
                <p className="text-muted-foreground mt-10 text-sm">If you believe this is an error, please contact support.</p>
            </div>
        </>
    );
}
