import React, { useState } from 'react';
import OrganisasiListForm from './OrganizationListForm';
import TambahOrganisasiForm from './AddOrganizationiForm';

interface OrganisasiData {
    id: number;
    organization_name: string;
    position: string;
    description: string;
    is_active: boolean;
    start_month: string;
    start_year: number;
    end_month: string | null;
    end_year: number | null;
}

const OrganisasiForm: React.FC = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganisasiData | null>(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const handleAdd = () => {
        setIsAdding(true);
        setSelectedOrganization(null);
    };

    const handleEdit = (organization: OrganisasiData) => {
        setSelectedOrganization(organization);
        setIsAdding(true);
    };

    const handleBack = () => {
        setIsAdding(false);
        setSelectedOrganization(null);
        setShouldRefresh(true);
    };

    if (isAdding) {
        return (
            <TambahOrganisasiForm
                organizationData={selectedOrganization}
                onBack={handleBack}
                onSuccess={handleBack}
            />
        );
    }

    return (
        <OrganisasiListForm
            onAdd={handleAdd}
            onEdit={handleEdit}
            refresh={shouldRefresh}
            onRefreshComplete={() => setShouldRefresh(false)}
        />
    );
};

export default OrganisasiForm;