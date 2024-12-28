import React, { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { userStorage } from '../utils/userStorage';
import { AddUserModal } from '../components/users/AddUserModal';
import { UserCard } from '../components/users/UserCard';

export function UsersPage() {
  const [users, setUsers] = useState(userStorage.getUsers());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setUsers(userStorage.getUsers());
  }, []);

  const handleAddUser = (userData: any) => {
    const newUser = userStorage.saveUser({
      ...userData,
      status: 'active',
    });
    setUsers([...users, newUser]);
  };

  const handleAssignProjects = (userId: string, projectIds: string[]) => {
    userStorage.updateUserProjects(userId, projectIds);
    setUsers(userStorage.getUsers());
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[#FF8001] text-white rounded-lg hover:bg-[#FF8001]/90"
        >
          <User className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onAssignProjects={handleAssignProjects}
          />
        ))}
      </div>

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
}