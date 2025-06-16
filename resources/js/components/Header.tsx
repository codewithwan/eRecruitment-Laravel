import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0; right: 0; left: 0;
  z-index: 50;
  height: 80px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  height: 100%;
  position: relative;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  flex: 0 0 auto;
`;

const CenterMenu = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  transform: translateX(-50%);
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  font-size: 14px;
  font-weight: 500;
`;

const NavLink = styled(Link)`
  color: #222;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #2563eb;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 auto;
`;

const Button = styled(Link)<{ primary?: boolean }>`
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: ${({ primary }) => (primary ? 'none' : '1px solid #2563eb')};
  background: ${({ primary }) => (primary ? '#2563eb' : 'transparent')};
  color: ${({ primary }) => (primary ? '#fff' : '#2563eb')};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ primary }) => (primary ? '#1d4ed8' : '#eff6ff')};
    color: ${({ primary }) => (primary ? '#fff' : '#2563eb')};
    text-decoration: ${({ primary }) => (primary ? 'none' : 'underline')};
  }
`;

const ProfileIcon = styled(Link)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  }
`;

interface User {
  id: number;
  name: string;
  email: string;
}

const Header: React.FC = () => {
  const { auth } = usePage().props as { auth?: { user?: User } };

  return (
    <HeaderWrapper>
      <Container>
        <Logo>MITRA KARYA GROUP</Logo>
        <CenterMenu>
          <Nav>
            <NavLink href="/">Dasbor</NavLink>
            <NavLink href="/candidate/profile">Profil</NavLink>
            <NavLink href="/candidate/jobs">Lowongan Pekerjaan</NavLink>
            <NavLink href="/candidate/application-history">Lamaran</NavLink>
          </Nav>
        </CenterMenu>
        <Actions>
          {auth?.user ? (
            <ProfileIcon href={route('user.profile') as string}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" fill="#fff" stroke="#2563eb" strokeWidth="2"/>
                <circle cx="12" cy="10" r="4" fill="#2563eb"/>
                <rect x="6" y="16" width="12" height="4" rx="2" fill="#2563eb"/>
              </svg>
            </ProfileIcon>
          ) : (
            <>
              <Button href={route('login') as string} style={{ background: 'none', color: '#2563eb', border: 'none', padding: 0 }}>Masuk</Button>
              <Button href={route('register') as string} primary>Daftar</Button>
            </>
          )}
        </Actions>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
