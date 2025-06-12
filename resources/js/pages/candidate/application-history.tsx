import { usePage } from '@inertiajs/react';
import styled, { createGlobalStyle } from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const GlobalStyle = createGlobalStyle`
  body {
    background: #fff !important;
  }
`;

const PageWrapper = styled.div`
    padding: 40px 0;
    min-height: 80vh;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const PageTitle = styled.h1`
    font-size: 28px;
    color: #1a73e8;
    margin-bottom: 30px;
    text-align: center;
`;

const ApplicationsTable = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 16px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    font-weight: bold;
    color: #495057;
`;

const ApplicationRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 16px 24px;
    border-bottom: 1px solid #dee2e6;
    align-items: center;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const CompanyName = styled.span`
    color: #6c757d;
    font-size: 14px;
    display: block;
`;

const JobTitle = styled.span`
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 4px;
    display: block;
`;

const StatusBadge = styled.span<{ color: string }>`
    background-color: ${props => props.color};
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
`;

const JobLocation = styled.div`
    color: #6c757d;
    font-size: 14px;
`;

const JobType = styled.div`
    color: #6c757d;
    font-size: 14px;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    color: #6c757d;
`;

const EmptyStateIcon = styled.div`
    font-size: 40px;
    margin-bottom: 20px;
    color: #dee2e6;
`;

const ApplyLink = styled.a`
    display: inline-block;
    background-color: #1a73e8;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    margin-top: 20px;

    &:hover {
        background-color: #1557b0;
        color: white;
    }
`;

interface Application {
    id: number;
    status_id: number;
    status_name: string;
    status_color: string;
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        type: string;
    };
    applied_at: string;
    updated_at: string;
}

interface ApplicationHistoryProps {
    applications: Application[];
}

const ApplicationHistory = () => {
    const { applications } = usePage<ApplicationHistoryProps>().props;

    return (
        <>
            <GlobalStyle />
            <Header />
            <PageWrapper>
                <ContentContainer>
                    <div style={{ marginTop: '40px' }}>
                        <PageTitle>Riwayat Lamaran</PageTitle>
                    </div>

                    {applications.length > 0 ? (
                        <ApplicationsTable>
                            <TableHeader>
                                <div>Lowongan</div>
                                <div>Lokasi</div>
                                <div>Tipe</div>
                                <div>Tanggal Apply</div>
                                <div>Status</div>
                            </TableHeader>

                            {applications.map((application) => (
                                <ApplicationRow key={application.id}>
                                    <div>
                                        <JobTitle>{application.job.title}</JobTitle>
                                        <CompanyName>{application.job.company}</CompanyName>
                                    </div>
                                    <JobLocation>{application.job.location}</JobLocation>
                                    <JobType>{application.job.type}</JobType>
                                    <div>{application.applied_at}</div>
                                    <div>
                                        <StatusBadge color={application.status_color}>
                                            {application.status_name}
                                        </StatusBadge>
                                    </div>
                                </ApplicationRow>
                            ))}
                        </ApplicationsTable>
                    ) : (
                        <EmptyState>
                            <EmptyStateIcon>📋</EmptyStateIcon>
                            <h3>Belum Ada Lamaran</h3>
                            <p>Anda belum pernah mengajukan lamaran pekerjaan.</p>
                            <ApplyLink href="/job-hiring">Cari Lowongan</ApplyLink>
                        </EmptyState>
                    )}
                </ContentContainer>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default ApplicationHistory;
