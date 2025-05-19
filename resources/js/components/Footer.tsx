import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: #f6fafe;
  padding: 64px 0 0 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding: 0 24px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FooterCol = styled.div`
  font-size: 14px;
  color: #334155;
`;

const FooterTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const FooterDesc = styled.p`
  color: #334155;
  font-size: 14px;
  margin-bottom: 24px;
`;

const FooterSocial = styled.div`
  display: flex;
  gap: 18px;
  font-size: 22px;
  color: #2563eb;
  margin-bottom: 8px;
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 6px;
  font-size: 14px;
  color: #334155;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #334155;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
`;

const ContactIcon = styled.i`
  color: #2563eb;
  font-size: 18px;
  margin-top: 2px;
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    <FooterContent>
      {/* Kolom 1 */}
      <FooterCol>
        <FooterTitle>MITRA KARYA GROUP</FooterTitle>
        <FooterDesc>
          Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan pelanggan
        </FooterDesc>
        <FooterSocial>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-x" /></a>
          <a href="#"><i className="fab fa-linkedin-in" /></a>
          <a href="#"><i className="fab fa-youtube" /></a>
          <a href="#"><i className="fab fa-whatsapp" /></a>
        </FooterSocial>
      </FooterCol>
      {/* Kolom 2 */}
      <FooterCol>
        <FooterTitle>Perusahaan Kami</FooterTitle>
        <FooterList>
          <FooterListItem>PT MITRA KARYA ANALITIKA</FooterListItem>
          <FooterListItem>PT AUTENTIK KARYA ANALITIKA</FooterListItem>
        </FooterList>
      </FooterCol>
      {/* Kolom 3 */}
      <FooterCol>
        <FooterTitle>Contact</FooterTitle>
        <ContactList>
          <ContactItem>
            <ContactIcon className="fas fa-phone" />
            <div>
              Rudy Alfiansyah: 082137384029
              <br />
              Deden Dermawan: 081807700111
            </div>
          </ContactItem>
          <ContactItem>
            <ContactIcon className="fas fa-envelope" />
            <span>autentik.info@gmail.com</span>
          </ContactItem>
          <ContactItem>
            <ContactIcon className="fas fa-map-marker-alt" />
            <span>
              Jl. Klipang Ruko Amsterdam No.9E, Sendangmulyo,
              <br />
              Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
            </span>
          </ContactItem>
        </ContactList>
      </FooterCol>
    </FooterContent>
  </FooterWrapper>
);

export default Footer;
