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
        router.visit(step.href);
    };

    // Check if this is the inline compact version (no border, transparent background)
    const isInline = className?.includes('!border-0') && className?.includes('!bg-transparent');

    if (isInline) {
        // Compact inline version for display in top-right corner
        return (
            <div className={`${className || ''}`}>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center space-x-2">
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepClick(step)}
                                        className={`
                                            px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer
                                            ${step.status === 'current' 
                                                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                                        `}
                                    >
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
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepClick(step)}
                                        className={`
                                            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                            ${step.status === 'current' 
                                                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                                        `}
                                    >
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
                        <div className="text-sm font-medium text-gray-700">
                            {currentStep === 'periods' ? 'Periods Management' : steps.find(s => s.id === currentStep)?.title}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}