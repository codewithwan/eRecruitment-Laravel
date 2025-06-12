import { router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
  description?: string;
  location: string;
  type: string | { name: string };
  deadline?: string;
  department: string | { name: string };
}

interface Recommendation {
  vacancy: Job;
  score: number;
}

interface Props {
  jobs?: Job[];
  recommendations?: Recommendation[];
  companies?: string[];
  candidateMajor?: string;
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
  color: #0088FF;
  font-size: 32px;
  font-weight: 600;
  text-align: left;
  margin: 40px 0 16px;
`;

const Underline = styled.div`
  width: 80px;
  height: 4px;
  background: #0088FF;
  border-radius: 2px;
  margin: 0 0 32px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 24px;
`;

interface FilterButtonProps {
  $active?: boolean; // Gunakan $ prefix untuk transient prop
}

const FilterButton = styled.button<FilterButtonProps>`
  background: ${(props) => (props.$active ? '#0088FF' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#0088FF')};
  border: 1px solid #0088FF;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? '#0077E6' : '#E6F4FF')};
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

const JobHiring: React.FC<Props> = ({ jobs = [], recommendations: initialRecommendations = [], companies = [], candidateMajor }) => {
  const [recommendations] = useState<Recommendation[]>(initialRecommendations || []);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs || []);

  useEffect(() => {
    // Set CSRF token for all AJAX requests
    const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredJobs(jobs || []);
    } else {
      setFilteredJobs((jobs || []).filter(job => job?.company?.name === activeFilter));
    }
  }, [activeFilter, jobs]);

  const filterJobs = (filter: string) => {
    setActiveFilter(filter);
  };

  // Function untuk navigasi dengan CSRF yang aman
  const navigateToJobDetail = (jobId: number) => {
    // Pastikan token CSRF tersedia sebelum navigasi
    const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }

    router.visit(`/candidate/job/${jobId}`);
  };

  // Hilangkan duplikat nama perusahaan
  const uniqueCompanies = Array.from(new Set(companies || []));

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
            {/* Rekomendasi Section */}
            <Title>Rekomendasi Pekerjaan Untuk Anda</Title>
            <Underline />
            {candidateMajor && (
              <Description>
                Berdasarkan jurusan Anda: <b>{candidateMajor}</b>
              </Description>
            )}
            {(recommendations || []).length === 0 ? (
              <JobCard>
                <JobInfo>
                  <JobTitle>Tidak ada rekomendasi yang cocok.</JobTitle>
                  <Description>
                    Belum ada lowongan yang sesuai dengan jurusan Anda saat ini.
                  </Description>
                </JobInfo>
              </JobCard>
            ) : (
              recommendations.map(({ vacancy, score }) => (
                <JobCard key={vacancy.id}>
                  <JobInfo>
                    <JobTitle>{vacancy.title}</JobTitle>
                    <Company>{vacancy.company?.name || 'Unknown Company'}</Company>
                    <Description>{vacancy.description || 'No description available'}</Description>
                    <JobDetails>
                      <span>🏢 {vacancy.location || 'No location'}</span>
                      <span>🕒 {typeof vacancy.type === 'object' ? vacancy.type?.name : vacancy.type}</span>
                      <span>📅 {vacancy.deadline || 'Open'}</span>
                      <span>👥 {typeof vacancy.department === 'object' ? vacancy.department?.name : vacancy.department}</span>
                      <span>⭐ Score: {score}</span>
                    </JobDetails>
                  </JobInfo>
                  <DetailButton onClick={() => navigateToJobDetail(vacancy.id)}>
                    Lihat Detail
                  </DetailButton>
                </JobCard>
              ))
            )}

            {/* Semua Lowongan Section */}
            <Title>Open Positions</Title>
            <Underline />
            <FilterContainer>
              {/* PERBAIKAN: Gunakan $active sebagai pengganti active */}
              <FilterButton
                $active={activeFilter === 'all'}
                onClick={() => filterJobs('all')}
              >
                View All
              </FilterButton>
              {uniqueCompanies.map((company) => (
                <FilterButton
                  key={company}
                  $active={activeFilter === company}
                  onClick={() => filterJobs(company)}
                >
                  {company}
                </FilterButton>
              ))}
            </FilterContainer>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard key={job.id}>
                  <JobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <Company>{job.company?.name || 'Unknown Company'}</Company>
                    <Description>{job.description || 'No description available'}</Description>
                    <JobDetails>
                      <span>🏢 {job.location || 'No location'}</span>
                      <span>🕒 {typeof job.type === 'object' ? job.type?.name : job.type}</span>
                      <span>📅 {job.deadline || 'Open'}</span>
                      <span>👥 {typeof job.department === 'object' ? job.department?.name : job.department}</span>
                    </JobDetails>
                  </JobInfo>
                  {/* PERBAIKAN: Gunakan navigateToJobDetail untuk handling navigasi */}
                  <DetailButton onClick={() => navigateToJobDetail(job.id)}>
                    Lihat Detail
                  </DetailButton>
                </JobCard>
              ))
            ) : (
              <JobCard>
                <JobInfo>
                  <JobTitle>Tidak ada lowongan tersedia</JobTitle>
                  <Description>
                    Saat ini tidak ada lowongan pekerjaan yang tersedia.
                  </Description>
                </JobInfo>
              </JobCard>
            )}
          </ContentContainer>
        </JobHiringContainer>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default JobHiring;
