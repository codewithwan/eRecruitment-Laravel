import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

const GlobalStyle = createGlobalStyle`
  body {
    background: #fff !important;
  }
`;

interface Job {
  id: number;
  title: string;
  company: {
    name: string;
  };
  description: string;
  location: string;
  type: string;
  deadline: string;
  department: string;
}

interface Props {
  jobs: Job[];
  companies: string[];
}

const PageWrapper = styled.div`
  background: #fff;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const JobHiringContainer = styled.div`
  margin: 0 auto;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/images/team-celebration.png') center/cover no-repeat;
`;

const HeroContent = styled.div`
  color: white;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  color: #0088FF;  // Changed to match the image
  font-size: 32px;
  font-weight: 600;
  text-align: left;  // Added to center the title
  margin: 40px 0 16px;  // Adjusted margins
`;

const Underline = styled.div`
  width: 80px;
  height: 4px;
  background: #0088FF;  // Changed to match the image
  border-radius: 2px;
  margin: 0 0 32px;  // Centered the underline
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;  // Center the filter buttons
  gap: 12px;
  margin-bottom: 24px;
`;

interface FilterButtonProps {
  active?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  background: ${(props) => (props.active ? '#0088FF' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#0088FF')};
  border: 1px solid #0088FF;
  border-radius: 20px;
  padding: 8px 20px;  // Adjusted padding
  font-size: 14px;
  font-weight: 500;  // Adjusted weight
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;  // Prevent text wrapping

  &:hover {
    background: ${(props) => (props.active ? '#0077E6' : '#E6F4FF')};
  }
`;

const JobCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #e5e7eb;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: #222;
`;

const Company = styled.p`
  margin: 0 0 12px 0;
  color: #222;
  font-weight: 700;
  font-size: 15px;
`;

const Description = styled.p`
  margin: 0 0 18px 0;
  color: #555;
  font-size: 15px;
`;

const JobDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: #657786;
  font-size: 15px;
  margin-bottom: 0;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const DetailButton = styled.button`
  background: #1DA1F2;
  color: #fff;
  border: none;
  padding: 10px 28px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  margin-left: 32px;
  transition: background 0.2s;

  &:hover {
    background: #1a91da;
  }
`;

const JobHiring: React.FC<Props> = ({ jobs }) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [filteredJobs, setFilteredJobs] = React.useState(jobs);

  const filterJobs = React.useCallback((company: string) => {
    setActiveFilter(company);

    // Update URL with company filter
    const url = new URL(window.location.href);
    if (company === 'all') {
      url.searchParams.delete('company');
    } else {
      url.searchParams.set('company', company);
    }
    window.history.pushState({}, '', url.toString());

    // Filter jobs
    if (company === 'all') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => job.company.name === company);
      setFilteredJobs(filtered);
    }
  }, [jobs]);

  // Add effect to handle initial filter from URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyFilter = urlParams.get('company');
    if (companyFilter) {
      filterJobs(companyFilter);
    }
  }, [filterJobs]);

  return (
    <>
      <GlobalStyle />
      <Header />
      <PageWrapper>
        <JobHiringContainer>
          <HeroSection>
            <HeroContent>
              <HeroTitle>Bergabunglah Bersama Kami</HeroTitle>
              <HeroSubtitle>
                Telusuri berbagai peluang karir dan berkembang bersama PT Mitra Karya Analitika
              </HeroSubtitle>
            </HeroContent>
          </HeroSection>
          <ContentContainer>
            <Title>Open Positions</Title>
            <Underline />
            <FilterContainer>
              <FilterButton
                active={activeFilter === 'all'}
                onClick={() => filterJobs('all')}
              >
                View All
              </FilterButton>
              <FilterButton
                active={activeFilter === 'PT MITRA KARYA ANALITIKA'}
                onClick={() => filterJobs('PT MITRA KARYA ANALITIKA')}
              >
                PT MITRA KARYA ANALITIKA
              </FilterButton>
              <FilterButton
                active={activeFilter === 'PT AUTENTIK KARYA ANALITIKA'}
                onClick={() => filterJobs('PT AUTENTIK KARYA ANALITIKA')}
              >
                PT AUTENTIK KARYA ANALITIKA
              </FilterButton>
            </FilterContainer>
            {filteredJobs.map((job) => (
              <JobCard key={job.id}>
                <JobInfo>
                  <JobTitle>{job.title}</JobTitle>
                  <Company>{job.company.name}</Company>
                  <Description>{job.description}</Description>
                  <JobDetails>
                    <span>🏢 {job.location}</span>
                    <span>🕒 {job.type}</span>
                    <span>📅 {job.deadline}</span>
                    <span>👥 {job.department}</span>
                  </JobDetails>
                </JobInfo>
                <DetailButton>Lihat Detail</DetailButton>
              </JobCard>
            ))}
          </ContentContainer>
        </JobHiringContainer>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default JobHiring;
