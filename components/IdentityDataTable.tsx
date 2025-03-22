import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Identity } from '../lib/identityGenerator';
import { formatDate } from '../lib/utils';
import { useIdentity } from '../contexts/IdentityContext';

interface IdentityDataTableProps {
  identities: Identity[];
}

type SortField = 'createdAt' | 'name' | 'email' | 'phone' | 'dateOfBirth';
type SortDirection = 'asc' | 'desc';

export default function IdentityDataTable({ identities }: IdentityDataTableProps) {
  const { deleteIdentity } = useIdentity();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedIdentities = [...identities].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'name':
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'phone':
        comparison = a.phone.localeCompare(b.phone);
        break;
      case 'dateOfBirth':
        comparison = new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Function to render sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ArrowUpIcon className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 inline-block ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto relative bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleSort('createdAt')}>
              <span className="flex items-center">
                Date Added
                <SortIndicator field="createdAt" />
              </span>
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleSort('name')}>
              <span className="flex items-center">
                Name
                <SortIndicator field="name" />
              </span>
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleSort('email')}>
              <span className="flex items-center">
                Email
                <SortIndicator field="email" />
              </span>
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleSort('phone')}>
              <span className="flex items-center">
                Phone
                <SortIndicator field="phone" />
              </span>
            </th>
            <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => handleSort('dateOfBirth')}>
              <span className="flex items-center">
                Date of Birth
                <SortIndicator field="dateOfBirth" />
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedIdentities.length > 0 ? (
            sortedIdentities.map((identity) => (
              <tr 
                key={identity.id} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-4 px-6">
                  {formatDate(identity.createdAt)}
                </td>
                <td className="py-4 px-6">
                  {identity.firstName} {identity.lastName}
                </td>
                <td className="py-4 px-6">
                  {identity.email}
                </td>
                <td className="py-4 px-6">
                  {identity.phone}
                </td>
                <td className="py-4 px-6">
                  {identity.dateOfBirth}
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => deleteIdentity(identity.id)} 
                    className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400"
                    aria-label="Delete identity"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan={6} className="py-4 px-6 text-center">
                No identities found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 