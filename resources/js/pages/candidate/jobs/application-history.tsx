import React from 'react';
import styled from 'styled-components';

interface Application {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  deadline: string;
  status: string;
}

const ApplicationHistoryContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: #1DA1F2;
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    color: #657786;
    margin-bottom: 20px;
  }
`;

const ApplicationCard = styled.div<{ status: string }>`
  background: ${(props) => (props.status === 'rejected' ? '#f5f5f5' : '#fff')};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  h3 {
    margin: 0 0 10px;
    font-size: 18px;
    display: inline;
  }

  .status {
    display: inline-block;
    margin-left: 10px;
    padding: 5px 10px;
    border-radius: 15px;
    background: ${(props) => (props.status === 'rejected' ? '#ff0000' : '#1DA1F2')};
    color: #fff;
    font-size: 14px;
  }

  p {
    margin: 0 0 10px;
    color: #333;
  }

  strong {
    color: #000;
  }

  .application-details {
    margin: 10px 0;
    color: #657786;
    font-size: 14px;

    span {
      margin-right: 10px;
    }
  }

  button {
    background: ${(props) => (props.status === 'rejected' ? '#ff0000' : '#1DA1F2')};
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;

    &:hover {
      background: ${(props) => (props.status === 'rejected' ? '#cc0000' : '#1a91da')};
    }
  }
`;

const ApplicationHistory: React.FC = () => {
  const applications: Application[] = [
    {
      title: 'Hardware Engineer',
      company: 'PT AUTENTIKA KARYA ANALITIKA',
      description: 'Ahli yang mencurancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
      status: 'pending',
    },
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description: 'Ahli yang mencurancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
      status: 'rejected',
    },
  ];

  return (
    <ApplicationHistoryContainer>
      <h2>Riwayat Lamaran</h2>
      <p>Berikut adalah riwayat lamaran pekerjaan yang telah Anda apply sebelumnya</p>
      {applications.map((application, index) => (
        <ApplicationCard key={index} status={application.status}>
          <h3>{application.title}</h3>
          <span className="status">{application.status === 'rejected' ? 'Tidak Lolos' : 'Departemen'}</span>
          <p><strong>{application.company}</strong></p>
          <p>{application.description}</p>
          <div className="application-details">
            <span>{application.location}</span> • <span>{application.type}</span> • <span>{application.deadline}</span>
          </div>
          <button>{application.status === 'rejected' ? 'Tidak Lolos' : 'Lihat Detail'}</button>
        </ApplicationCard>
      ))}
    </ApplicationHistoryContainer>
  );
};

export default ApplicationHistory;
