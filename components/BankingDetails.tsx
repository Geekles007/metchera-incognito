import React, { useState } from 'react';
import { Identity } from '../lib/identityGenerator';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

interface BankingDetailsProps {
  identity: Identity;
}

const BankingDetails: React.FC<BankingDetailsProps> = ({ identity }) => {
  const { banking } = identity;
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showRoutingNumber, setShowRoutingNumber] = useState(false);
  const [showCreditCardDetails, setShowCreditCardDetails] = useState(false);

  // Mask account number except last 4 digits
  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '••••••••••';
    return '•'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaUniversity className="mr-2" />
          Banking Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-lg flex items-start">
            <FaExclamationTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              These are fake banking details for testing purposes only. Do not attempt to use these 
              details for real transactions or financial operations.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {banking.bankName}
              </h3>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                {banking.accountType.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono font-medium">
                    {showAccountNumber ? banking.accountNumber : maskAccountNumber(banking.accountNumber)}
                  </p>
                  <button
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showAccountNumber ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Routing Number</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono font-medium">
                    {showRoutingNumber ? banking.routingNumber : '•'.repeat(banking.routingNumber.length)}
                  </p>
                  <button
                    onClick={() => setShowRoutingNumber(!showRoutingNumber)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showRoutingNumber ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded p-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(banking.balance, banking.currency)}
                  </p>
                </div>
                <FaShieldAlt className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
            </div>
          </div>

          {banking.creditCard && (
            <div className="mt-6">
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg p-6 overflow-hidden text-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <FaCreditCard className="w-full h-full" />
                </div>
                
                <div className="flex items-center justify-between mb-8">
                  <FaCreditCard className="w-8 h-8" />
                  <p className="uppercase text-sm font-semibold">
                    {banking.creditCard.type}
                  </p>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs opacity-80 mb-1">Card Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-lg font-medium tracking-wider">
                      {showCreditCardDetails ? banking.creditCard.number : '•••• •••• •••• ' + banking.creditCard.number.slice(-4)}
                    </p>
                    <button
                      onClick={() => setShowCreditCardDetails(!showCreditCardDetails)}
                      className="ml-2 text-white opacity-80 hover:opacity-100"
                    >
                      {showCreditCardDetails ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-80 mb-1">Expiry Date</p>
                    <p className="font-mono">{banking.creditCard.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 mb-1">CVV</p>
                    <p className="font-mono">{showCreditCardDetails ? banking.creditCard.cvv : '•'.repeat(banking.creditCard.cvv.length)}</p>
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                <FaShieldAlt className="inline-block w-3 h-3 mr-1" />
                These credit card details are generated for testing purposes only
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BankingDetails; 