import { Link } from '@inertiajs/react';
import { format, isValid, parseISO } from 'date-fns';
import id from 'date-fns/locale/id'; // Tambahkan locale indonesia
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

// Style components
const GlobalStyle = createGlobalStyle`
  body {
    background: #fff !important;
  }

  h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
  }
`;

const PageWrapper = styled.div`
    padding: 40px 0;
    min-height: 80vh;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 1250px) {
        max-width: 95%;
    }

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

const PageTitleWrapper = styled.div`
    width: 100%;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const PageTitle = styled.h1`
    font-size: clamp(1.5rem, 5vw, 2rem);
    color: #000000; /* Ubah warna teks menjadi hitam */
    font-weight: 700; /* Tambah ketebalan font */
    margin: 0;
    padding: 0;
`;

const AppTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
`;

const TableHead = styled.thead`
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;

    th {
        padding: 12px 15px;
        text-align: left;
        font-weight: bold;
        color: #000000; /* Ubah warna teks header menjadi hitam */
    }
`;

const TableBody = styled.tbody`
    tr:nth-child(even) {
        background-color: #f8f9fa;
    }

    tr:hover {
        background-color: #f1f1f1;
    }

    td {
        padding: 12px 15px;
        border-bottom: 1px solid #dee2e6;
        color: #000000; /* Ubah warna teks menjadi hitam */
        font-weight: 500; /* Tambahkan font weight agar lebih terlihat */
    }

    .status-badge-cell {
        cursor: default; /* Override cursor untuk cell status */
        pointer-events: auto; /* Tetap menangkap event tapi akan di-cancel */
    }
`;

const StatusBadge = styled.span<{ color: string }>`
    display: inline-block;
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: ${props => props.color || '#6c757d'};
    color: white;
    text-align: center;
    min-width: 100px;
    cursor: default; /* Set cursor default untuk menunjukkan tidak bisa diklik */
    pointer-events: none; /* Mencegah interaksi mouse */
    user-select: none; /* Mencegah seleksi teks */
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 50px 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin: 30px 0;

    h3 {
        color: #000000; /* Ubah warna teks menjadi hitam */
        font-weight: 600;
    }

    p {
        color: #000000; /* Ubah warna teks menjadi hitam */
        font-weight: 500;
    }
`;

const EmptyStateIcon = styled.div`
    font-size: 5rem;
    margin-bottom: 20px;
    color: #6c757d;
`;

const ApplyLink = styled(Link)`
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #1a73e8;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 500;

    &:hover {
        background-color: #1557b0;
        color: white;
    }
`;

const ErrorBanner = styled.div`
    padding: 15px;
    margin: 20px 0;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 8px;
    border-left: 5px solid #f5c6cb;
`;

// Function helper untuk format tanggal
const formatDate = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        if (isValid(date)) {
            return format(date, 'dd MMM yyyy', { locale: id });
        }
        return dateString;
    } catch (error) {
        return dateString;
    }
};

interface Application {
    id: number;
    status_id: number;
    status_name: string;
    status_color: string;
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        type: string;
    };
    applied_at: string;
    updated_at: string;
}

interface ApplicationHistoryProps {
    applications: Application[];
    error?: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applications = [], error = '' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [applicationList, setApplicationList] = useState<Application[]>(applications);
    const [errorMessage, setErrorMessage] = useState(error);

    // Hapus useEffect dengan router.reload()

    // Fungsi refresh data yang lebih aman
    const refreshData = () => {
        setIsLoading(true);

        // Gunakan fetch yang lebih sederhana
        fetch(window.location.href)
            .then(response => response.text())
            .then(html => {
                // Halaman di-reload tanpa menggunakan router.reload()
                window.location.reload();
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error refreshing data:', error);
                setIsLoading(false);
                setErrorMessage('Gagal memuat data. Silakan coba lagi.');
            });
    };

    // State untuk modal detail
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Handling detail view
    const showApplicationDetail = (app: Application) => {
        setSelectedApplication(app);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedApplication(null);
    };

    return (
        <>
            <GlobalStyle />
            <Header />
            <PageWrapper>
                <ContentContainer>
                    <PageTitleWrapper>
                        <PageTitle style={{ marginTop: '80px' }}>Riwayat Lamaran</PageTitle>
                    </PageTitleWrapper>

                    <RefreshButton onClick={refreshData} disabled={isLoading}>
                        {isLoading && <LoadingSpinner />}
                        {isLoading ? 'Memuat...' : 'Refresh Data'}
                    </RefreshButton>

                    {errorMessage && (
                        <ErrorBanner>
                            <strong>Error:</strong> {errorMessage}
                        </ErrorBanner>
                    )}

                    {applicationList && applicationList.length > 0 ? (
                        <AppTable>
                            <TableHead>
                                <tr>
                                    <th>Posisi</th>
                                    <th>Perusahaan</th>
                                    <th>Lokasi</th>
                                    <th>Tipe</th>
                                    <th>Tanggal Apply</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {applicationList.map((app) => (
                                    <tr key={app.id} onClick={(e) => {
                                        // Periksa apakah klik terjadi pada StatusBadge atau parent-nya
                                        if ((e.target as HTMLElement).closest('.status-badge-cell') ||
                                            (e.target as HTMLElement).tagName === 'BUTTON') {
                                            e.stopPropagation(); // Hentikan propagasi jika klik pada cell status
                                            return;
                                        }
                                        showApplicationDetail(app);
                                    }} style={{ cursor: 'pointer' }}>
                                        <td>{app.job.title}</td>
                                        <td>{app.job.company}</td>
                                        <td>{app.job.location}</td>
                                        <td>{app.job.type}</td>
                                        <td>{formatDate(app.applied_at)}</td>
                                        <td className="status-badge-cell" onClick={(e) => e.stopPropagation()}>
                                            <StatusBadge color={app.status_color}>
                                                {app.status_name}
                                            </StatusBadge>
                                        </td>
                                        <td>
                                            <ViewDetailButton onClick={(e) => {
                                                e.stopPropagation();
                                                showApplicationDetail(app);
                                            }}>Detail</ViewDetailButton>
                                        </td>
                                    </tr>
                                ))}
                            </TableBody>
                        </AppTable>
                    ) : (
                        <EmptyState>
                            <EmptyStateIcon>📋</EmptyStateIcon>
                            <h3>Belum Ada Lamaran</h3>
                            <p>Anda belum pernah mengajukan lamaran pekerjaan.</p>
                            <ApplyLink href="/candidate/jobs">Cari Lowongan</ApplyLink>
                        </EmptyState>
                    )}

                    {/* Tambahkan modal detail */}
                    {showDetail && selectedApplication && (
                        <DetailModal>
                            <ModalContent>
                                <ModalHeader>
                                    <h3>Detail Lamaran</h3>
                                    <CloseButton onClick={closeDetail}>&times;</CloseButton>
                                </ModalHeader>
                                <ModalBody>
                                    <DetailItem>
                                        <DetailLabel>Posisi:</DetailLabel>
                                        <DetailValue>{selectedApplication.job.title}</DetailValue>
                                    </DetailItem>
                                    <DetailItem>
                                        <DetailLabel>Perusahaan:</DetailLabel>
                                        <DetailValue>{selectedApplication.job.company}</DetailValue>
                                    </DetailItem>
                                    <DetailItem>
                                        <DetailLabel>Lokasi:</DetailLabel>
                                        <DetailValue>{selectedApplication.job.location}</DetailValue>
                                    </DetailItem>
                                    <DetailItem>
                                        <DetailLabel>Tipe:</DetailLabel>
                                        <DetailValue>{selectedApplication.job.type}</DetailValue>
                                    </DetailItem>
                                    <DetailItem>
                                        <DetailLabel>Tanggal Apply:</DetailLabel>
                                        <DetailValue>{selectedApplication.applied_at}</DetailValue>
                                    </DetailItem>
                                    <DetailItem>
                                        <DetailLabel>Status:</DetailLabel>
                                        <DetailValue>
                                            <StatusBadge color={selectedApplication.status_color}>
                                                {selectedApplication.status_name}
                                            </StatusBadge>
                                        </DetailValue>
                                    </DetailItem>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={closeDetail}>Tutup</Button>
                                </ModalFooter>
                            </ModalContent>
                        </DetailModal>
                    )}
                </ContentContainer>
            </PageWrapper>
            <Footer />
        </>
    );
};

// Tambahkan style untuk RefreshButton
const RefreshButton = styled.button<{ disabled: boolean }>`
    background-color: ${props => props.disabled ? '#cccccc' : '#1a73e8'};
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${props => props.disabled ? '#cccccc' : '#1557b0'};
    }
`;

// Tambahkan component loading spinner
const LoadingSpinner = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 3px solid white;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Tambahkan style untuk components
const ViewDetailButton = styled.button`
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #1557b0;
    }
`;

const DetailModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
`;

const ModalHeader = styled.div`
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalBody = styled.div`
    padding: 15px;
`;

const ModalFooter = styled.div`
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #dee2e6;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #495057;

    &:hover {
        color: #0088FF;
    }
`;

const DetailItem = styled.div`
    margin-bottom: 10px;
`;

const DetailLabel = styled.span`
    font-weight: bold;
    color: #495057;
`;

const DetailValue = styled.span`
    margin-left: 5px;
    color: #343a40;
`;

// Tambahkan definisi Button
const Button = styled.button`
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background-color: #1557b0;
    }
`;

export default ApplicationHistory;
