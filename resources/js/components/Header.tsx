import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
  color: #111;
  margin-left: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const NavLink = styled.a`
  color: #222;
  font-size: 13px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0 4px;
  &:hover {
    color: #1DA1F2;
  }
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1DA1F2;
  font-size: 24px;
  border: 2px solid #1DA1F2;
`;

const Header: React.FC = () => (
  <HeaderWrapper>
    <HeaderContent>
      <Logo>MITRA KARYA GROUP</Logo>
      <Nav>
        <NavLink href="#">Dasbor</NavLink>
        <NavLink href="/candidate/profile">Profil</NavLink>
        <NavLink href="#">Lowongan Pekerjaan</NavLink>
        <NavLink href="#">Lamaran</NavLink>
      </Nav>
      <ProfileIcon>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="white" stroke="#1DA1F2" strokeWidth="2"/>
          <circle cx="12" cy="10" r="4" fill="#1DA1F2"/>
          <rect x="6" y="16" width="12" height="4" rx="2" fill="#1DA1F2"/>
        </svg>
      </ProfileIcon>
    </HeaderContent>
  </HeaderWrapper>
);

export default Header;
