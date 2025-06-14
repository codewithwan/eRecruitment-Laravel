import { usePage } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

interface JobDetailProps {
    job: {
        id: number;
        title: string;
        company: { name: string };
        job_description: string;
        requirements: string[];
        benefits: string[];
        major_id: number;
        major_name: string | null;
    };
    userMajor: number | null;
    isMajorMatched: boolean;
    [key: string]: any; // Add index signature to satisfy PageProps constraint
}

const PageWrapper = styled.div`
    background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const HeroSection = styled.div`
    position: relative;
    height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('/images/background.png');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
`;

const JobTitle = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: bold;
`;

const CompanyTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
`;

const InfoSection = styled.section`
    margin: 40px 0;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeading = styled.h3`
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #222;
`;

const JobDescription = styled.p`
    line-height: 1.6;
    margin-bottom: 15px;
    color: #333;
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ListItem = styled.li`
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    color: #222;

    &:before {
        content: "•";
        position: absolute;
        left: 0;
        color: #1a73e8;
    }
`;

const ApplyButton = styled.button`
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 15px 150px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    display: block;
    margin: 40px auto;

    &:hover {
        background-color: #1557b0;
    }
`;

const MajorWarning = styled.div`
    background-color: #fff3cd;
    color: #856404;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid #ffeeba;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const WarningIcon = styled.span`
    font-size: 24px;
`;

const MajorMatch = styled.div`
    background-color: #d4edda;
    color: #155724;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid #c3e6cb;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const MatchIcon = styled.span`
    font-size: 24px;
`;

const JobDetailPage: React.FC = () => {
    const { job, userMajor, isMajorMatched, flash } = usePage<JobDetailProps & { flash: any }>().props;

    React.useEffect(() => {
        // Tampilkan flash messages dari backend
        if (flash?.success) {
            Swal.fire({
                title: 'Sukses!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Update URL untuk application history
                window.location.href = '/candidate/application-history';
            });
        }

        if (flash?.error) {
            Swal.fire({
                title: 'Perhatian!',
                text: flash.error,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }, [flash]);

    const handleApply = async () => {
        try {
            // Ambil CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (!csrfToken) {
                Swal.fire({
                    title: 'Error',
                    text: 'CSRF token tidak ditemukan. Silahkan refresh halaman.',
                    icon: 'error',
                    confirmButtonText: 'Refresh'
                }).then(() => {
                    window.location.reload();
                });
                return;
            }

            // Set headers untuk request
            const headers = {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            // Check if education data is complete first
            try {
                const educationResponse = await axios.get('/api/candidate/education', { headers });
                const educationData = educationResponse.data;

                if (!educationData || !educationData.education_level ||
                    !educationData.faculty || !educationData.major_id ||
                    !educationData.institution_name || !educationData.gpa) {

                    Swal.fire({
                        title: 'Perhatian',
                        text: 'Data pendidikan belum lengkap. Lengkapi data pendidikan terlebih dahulu.',
                        icon: 'warning',
                        confirmButtonText: 'Lengkapi Data'
                    }).then(() => {
                        window.location.href = '/candidate/personal-data?redirect_back=/candidate/job/' + job.id;
                    });
                    return;
                }
            } catch (educationError) {
                console.error("Error checking education:", educationError);
                // Lanjutkan proses apply, server akan melakukan validasi
            }

            // If education data is complete, proceed with application
            const response = await axios.post(`/candidate/jobs/${job.id}/apply`, {}, { headers });

            if (response.data.success) {
                Swal.fire({
                    title: 'Sukses!',
                    text: response.data.message || 'Lamaran berhasil dikirim!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Gunakan URL dari server jika tersedia
                    if (response.data.redirect) {
                        window.location.href = response.data.redirect;
                    } else {
                        // Fallback URL yang benar
                        window.location.href = '/candidate/application-history';
                    }
                });
            }
        } catch (error: any) {
            console.error("Apply error:", error);

            // Handle error dari backend
            let errorMsg = 'Terjadi kesalahan saat apply';
            let redirectUrl = null;

            if (error.response && error.response.data) {
                errorMsg = error.response.data.message || errorMsg;
                redirectUrl = error.response.data.redirect;
            }

            // Ubah kondisi button dan logika redirect
            const isAlreadyApplied = errorMsg === 'Anda sudah pernah melamar pekerjaan ini.';

            Swal.fire({
                title: isAlreadyApplied ? 'Informasi' : 'Perhatian',
                text: errorMsg,
                icon: isAlreadyApplied ? 'info' : 'warning',
                confirmButtonText: isAlreadyApplied ? 'Lihat Riwayat Lamaran' : (redirectUrl ? 'Lengkapi Data' : 'OK')
            }).then((result) => {
                if (result.isConfirmed) {
                    if (isAlreadyApplied) {
                        window.location.href = '/candidate/application-history';
                    } else if (redirectUrl) {
                        const currentUrl = window.location.href;
                        const redirectPath = `${redirectUrl}?redirect_back=${encodeURIComponent(currentUrl)}`;
                        window.location.href = redirectPath;
                    }
                }
            });
        }
    };

    return (
        <>
            <Header />
            <PageWrapper>
                <HeroSection>
                    <JobTitle>{job?.title}</JobTitle>
                    <CompanyTitle>{job?.company?.name}</CompanyTitle>
                </HeroSection>
                <ContentContainer>
                    {/* Tampilkan peringatan kesesuaian jurusan */}
                    {userMajor === null ? (
                        <MajorWarning>
                            <WarningIcon>⚠️</WarningIcon>
                            <div>
                                <strong>Data jurusan belum lengkap!</strong> Mohon lengkapi data pendidikan Anda terlebih dahulu
                                untuk dapat melamar lowongan ini.
                            </div>
                        </MajorWarning>
                    ) : isMajorMatched ? (
                        <MajorMatch>
                            <MatchIcon>✓</MatchIcon>
                            <div>
                                <strong>Jurusan Anda cocok!</strong> Lowongan ini membutuhkan jurusan {job?.major_name}
                                yang sesuai dengan jurusan Anda.
                            </div>
                        </MajorMatch>
                    ) : (
                        <MajorWarning>
                            <WarningIcon>⚠️</WarningIcon>
                            <div>
                                <strong>Jurusan tidak sesuai!</strong> Lowongan ini membutuhkan jurusan {job?.major_name}
                                yang tidak sesuai dengan jurusan Anda.
                            </div>
                        </MajorWarning>
                    )}

                    <InfoSection>
                        <SectionHeading>Job Description</SectionHeading>
                        <JobDescription>{job?.job_description}</JobDescription>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Requirements</SectionHeading>
                        <List>
                            {job?.requirements?.map((requirement, index) => (
                                <ListItem key={index}>{requirement}</ListItem>
                            ))}
                        </List>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Benefits</SectionHeading>
                        <List>
                            {job?.benefits?.map((benefit, index) => (
                                <ListItem key={index}>{benefit}</ListItem>
                            ))}
                        </List>
                    </InfoSection>

                    {/* Button Apply dengan kondisi */}
                    <ApplyButton
                        onClick={handleApply}
                        disabled={!isMajorMatched}
                        style={{
                            backgroundColor: !isMajorMatched ? '#cccccc' : '#1a73e8',
                            cursor: !isMajorMatched ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {!isMajorMatched ? 'Tidak Dapat Apply (Jurusan Tidak Sesuai)' : 'Apply'}
                    </ApplyButton>
                </ContentContainer>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default JobDetailPage;
