import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';


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
  background: ${(props) => (props.active ? '#1DA1F2' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#1DA1F2')};
  border: 1px solid #1DA1F2;
  border-radius: 20px;
  padding: 8px 20px;  // Adjusted padding
  font-size: 14px;
  font-weight: 500;  // Adjusted weight
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;  // Prevent text wrapping

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

const JobHiring: React.FC<Props> = ({ jobs }) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [filteredJobs, setFilteredJobs] = React.useState(jobs);
  const { auth } = usePage<SharedData>().props;
  

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
      {/* Navbar */}
      <header className="fixed top-0 right-0 left-0 z-50 h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>
                        

                        <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex text-gray-800">
                          <Link href="/" className="hover:text-blue-600">Beranda</Link>
                          <Link href="/job-hiring-landing-page" className="hover:text-blue-600">Lowongan Pekerjaan</Link>
                          <Link href="/about-us" className="hover:text-blue-600">Tentang Kami</Link>
                          <Link href="/contact" className="hover:text-blue-600">Kontak</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md border border-blue-600 px-[16px] py-[10px] text-[14px] font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium text-blue-600 hover:underline">Masuk</Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-[16px] py-[10px] text-[14px] text-white hover:bg-blue-700"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>
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
      {/* Footer */}
      <footer className="bg-[#f6fafe] py-16">
                    <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-3">
                        {/* Kolom 1 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold text-gray-800">MITRA KARYA GROUP</h4>
                            <p className="mb-6 text-sm text-gray-700">
                                Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan
                                pelanggan
                            </p>
                            <div className="flex space-x-4 text-xl text-blue-600">
                                <a href="#">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-x"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        {/* Kolom 2 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold text-gray-800">Perusahaan Kami</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>PT MITRA KARYA ANALITIKA</li>
                                <li>PT AUTENTIK KARYA ANALITIKA</li>
                            </ul>
                        </div>

                        {/* Kolom 3 */}
                        <div>
                            <h4 className="mb-4 text-[16px] font-bold text-gray-800">Contact</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-phone mt-1 text-blue-600" />
                                    <div>
                                        Rudy Alfiansyah: 082137384029
                                        <br />
                                        Deden Dermawan: 081807700111
                                    </div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-envelope text-blue-600" />
                                    <span>autentik.info@gmail.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-map-marker-alt mt-1 text-blue-600" />
                                    <span>
                                        Jl. Klipang Ruko Amsterdam No.9E, Sendangmulyo,
                                        <br />
                                        Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
    </>
  );
};

export default JobHiring;
