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

const TeamImageWrapper = styled.div`
  width: 100%;
  height: 500px; // Changed from 300px
  position: relative;
  margin-bottom: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
`;

const TeamImage = styled.div`
  width: 100%;
  height: 500px; // Changed from 300px to match wrapper
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  color: #1DA1F2;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Underline = styled.div`
  width: 80px;
  height: 4px;
  background: #1DA1F2;
  border-radius: 2px;
  margin-bottom: 32px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

interface FilterButtonProps {
  active?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  background: ${(props) => (props.active ? '#1DA1F2' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#1DA1F2')};
  border: 1px solid #1DA1F2;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? '#1A91DA' : '#E5F1FB')};
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

const JobHiring: React.FC<Props> = ({ jobs, companies }) => {
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
          <TeamImageWrapper>
            <TeamImage>
              <img src="/images/team-celebration.png" alt="Team celebration" />
            </TeamImage>
          </TeamImageWrapper>
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
              {companies.map((company) => (
                <FilterButton
                  key={company}
                  active={activeFilter === company}
                  onClick={() => filterJobs(company)}
                >
                  {company}
                </FilterButton>
              ))}
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
