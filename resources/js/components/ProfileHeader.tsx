import React from 'react';

interface ProfileHeaderProps {
    name: string;
    email: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email }) => {
    return (
        <div className="mx-6 my-4 p-6 bg-[#F8F9FF] rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div>
                    <h2 className="text-2xl text-black font-bold">{name}</h2>
                    <p className="text-gray-600 text-sm">{email}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;