import { router } from '@inertiajs/react';

interface WizardStep {
    id: string;
    title: string;
    href: string;
    status: 'completed' | 'current' | 'upcoming';
}

interface CompanyWizardProps {
    currentStep: string;
    className?: string;
}

export function CompanyWizard({ currentStep, className }: CompanyWizardProps) {
    // Simple navigation items without step concept
    const steps: WizardStep[] = [
        {
            id: 'administration',
            title: 'Administration',
            href: '/dashboard/company/administration',
            status: currentStep === 'administration' ? 'current' : 'upcoming'
        },
        {
            id: 'assessment',
            title: 'Assessment',
            href: '/dashboard/company/assessment',
            status: currentStep === 'assessment' ? 'current' : 'upcoming'
        },
        {
            id: 'interview',
            title: 'Interview',
            href: '/dashboard/company/interview',
            status: currentStep === 'interview' ? 'current' : 'upcoming'
        },
        {
            id: 'reports',
            title: 'Reports',
            href: '/dashboard/company/reports',
            status: currentStep === 'reports' ? 'current' : 'upcoming'
        }
    ];

    const handleStepClick = (step: WizardStep) => {
        // Preserve URL parameters (period and company) when navigating between pages
        const urlParams = new URLSearchParams(window.location.search);
        const periodId = urlParams.get('period');
        const companyId = urlParams.get('company');
        
        // Add parameters to the href if they exist
        let href = step.href;
        const params = [];
        
        if (periodId) {
            params.push(`period=${periodId}`);
        }
        
        if (companyId) {
            params.push(`company=${companyId}`);
        }
        
        if (params.length > 0) {
            href = `${href}?${params.join('&')}`;
        }
        
        router.visit(href);
    };

    // Check if this is the inline compact version (no border, transparent background)
    const isInline = className?.includes('!border-0') && className?.includes('!bg-transparent');

    if (isInline) {
        // Compact inline version for centered top display
        return (
            <div className={`flex justify-center ${className || ''}`}>
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepClick(step)}
                                        className={`
                                            px-6 py-3 text-base font-semibold transition-all duration-200 cursor-pointer
                                            ${step.status === 'current' 
                                                ? 'text-blue-700 border-b-2 border-blue-700' 
                                                : 'text-gray-600 hover:text-blue-600'
                                            }
                                        `}
                                    >
                                        {step.title}
                                    </button>
                                    {!isLast && (
                                        <div className="w-6 h-0.5 mx-3 bg-gray-300" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Original full card version for mobile/standalone display
    return (
        <div className="flex justify-center mb-8">
            <div className={`px-8 py-6 ${className || ''}`}>
                <div className="flex items-center space-x-2">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={step.id} className="flex items-center">
                                <button
                                    onClick={() => handleStepClick(step)}
                                    className={`
                                        px-6 py-4 text-lg font-semibold transition-all duration-200 cursor-pointer
                                        ${step.status === 'current' 
                                            ? 'text-blue-700 border-b-2 border-blue-700' 
                                            : 'text-gray-600 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    {step.title}
                                </button>
                                {!isLast && (
                                    <div className="w-10 h-0.5 mx-4 bg-gray-300" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}