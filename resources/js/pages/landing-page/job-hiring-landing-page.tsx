import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import styled from 'styled-components';;

export default function JobHiringPage() {
  const { auth } = usePage<SharedData>().props;

  interface Job {
    title: string;
    company: string;
    description: string;
    location: string;
    type: string;
    deadline: string;
  }

  const PageWrapper = styled.div`
  background: #fff;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const JobHiringContainer = styled.div`
  padding: 40px 0 60px 0;
  max-width: 900px;
  margin: 0 auto;
`;

const TeamImage = styled.div`
  width: 100%;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
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
  background: ${({ active }: FilterButtonProps) => (active ? '#1DA1F2' : '#fff')};
  color: ${({ active }: FilterButtonProps) => (active ? '#fff' : '#1DA1F2')};
  border: 1px solid #1DA1F2;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ active }: FilterButtonProps) => (active ? '#1A91DA' : '#E5F1FB')};
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

  const jobs: Job[] = [
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description:
        'Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
    },
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description:
        'Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
    },
  ];

  return (
    <>
      <Head title="Lowongan" />
      <div className="min-h-screen bg-white text-gray-900">
        <header className="fixed top-0 right-0 left-0 z-50 h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>
            <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex">
              <Link href="/" className="hover:text-blue-600">Beranda</Link>
              <Link href="/lowongan" className="hover:text-blue-600">Lowongan Pekerjaan</Link>
              <Link href="/tentang" className="hover:text-blue-600">Tentang Kami</Link>
              <Link href="/kontak" className="hover:text-blue-600">Kontak</Link>
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
          <TeamImage>
            <img src="/images/team-celebration.png" alt="Deskripsi gambar" />
          </TeamImage>
          <Title>Open Positions</Title>
          <Underline />
          <FilterContainer>
            <FilterButton active>View All</FilterButton>
            <FilterButton>PT MITRA KARYA ANALITIKA</FilterButton>
            <FilterButton>PT AUTENTIK KARYA ANALITIKA</FilterButton>
          </FilterContainer>
          {jobs.map((job, index) => (
            <JobCard key={index}>
              <JobInfo>
                <JobTitle>{job.title}</JobTitle>
                <Company>{job.company}</Company>
                <Description>{job.description}</Description>
                <JobDetails>
                  <span>🏢 {job.location}</span>
                  <span>🕒 {job.type}</span>
                  <span>📅 {job.deadline}</span>
                </JobDetails>
              </JobInfo>
              <DetailButton>Lihat Detail</DetailButton>
            </JobCard>
          ))}
        </JobHiringContainer>
      </PageWrapper>
      {/* Footer */}
      <footer className="bg-[#f6fafe] py-16">
                    <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-3">
                        {/* Kolom 1 */}
                        <div>
                            <h4 className="mb-2 text-[16px] font-bold">PT MITRA KAYA ANALITIKA</h4>
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
                            <h4 className="mb-2 text-[16px] font-bold">Perusahaan Kami</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>PT MITRA KARYA ANALITIKA</li>
                                <li>PT AUTENTIK KARYA ANALITIKA</li>
                            </ul>
                        </div>

                        {/* Kolom 3 */}
                        <div>
                            <h4 className="mb-4 text-[16px] font-bold">Contact</h4>
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
      </div>
    </>
  );
}
