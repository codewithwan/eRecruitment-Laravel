import React from 'react';
import styled from 'styled-components';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

interface JobDetailProps {
    title: string;
    company: string;
    job_description: string;
    requirements: string[];
    benefits: string[];
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

const dummyJob: JobDetailProps = {
    title: 'Frontend Developer',
    company: 'PT. Teknologi Indonesia',
    job_description: 'Bertanggung jawab untuk mengembangkan dan memelihara tampilan website perusahaan.',
    requirements: [
        'Menguasai React.js dan JavaScript',
        'Pengalaman minimal 1 tahun di bidang terkait',
        'Mampu bekerja dalam tim',
        'Memahami konsep REST API'
    ],
    benefits: [
        'Gaji kompetitif',
        'Asuransi kesehatan',
        'Waktu kerja fleksibel',
        'Tunjangan transportasi'
    ]
};

const JobDetailPage: React.FC = () => {
    const job = dummyJob;

    const handleApply = async () => {
        alert('Fitur apply belum tersedia pada mode dummy.');
    };

    return (
        <>
            <Header />
            <PageWrapper>
                <HeroSection>
                    <JobTitle>{job.title}</JobTitle>
                    <CompanyTitle>{job.company}</CompanyTitle>
                </HeroSection>
                <ContentContainer>
                    <InfoSection>
                        <SectionHeading>Job Description</SectionHeading>
                        <JobDescription>{job.job_description}</JobDescription>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Requirements</SectionHeading>
                        <List>
                            {job.requirements?.map((requirement, index) => (
                                <ListItem key={index}>{requirement}</ListItem>
                            ))}
                        </List>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Benefits</SectionHeading>
                        <List>
                            {job.benefits?.map((benefit, index) => (
                                <ListItem key={index}>{benefit}</ListItem>
                            ))}
                        </List>
                    </InfoSection>
                    <ApplyButton onClick={handleApply}>Apply</ApplyButton>
                </ContentContainer>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default JobDetailPage;
