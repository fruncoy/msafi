import React from 'react';
import { User } from '../../types/user';

interface UserCardProps {
  user: User;
  onAssignProjects: (userId: string, projectIds: string[]) => void;
}

export function UserCard({ user, onAssignProjects }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-[#FF8001] bg-opacity-10 flex items-center justify-center">
          <span className="text-[#FF8001] font-medium text-lg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {user.role}
        </span>
      </div>
    </div>
  );
}