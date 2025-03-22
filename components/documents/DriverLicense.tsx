import React from 'react';
import { Identity } from '../../lib/identityGenerator';
import { formatDate } from '../../lib/utils';
import DocumentBase from './DocumentBase';
import Card from '../ui/Card';

interface DriverLicenseProps {
  identity: Identity;
}

const DriverLicense: React.FC<DriverLicenseProps> = ({ identity }) => {
  // Ensure we have driver's license data
  const licenseData = identity.documents.driverlicense;
  if (!licenseData) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Driver&apos;s License Data Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The required data for this driver&apos;s license could not be found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <DocumentBase identity={identity} documentTitle="Driver's License">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        {/* License header */}
        <div className="bg-green-700 dark:bg-green-800 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{licenseData.issuingState}</h3>
              <p className="text-sm text-green-100">Driver License</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-100">Class</p>
              <p className="text-2xl font-bold">{licenseData.class}</p>
            </div>
          </div>
        </div>
        
        {/* License body */}
        <div className="p-6">
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
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  License Number
                </p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                  {licenseData.number}
                </p>
              </div>
            </div>

            {/* Right section - License details */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {identity.lastName.toUpperCase()}, {identity.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {identity.dateOfBirth}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {identity.address.street}<br />
                    {identity.address.city}, {identity.address.state} {identity.address.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Issue/Expiry Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(licenseData.issueDate)} - {formatDate(licenseData.expiryDate)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Restrictions</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {licenseData.restrictions.length > 0 
                      ? licenseData.restrictions.join(', ') 
                      : 'None'}
                  </p>
                </div>
              </div>
              
              {/* Signature */}
              <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">Signature</p>
                <div className="border-b-2 border-gray-700 dark:border-gray-300 w-2/3 h-8 mt-1">
                  {/* Signature would appear here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentBase>
  );
};

export default DriverLicense; 