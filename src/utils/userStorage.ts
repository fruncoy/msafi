import { User, UserFormData } from '../types/user';
import { notificationStorage } from './notificationStorage';

const USERS_KEY = 'users';

export const userStorage = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (formData: UserFormData): User => {
    const users = userStorage.getUsers();
    if (users.some(user => user.email === formData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      ...formData,
      status: 'pending',
      assignedProjects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  updateUserStatus: (userId: string, status: 'pending' | 'active') => {
    const users = userStorage.getUsers();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status, updatedAt: new Date().toISOString() } : user
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  },

  updateUserProjects: (userId: string, projectIds: string[]) => {
    const users = userStorage.getUsers();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, assignedProjects: projectIds, updatedAt: new Date().toISOString() } : user
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  },

  // ... rest of the existing methods
};