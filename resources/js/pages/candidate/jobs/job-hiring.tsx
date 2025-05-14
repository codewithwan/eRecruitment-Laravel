import React from 'react';
import styled from 'styled-components';

interface Job {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  deadline: string;
}

const JobHiringContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: #1DA1F2;
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const JobCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 10px;
    font-size: 18px;
  }

  p {
    margin: 0 0 10px;
    color: #333;
  }

  strong {
    color: #000;
  }

  .job-details {
    margin: 10px 0;
    color: #657786;
    font-size: 14px;

    span {
      margin-right: 10px;
    }
  }

  button {
    background: #1DA1F2;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;

    &:hover {
      background: #1a91da;
    }
  }
`;

const JobHiring: React.FC = () => {
  const jobs: Job[] = [
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description: 'Ahli yang mencurancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
    },
    {
      title: 'Hardware Engineer',
      company: 'PT MITRA KARYA ANALITIKA',
      description: 'Ahli yang mencurancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
      location: 'Office',
      type: 'Full Time',
      deadline: 'Lamar Sebelum 25 Maret',
    },
  ];

  return (
    <JobHiringContainer>
      <h2>Open Positions</h2>
      {jobs.map((job, index) => (
        <JobCard key={index}>
          <h3>{job.title}</h3>
          <p><strong>{job.company}</strong></p>
          <p>{job.description}</p>
          <div className="job-details">
            <span>{job.location}</span> • <span>{job.type}</span> • <span>{job.deadline}</span>
          </div>
          <button>Lihat Detail</button>
        </JobCard>
      ))}
    </JobHiringContainer>
  );
};

export default JobHiring;
