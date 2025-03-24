import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Psychometric Tests',
        href: '/dashboard/psychometric',
    },
];

interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;  // Position applied for
    applicationDate: string; // When they applied
    status: 'pending' | 'completed' | 'not_started';
    score?: number;
}

interface TestQuestion {
    id: number;
    question: string;
    type: 'multiple_choice' | 'essay' | 'personality';
    options?: string[];
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    test_type: string;
    duration: string;
    questions?: TestQuestion[];
}

interface PsychometricTest {
    id: number;
    title: string;
    description: string;
    status: string;
    position?: string; // Added position field
    questions?: TestQuestion[];
    duration?: number; // in minutes
    scheduledDate?: string;
    scheduledTime?: string;
    candidates?: Candidate[];
}

export default function PsychometricManagement({ tests = [] }: { tests?: PsychometricTest[] }) {
    const [psychometricTests, setPsychometricTests] = useState<PsychometricTest[]>(tests);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState<PsychometricTest | null>(null);
    const [activeTab, setActiveTab] = useState('info');
    const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([]);
    const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
    const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
    const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active',
        position: '', // Added position field
        duration: 60,
        scheduledDate: '',
        scheduledTime: '09:00',
        notifyCandidate: true
    });
    
    const fetchTests = async () => {
        try {
            const response = await axios.get('/dashboard/psychometric/data');
            setPsychometricTests(response.data.tests);
        } catch (error) {
            console.error('Failed to fetch tests:', error);
        }
    };
    
    useEffect(() => {
        if (tests.length === 0) {
            fetchTests();
        }
    }, []);
    
    const handleAddClick = () => {
        setCurrentTest(null);
        setIsModalOpen(true);
        // Fetch available assessments and candidates for new test creation
        fetchAvailableAssessments();
        fetchAvailableCandidates();
    };
    
    const handleEditClick = (test: PsychometricTest) => {
        setCurrentTest(test);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = async (id: number) => {
        if (confirm('Are you sure you want to delete this test?')) {
            try {
                await axios.delete(`/dashboard/psychometric/${id}`);
                setPsychometricTests(psychometricTests.filter(test => test.id !== id));
            } catch (error) {
                console.error('Failed to delete test:', error);
            }
        }
    };
    
    const handleSubmit = async (data: Partial<PsychometricTest>) => {
        try {
            let testId;
            if (currentTest) {
                const response = await axios.put(`/dashboard/psychometric/${currentTest.id}`, data);
                testId = currentTest.id;
            } else {
                // When creating a new test, include selected assessment and candidates
                const payload = {
                    ...data,
                    assessment_id: selectedAssessment,
                    candidateIds: selectedCandidates
                };
                const response = await axios.post('/dashboard/psychometric', payload);
                testId = response.data.test.id;
            }
            setIsModalOpen(false);
            fetchTests();
        } catch (error) {
            console.error('Failed to save test:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            status: 'active',
            position: '', // Added position field
            duration: 60,
            scheduledDate: '',
            scheduledTime: '09:00',
            notifyCandidate: true
        });
        setActiveTab('info');
        setSelectedCandidates([]);
        setSelectedQuestions([]);
        setSelectedAssessment(null);
    };
    
    useEffect(() => {
        if (currentTest) {
            setFormData({
                title: currentTest.title,
                description: currentTest.description,
                status: currentTest.status,
                position: currentTest.position || '', // Added position field
                duration: currentTest.duration || 60,
                scheduledDate: currentTest.scheduledDate || '',
                scheduledTime: currentTest.scheduledTime || '09:00',
                notifyCandidate: true
            });
            
            // Load candidates for this test
            if (currentTest.id) {
                fetchTestCandidates(currentTest.id);
            }
        } else {
            resetForm();
        }
    }, [currentTest]);
    
    const fetchTestCandidates = async (testId: number) => {
        try {
            const response = await axios.get(`/dashboard/psychometric/${testId}/candidates`);
            if (currentTest) {
                setCurrentTest({
                    ...currentTest,
                    candidates: response.data.candidates
                });
            }
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    };
    
    const fetchAvailableCandidates = async () => {
        try {
            const response = await axios.get('/dashboard/candidates/available');
            setAvailableCandidates(response.data.candidates);
        } catch (error) {
            console.error('Failed to fetch available candidates:', error);
        }
    };
    
    const fetchAvailableAssessments = async () => {
        try {
            const response = await axios.get('/dashboard/assessments/available');
            setAvailableAssessments(response.data.assessments);
        } catch (error) {
            console.error('Failed to fetch available assessments:', error);
        }
    };
    
    const handleCandidateSelection = (candidateId: number) => {
        if (selectedCandidates.includes(candidateId)) {
            setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
        } else {
            setSelectedCandidates([...selectedCandidates, candidateId]);
        }
    };
    
    const handleQuestionSelection = (questionId: number) => {
        if (selectedQuestions.includes(questionId)) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
        } else {
            setSelectedQuestions([...selectedQuestions, questionId]);
        }
    };
    
    const handleAssessmentSelection = (assessmentId: number) => {
        setSelectedAssessment(assessmentId);
        
        // Find the selected assessment to get its duration
        const assessment = availableAssessments.find(a => a.id === assessmentId);
        if (assessment) {
            setFormData({
                ...formData,
                title: assessment.title,
                description: assessment.description,
                duration: parseInt(assessment.duration) || 60,
            });
            
            // If the assessment has questions, update the selected questions
            if (assessment.questions) {
                setSelectedQuestions(assessment.questions.map(q => q.id));
            }
        }
    };
    
    const assignCandidates = async () => {
        if (!currentTest) return;
        
        try {
            await axios.post(`/dashboard/psychometric/${currentTest.id}/assign-candidates`, {
                candidateIds: selectedCandidates
            });
            fetchTestCandidates(currentTest.id);
            alert('Candidates assigned successfully!');
        } catch (error) {
            console.error('Failed to assign candidates:', error);
            alert('Failed to assign candidates.');
        }
    };
    
    const removeCandidateFromTest = async (candidateId: number) => {
        if (!currentTest) return;
        
        try {
            await axios.delete(`/dashboard/psychometric/${currentTest.id}/candidates/${candidateId}`);
            fetchTestCandidates(currentTest.id);
        } catch (error) {
            console.error('Failed to remove candidate:', error);
        }
    };
    
    const uploadQuestions = async (file: File) => {
        if (!currentTest) return;
        
        const formData = new FormData();
        formData.append('questionsFile', file);
        
        try {
            await axios.post(`/dashboard/psychometric/${currentTest.id}/upload-questions`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Questions uploaded successfully!');
        } catch (error) {
            console.error('Failed to upload questions:', error);
            alert('Failed to upload questions.');
        }
    };
    
    const sendNotifications = async () => {
        if (!currentTest) return;
        
        try {
            await axios.post(`/dashboard/psychometric/${currentTest.id}/notify-candidates`);
            alert('Notifications sent successfully!');
        } catch (error) {
            console.error('Failed to send notifications:', error);
            alert('Failed to send notifications.');
        }
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Position
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                placeholder="e.g. Software Engineer, Marketing Manager"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </>
                );
            case 'candidates':
                return (
                    <>
                        <h4 className="font-medium mb-2">Assigned Candidates</h4>
                        <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
                            {currentTest?.candidates && currentTest.candidates.length > 0 ? (
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Position</th>
                                            <th className="px-4 py-2 text-left">Application Date</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTest.candidates.map(candidate => (
                                            <tr key={candidate.id}>
                                                <td className="px-4 py-2">
                                                    <div>{candidate.name}</div>
                                                    <div className="text-xs text-gray-500">{candidate.email}</div>
                                                </td>
                                                <td className="px-4 py-2">{candidate.position}</td>
                                                <td className="px-4 py-2">{candidate.applicationDate}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        candidate.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        candidate.status === 'not_started' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {candidate.status.replace('_', ' ')}
                                                    </span>
                                                    {candidate.status === 'completed' && candidate.score && (
                                                        <div className="text-xs mt-1">Score: {candidate.score}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button 
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => removeCandidateFromTest(candidate.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No candidates assigned to this test.</p>
                            )}
                        </div>
                        
                        <h4 className="font-medium mb-2 mt-6">Add Candidates</h4>
                        <button 
                            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={fetchAvailableCandidates}
                        >
                            Load Available Candidates
                        </button>
                        
                        <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
                            {availableCandidates.length > 0 ? (
                                <div>
                                    {availableCandidates.map(candidate => (
                                        <div key={candidate.id} className="flex items-center p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={selectedCandidates.includes(candidate.id)}
                                                onChange={() => handleCandidateSelection(candidate.id)}
                                                className="mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{candidate.name}</p>
                                                <div className="flex justify-between">
                                                    <p className="text-sm text-gray-500">{candidate.email}</p>
                                                    <p className="text-sm text-gray-500">Position: {candidate.position}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No available candidates or click load to fetch candidates.</p>
                            )}
                        </div>
                        
                        {selectedCandidates.length > 0 && (
                            <button 
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={assignCandidates}
                            >
                                Assign Selected Candidates
                            </button>
                        )}
                    </>
                );
            case 'questions':
                return (
                    <>
                        <div className="mb-6">
                            <h4 className="font-medium mb-2">Select Assessment</h4>
                            <p className="text-sm text-gray-500 mb-2">
                                Choose an assessment to use for this test. The assessment includes questions and duration settings.
                            </p>
                            <div className="max-h-60 overflow-y-auto border rounded p-2">
                                {availableAssessments.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {availableAssessments.map(assessment => (
                                            <div key={assessment.id} className="py-3 px-2 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        id={`assessment-${assessment.id}`}
                                                        name="assessment"
                                                        checked={selectedAssessment === assessment.id}
                                                        onChange={() => handleAssessmentSelection(assessment.id)}
                                                        className="mr-3 mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <label 
                                                            htmlFor={`assessment-${assessment.id}`}
                                                            className="font-medium cursor-pointer"
                                                        >
                                                            {assessment.title}
                                                        </label>
                                                        <p className="text-sm text-gray-600">{assessment.description}</p>
                                                        <div className="flex mt-1 text-xs text-gray-500">
                                                            <span className="mr-3">Type: {assessment.test_type}</span>
                                                            <span>Duration: {assessment.duration} minutes</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 p-2">No assessments available. Please create an assessment first.</p>
                                )}
                            </div>
                        </div>
                        
                        {currentTest?.questions && currentTest.questions.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">Current Questions</h4>
                                <div className="max-h-60 overflow-y-auto border rounded p-2">
                                    {currentTest?.questions && currentTest.questions.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {currentTest.questions.map((q, index) => (
                                                <li key={q.id} className="py-3 px-2">
                                                    <p className="font-medium">{index + 1}. {q.question}</p>
                                                    <p className="text-sm text-gray-500 capitalize mt-1">Type: {q.type.replace('_', ' ')}</p>
                                                    {q.options && (
                                                        <div className="mt-2 pl-5">
                                                            <p className="text-sm text-gray-600">Options:</p>
                                                            <ul className="list-disc pl-5">
                                                                {q.options.map((opt, i) => (
                                                                    <li key={i} className="text-sm">{opt}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 p-2">No questions added to this test yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'schedule':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Test Date
                                </label>
                                <input
                                    type="date"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Test Time
                                </label>
                                <input
                                    type="time"
                                    name="scheduledTime"
                                    value={formData.scheduledTime}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Test Duration (minutes)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                min="1"
                                max="240"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly={selectedAssessment !== null}
                            />
                            {selectedAssessment !== null && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Duration is set by the selected assessment.
                                </p>
                            )}
                        </div>
                        
                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                id="notifyCandidate"
                                name="notifyCandidate"
                                checked={formData.notifyCandidate}
                                onChange={(e) => setFormData({...formData, notifyCandidate: e.target.checked})}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="notifyCandidate" className="ml-2 block text-sm text-gray-700">
                                Send notification to candidates
                            </label>
                        </div>
                        
                        {currentTest && currentTest.candidates && currentTest.candidates.length > 0 && (
                            <button 
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                onClick={sendNotifications}
                            >
                                Send Notifications Now
                            </button>
                        )}
                    </>
                );
            default:
                return null;
        }
    };
    
    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Psychometric Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Psychometric Management</h2>
                    <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={handleAddClick}
                    >
                        Add New Test
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {psychometricTests.length > 0 ? (
                                    psychometricTests.map((test) => (
                                        <tr key={test.id}>
                                            <td className="px-6 py-4">
                                                {test.candidates ? (
                                                    <div className="flex items-center">
                                                        <span className="mr-2">{test.candidates.length}</span>
                                                        <div className="flex flex-col text-xs">
                                                            {test.candidates.length > 0 && (
                                                                <>
                                                                    <span className="text-blue-600">
                                                                        {test.candidates.map(c => c.position).filter((v, i, a) => a.indexOf(v) === i).length} positions
                                                                    </span>
                                                                    <span className="text-green-600">
                                                                        {test.candidates.filter(c => c.status === 'completed').length} completed
                                                                    </span>
                                                                    <span className="text-yellow-600">
                                                                        {test.candidates.filter(c => c.status === 'pending').length} pending
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : '0'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {test.position ? (
                                                    <>
                                                        <div className="font-medium">{test.position}</div>
                                                        <div className="text-sm text-gray-500">{test.title}</div>
                                                    </>
                                                ) : (
                                                    <div>{test.title || 'General Test'}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {test.scheduledDate ? (
                                                    <>
                                                        <div>Date: {test.scheduledDate}</div>
                                                        <div className="text-sm text-gray-500">Time: {test.scheduledTime}</div>
                                                        <div className="text-sm text-gray-500">Duration: {test.duration} mins</div>
                                                    </>
                                                ) : 'Not scheduled'}
                                            </td>
                                            <td className="px-6 py-4">{test.status}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    onClick={() => handleEditClick(test)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDeleteClick(test.id)}
                                                >
                                                    Delete
                                                </button>   
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No psychometric tests found. Add a new test to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal for adding/editing tests */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">
                            {currentTest ? 'Edit Test' : 'Add New Test'}
                        </h3>
                        
                        <div className="mb-6 border-b border-gray-200">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg border-b-2 ${
                                            activeTab === 'info' 
                                                ? 'border-blue-600 text-blue-600' 
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('info')}
                                    >
                                        Test Info
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg border-b-2 ${
                                            activeTab === 'candidates' 
                                                ? 'border-blue-600 text-blue-600' 
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('candidates')}
                                    >
                                        Candidates
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg border-b-2 ${
                                            activeTab === 'questions' 
                                                ? 'border-blue-600 text-blue-600' 
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('questions')}
                                    >
                                        Questions
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg border-b-2 ${
                                            activeTab === 'schedule' 
                                                ? 'border-blue-600 text-blue-600' 
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('schedule')}
                                    >
                                        Schedule
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <form onSubmit={handleModalSubmit}>
                            <div className="mb-6">
                                {renderTabContent()}
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    {currentTest ? 'Update' : 'Create Test'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
