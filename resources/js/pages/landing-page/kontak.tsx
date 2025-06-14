import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import styled from 'styled-components';

export default function JobHiringPage() {
  const { auth } = usePage<SharedData>().props;

  const PageWrapper = styled.div`
    background: #fff;
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 40px;
  `;

  const Title = styled.h2`
    color: #1DA1F2;
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 8px;
    text-align: center;
  `;

  const Subtitle = styled.p`
    color: #666;
    font-size: 14px;
    text-align: center;
    margin-bottom: 32px;
  `;

  const ContactContainer = styled.div`
    max-width: 960px;
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;
    text-align: center;
  `;

  const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: nowrap;
    margin-top: 40px;
  `;

  const Card = styled.div`
    border: 1px solid #1DA1F2;
    border-radius: 8px;
    padding: 24px;
    width: 300px;
    height: 312px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;

  const CardIconWrapper = styled.div`
    border: 1px solid #1DA1F2;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 20px;
    color: #1DA1F2;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const CardTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
  `;

  const CardText = styled.p`
    font-size: 14px;
    color: #555;
    margin: 0 0 4px 0;
  `;

  const LinkText = styled.a`
    font-size: 14px;
    color: #1DA1F2;
    text-decoration: underline;
    cursor: pointer;
  `;

  const IconImage = styled.img`
  width:40px;
  height: 40px;
`;

  return (
    <>
      <Head title="Lowongan" />
      <div className="min-h-screen bg-white text-gray-900">
        <header className="fixed top-0 right-0 left-0 z-50 h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>
            <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex">
              <Link href="/" className="hover:text-blue-600">Beranda</Link>
              <Link href="/job-hiring-landing-page" className="hover:text-blue-600">Lowongan Pekerjaan</Link>
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
          <ContactContainer>
            <Title>Hubungi Kami</Title>
            <Subtitle>Let us know how we can help.</Subtitle>
            <CardContainer>
              <Card>
                <CardIconWrapper>
                  <IconImage src="/images/chat-to-support.png" alt="Chat Icon" />
                </CardIconWrapper>
                <CardTitle>Chat to support</CardTitle>
                <CardText>we’re here to help</CardText>
                <LinkText href="mailto:autentik.info@gmail.com">autentik.info@gmail.com</LinkText>
              </Card>
              <Card>
                <CardIconWrapper>
                  <IconImage src="/images/visit-us.png" alt="Location Icon" />
                </CardIconWrapper>
                <CardTitle>Visit us</CardTitle>
                <CardText>Visit our office</CardText>
                <LinkText href="https://maps.google.com" target="_blank">View on Google Maps</LinkText>
              </Card>
              <Card>
                <CardIconWrapper>
                  <IconImage src="/images/call-us.png" alt="Phone Icon" />
                </CardIconWrapper>
                <CardTitle>Call us</CardTitle>
                <CardText>Mon-Fri from 8am to 5pm</CardText>
                <LinkText href="tel:+6281807700111">+62 81-807-700-111</LinkText>
              </Card>
            </CardContainer>
          </ContactContainer>
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
