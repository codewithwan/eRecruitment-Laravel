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
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-left: 8px;
  color: #111; // warna hitam
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e5f1fb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1DA1F2;
  font-size: 22px;
  margin-right: 8px;
  border: 1.5px solid #e5e7eb;
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
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" fill="#1DA1F2"/>
          <rect x="4" y="16" width="16" height="6" rx="3" fill="#1DA1F2"/>
        </svg>
      </ProfileIcon>
    </HeaderContent>
  </HeaderWrapper>
);

export default Header;
