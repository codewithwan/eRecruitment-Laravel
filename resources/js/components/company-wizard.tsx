import { Card } from '@/components/ui/card';
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
    // Periods is not part of the actual workflow steps, just initial display
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

    const currentIndex = steps.findIndex(s => s.id === currentStep);
    // If periods page, treat as step 0 (before first actual step)
    const actualIndex = currentStep === 'periods' ? -1 : currentIndex;

    const handleStepClick = (step: WizardStep, index: number) => {
        // Allow smooth navigation to any step without restrictions
        router.visit(step.href);
    };

    // Check if this is the inline compact version (no border, transparent background)
    const isInline = className?.includes('!border-0') && className?.includes('!bg-transparent');

    if (isInline) {
        // Compact inline version for display next to title
        return (
            <div className={`flex items-center ${className || ''}`}>
                <div className="flex items-center space-x-1">
                    {steps.map((step, index) => {
                        const isClickable = index <= currentIndex + 1;
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={step.id} className="flex items-center">
                                <button
                                    onClick={() => handleStepClick(step, index)}
                                    className={`
                                        flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer
                                        ${step.status === 'current' 
                                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-4 h-4 rounded-full flex items-center justify-center mr-1 text-xs
                                        ${step.status === 'current'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }
                                    `}>
                                        {index + 1}
                                    </div>
                                    {step.title}
                                </button>
                                {!isLast && (
                                    <div className="w-4 h-px mx-1 bg-gray-200" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Original full card version for mobile/standalone display
    return (
        <Card className={`mb-6 border-0 shadow-sm bg-white ${className || ''}`}>
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        {steps.map((step, index) => {
                            const isClickable = index <= currentIndex + 1;
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepClick(step, index)}
                                        className={`
                                            flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                            ${step.status === 'current' 
                                                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs
                                            ${step.status === 'current'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }
                                        `}>
                                            {index + 1}
                                        </div>
                                        {step.title}
                                    </button>
                                    {!isLast && (
                                        <div className="w-8 h-px mx-2 bg-gray-200" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="text-right">
                        <div className="text-xs text-gray-500">
                            {currentStep === 'periods' ? 'Initial Setup' : `Step ${actualIndex + 1} of ${steps.length}`}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                            {currentStep === 'periods' ? 'Periods Management' : steps.find(s => s.id === currentStep)?.title}
                        </div>
                    </div>
                </div>

                {/* Simple Progress Bar */}
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-500 ease-out"
                            style={{ width: currentStep === 'periods' ? '0%' : `${((actualIndex + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}