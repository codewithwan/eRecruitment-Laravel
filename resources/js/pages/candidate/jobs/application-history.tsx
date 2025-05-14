import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

const GlobalStyle = createGlobalStyle`
  body {
    background: #fff !important;
  }
`;

const PageWrapper = styled.div`
  background: #fff;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const ApplicationHistoryContainer = styled.div`
  padding: 40px 0;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #1DA1F2;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.p`
  text-align: center;
  color: #657786;
  margin-bottom: 32px;
  font-size: 15px;
`;

const ApplicationCard = styled.div<{ status: string }>`
  background: ${(props) => (props.status === 'rejected' ? '#f3f4f6' : '#fff')};
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const JobTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const JobTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #111;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 14px;
  background: ${(props) => {
    if (props.status === 'rejected') return '#ff4444';
    if (props.status === 'department') return '#e8f2ff';
    return '#e8f2ff';
  }};
  color: ${(props) => {
    if (props.status === 'rejected') return '#fff';
    if (props.status === 'department') return '#1DA1F2';
    return '#1DA1F2';
  }};
`;

const Company = styled.div`
  margin: 0 0 8px 0;
  color: #111;
  font-weight: 600;
  font-size: 14px;
`;

const JobDescription = styled.p`
  margin: 0 0 16px 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
`;

const JobDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  color: #4b5563;
  font-size: 14px;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const DetailIcon = styled.span`
  color: #1DA1F2;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
`;

const ActionButton = styled.button<{ status: string }>`
  background: #1DA1F2;
  color: #fff;
  border: none;
  padding: 6px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
`;

const ApplicationHistory: React.FC = () => {
  const applications = [
    {
      title: 'Hardware Engineer',
      company: 'PT AUTENTIKA KARYA ANALITIKA',
      description: 'Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
      status: 'pending',
    },
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description: 'Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
      status: 'rejected',
    },
  ];

  return (
    <>
      <GlobalStyle />
      <Header />
      <PageWrapper>
        <ApplicationHistoryContainer>
          <Title>Riwayat Lamaran</Title>
          <Description>
            Berikut adalah riwayat lamaran pekerjaan yang telah Anda apply sebelumnya
          </Description>
          {applications.map((application, index) => (
            <ApplicationCard key={index} status={application.status}>
              <JobHeader>
                <JobTitleSection>
                  <JobTitle>{application.title}</JobTitle>
                  <StatusBadge status="department">
                    Department
                  </StatusBadge>
                </JobTitleSection>
                {application.status === 'rejected' ? (
                  <StatusBadge status={application.status}>
                    Tidak Lolos
                  </StatusBadge>
                ) : (
                  <ActionButton status={application.status}>
                    Lihat Detail
                  </ActionButton>
                )}
              </JobHeader>
              <Company>{application.company}</Company>
              <JobDescription>{application.description}</JobDescription>
              <JobDetails>
                <span>
                  <DetailIcon>
                    <i className="fa-solid fa-building" style={{ fontSize: 14 }} />
                  </DetailIcon>
                  Office
                </span>
                <span>
                  <DetailIcon>
                    <i className="fa-solid fa-clock" style={{ fontSize: 14 }} />
                  </DetailIcon>
                  Full Time
                </span>
                <span>
                  <DetailIcon>
                    <i className="fa-solid fa-calendar" style={{ fontSize: 14 }} />
                  </DetailIcon>
                  Lamar Sebelum 25 Maret
                </span>
              </JobDetails>
            </ApplicationCard>
          ))}
        </ApplicationHistoryContainer>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default ApplicationHistory;
