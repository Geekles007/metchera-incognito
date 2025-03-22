import React from 'react';
import { Identity } from '../../lib/identityGenerator';
import { formatDate } from '../../lib/utils';
import DocumentBase from './DocumentBase';
import Card from '../ui/Card';

interface IdCardProps {
  identity: Identity;
}

const IdCard: React.FC<IdCardProps> = ({ identity }) => {
  // Ensure we have ID card data
  const idCardData = identity.documents.idcard;
  if (!idCardData) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ID Card Data Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The required data for this ID card could not be found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <DocumentBase identity={identity} documentTitle="National ID Card">
      <div className="flex flex-col md:flex-row">
        {/* Left section - Photo and basic info */}
        <div className="mb-6 md:mb-0 md:mr-6 md:w-1/3">
          <div className="border-2 border-gray-300 dark:border-gray-600 p-1 mb-4">
            <img
              src={identity.avatarUrl}
              alt={`${identity.firstName} ${identity.lastName}`}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Signature
            </p>
            <div className="border-b-2 border-gray-700 dark:border-gray-300 w-full h-8 mt-1">
              {/* Signature would appear here */}
            </div>
          </div>
        </div>

        {/* Right section - Document details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {identity.nationality} National ID
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {identity.firstName} {identity.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">ID Number</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {idCardData.number}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p className="text-gray-900 dark:text-white">
                {identity.dateOfBirth}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
              <p className="text-gray-900 dark:text-white capitalize">
                {identity.gender}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(idCardData.issueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(idCardData.expiryDate)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
              <p className="text-gray-900 dark:text-white">
                {identity.address.street}, {identity.address.city}, {identity.address.state}, {identity.address.zipCode}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Issuing Authority</p>
              <p className="text-gray-900 dark:text-white">
                {idCardData.issuingAuthority}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocumentBase>
  );
};

export default IdCard; 