import React from 'react';
import { Identity } from '../lib/identityGenerator';
import { formatDate } from '../lib/utils';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useIdentity } from '../contexts/IdentityContext';

interface IdentityCardProps {
  identity: Identity;
}

export default function IdentityCard({ identity }: IdentityCardProps) {
  const { deleteIdentity } = useIdentity();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={identity.avatarUrl} 
              alt={`${identity.firstName} ${identity.lastName}`}
              className="w-12 h-12 rounded-full mr-4" 
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {identity.firstName} {identity.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {identity.gender}, {identity.age} years
              </p>
            </div>
          </div>
          <button 
            onClick={() => deleteIdentity(identity.id)}
            className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 p-2"
            aria-label="Delete identity"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
            <p className="text-gray-900 dark:text-white truncate">{identity.email}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Phone</p>
            <p className="text-gray-900 dark:text-white">{identity.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
            <p className="text-gray-900 dark:text-white">{identity.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Nationality</p>
            <p className="text-gray-900 dark:text-white">{identity.nationality}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Created</p>
            <p className="text-gray-900 dark:text-white">{formatDate(identity.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Expires</p>
            <p className="text-gray-900 dark:text-white">{formatDate(identity.expiresAt)}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Address</p>
          <p className="text-gray-900 dark:text-white">
            {identity.address.street}, {identity.address.city}, {identity.address.state} {identity.address.zipCode}, {identity.address.country}
          </p>
        </div>
      </div>
    </div>
  );
} 