import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 32px 0 18px 0;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: space-between;
`;

const FooterCol = styled.div`
  flex: 1;
  min-width: 220px;
  font-size: 13px;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FooterTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 15px;
`;

const FooterDesc = styled.div`
  color: #555;
  font-size: 13px;
  margin-bottom: 12px;
  margin-top: 2px;
  max-width: 240px;
`;

const FooterSocial = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 12px;
  font-size: 16px;
  color: #1DA1F2;
  align-items: center;
`;

const FooterSocialLink = styled.a`
  color: #1DA1F2;
  transition: color 0.2s;
  &:hover {
    color: #0d8ddb;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 4px;
  font-size: 13px;
  color: #222;
`;

const FooterContact = styled.div`
  margin-top: 6px;
  color: #222;
  font-size: 13px;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const FooterAddress = styled.div`
  margin-top: 8px;
  color: #222;
  font-size: 13px;
  line-height: 1.7;
  display: flex;
  align-items: flex-start;
  gap: 7px;
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    <FooterContent>
      <FooterCol>
        <FooterTitle>PT MITRA KARYA ANALITIKA</FooterTitle>
        <FooterDesc>
          Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan pelanggan
        </FooterDesc>
        <FooterSocial>
          <FooterSocialLink href="#"><i className="fa-brands fa-x-twitter" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-instagram" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-linkedin" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-youtube" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-whatsapp" /></FooterSocialLink>
        </FooterSocial>
      </FooterCol>
      <FooterCol>
        <FooterTitle>Perusahaan Kami</FooterTitle>
        <FooterList>
          <FooterListItem>PT MITRA KARYA ANALITIKA</FooterListItem>
          <FooterListItem>PT AUTENTIK KARYA ANALITIKA</FooterListItem>
        </FooterList>
      </FooterCol>
      <FooterCol>
        <FooterTitle>Contact</FooterTitle>
        <FooterContact>
          <ContactRow>
            <i className="fa-solid fa-user" style={{ color: '#1DA1F2', fontSize: 14 }} />
            Rudy Alfansyah: 082137384029
          </ContactRow>
          <ContactRow>
            <i className="fa-solid fa-user" style={{ color: '#1DA1F2', fontSize: 14 }} />
            Deeden Ernawan: 081387700111
          </ContactRow>
          <ContactRow>
            <i className="fa-solid fa-envelope" style={{ color: '#1DA1F2', fontSize: 14 }} />
            autentik.info@gmail.com
          </ContactRow>
        </FooterContact>
        <FooterAddress>
          <i className="fa-solid fa-location-dot" style={{ color: '#1DA1F2', fontSize: 14, marginTop: 2 }} />
          <span>
            Jl. Klitren Ruko Amsterdam No.9E, Sendangmulyo,<br />
            Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
          </span>
        </FooterAddress>
      </FooterCol>
    </FooterContent>
  </FooterWrapper>
);

export default Footer;
