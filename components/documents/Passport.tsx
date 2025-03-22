import React from 'react';
import { Identity } from '../../lib/identityGenerator';
import { formatDate } from '../../lib/utils';
import DocumentBase from './DocumentBase';
import Card from '../ui/Card';

interface PassportProps {
  identity: Identity;
}

const Passport: React.FC<PassportProps> = ({ identity }) => {
  // Ensure we have passport data
  const passportData = identity.documents.passport;
  if (!passportData) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Passport Data Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The required data for this passport could not be found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <DocumentBase identity={identity} documentTitle="International Passport">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          {/* Left section - Passport header and photo */}
          <div className="mb-6 md:mb-0 md:mr-6 md:w-1/3">
            <div className="mb-4">
              <h3 className="text-lg text-blue-900 dark:text-blue-200 font-semibold uppercase mb-1">
                {passportData.issuingCountry}
              </h3>
              <h2 className="text-xl text-blue-900 dark:text-blue-200 font-bold uppercase">
                PASSPORT / PASSEPORT
              </h2>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {passportData.passportType.toUpperCase()} PASSPORT
              </p>
            </div>
            
            <div className="border-2 border-gray-400 dark:border-gray-600 p-1 mb-4">
              <img
                src={identity.avatarUrl}
                alt={`${identity.firstName} ${identity.lastName}`}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>

          {/* Right section - Passport details */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Passport No. / No. de Passeport</p>
                <p className="text-base font-mono text-blue-900 dark:text-blue-100 font-semibold">
                  {passportData.number}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Nationality / Nationalité</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {identity.nationality}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Surname / Nom</p>
                <p className="text-base text-blue-900 dark:text-blue-100 uppercase font-semibold">
                  {identity.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Given Names / Prénoms</p>
                <p className="text-base text-blue-900 dark:text-blue-100 uppercase font-semibold">
                  {identity.firstName}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Date of Birth / Date de naissance</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {identity.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Sex / Sexe</p>
                <p className="text-base text-blue-900 dark:text-blue-100 uppercase">
                  {identity.gender === 'male' ? 'M' : identity.gender === 'female' ? 'F' : 'X'}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Place of Birth / Lieu de naissance</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {identity.address.city}, {identity.address.country}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Date of Issue / Date de délivrance</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {formatDate(passportData.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Date of Expiry / Date d&apos;expiration</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {formatDate(passportData.expiryDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Authority / Autorité</p>
                <p className="text-base text-blue-900 dark:text-blue-100">
                  {passportData.issuingCountry} Passport Office
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-blue-700 dark:text-blue-300">Signature of Holder / Signature du titulaire</p>
              <div className="border-b-2 border-blue-800 dark:border-blue-300 w-2/3 h-8 mt-1">
                {/* Signature would appear here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentBase>
  );
};

export default Passport; 