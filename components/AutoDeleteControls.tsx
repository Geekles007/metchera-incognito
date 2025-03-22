import React, { useState, useEffect } from 'react';
import { Identity } from '../lib/identityGenerator';
import { updateAutoDeleteSettings } from '../lib/identityService';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import {
  FaClock,
  FaDownload,
  FaTrash,
  FaExclamationTriangle,
  FaPause,
  FaPlay
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface AutoDeleteControlsProps {
  identity: Identity;
  onIdentityUpdated: (updatedIdentity: Identity) => void;
  onDownloadData: () => void;
}

const AutoDeleteControls: React.FC<AutoDeleteControlsProps> = ({
  identity,
  onIdentityUpdated,
  onDownloadData
}) => {
  const [isEnabled, setIsEnabled] = useState(identity.autodelete.enabled);
  const [timeoutMinutes, setTimeoutMinutes] = useState(identity.autodelete.timeoutMinutes);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate time remaining options
  const timeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 360, label: '6 hours' },
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' }
  ];

  // Update time remaining display
  useEffect(() => {
    if (!identity.autodelete.enabled) {
      setTimeRemaining('Auto-delete disabled');
      return;
    }

    const updateRemainingTime = () => {
      const now = new Date();
      const deleteAt = new Date(identity.autodelete.deleteAt);
      
      if (deleteAt <= now) {
        setTimeRemaining('Expiring now...');
        return;
      }

      const diffMs = deleteAt.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (diffHours > 0) {
        setTimeRemaining(`${diffHours}h ${diffMinutes}m ${diffSeconds}s remaining`);
      } else if (diffMinutes > 0) {
        setTimeRemaining(`${diffMinutes}m ${diffSeconds}s remaining`);
      } else {
        setTimeRemaining(`${diffSeconds}s remaining`);
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [identity.autodelete.enabled, identity.autodelete.deleteAt]);

  // Handle toggling auto-delete
  const handleToggleAutoDelete = async () => {
    try {
      setIsUpdating(true);
      const updatedIdentity = await updateAutoDeleteSettings(
        identity.id,
        !isEnabled,
        timeoutMinutes
      );

      if (updatedIdentity) {
        setIsEnabled(!isEnabled);
        onIdentityUpdated(updatedIdentity);
        toast.success(`Auto-delete ${!isEnabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error updating auto-delete settings:', error);
      toast.error('Failed to update auto-delete settings');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle changing timeout duration
  const handleChangeTimeout = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeout = Number(event.target.value);
    setTimeoutMinutes(newTimeout);

    if (isEnabled) {
      try {
        setIsUpdating(true);
        const updatedIdentity = await updateAutoDeleteSettings(
          identity.id,
          true,
          newTimeout
        );

        if (updatedIdentity) {
          onIdentityUpdated(updatedIdentity);
          toast.success('Auto-delete time updated');
        }
      } catch (error) {
        console.error('Error updating auto-delete timeout:', error);
        toast.error('Failed to update auto-delete time');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <FaClock className="mr-2 text-yellow-500" />
          Auto-Delete Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Warning message */}
          <div className="p-4 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 rounded-lg flex items-start">
            <FaExclamationTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
            <p className="text-sm">
              When auto-delete is enabled, this identity will be permanently removed after the specified time.
              Download your data before it's deleted.
            </p>
          </div>

          {/* Timer display */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <p className={`text-xl font-bold ${
              isEnabled 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {timeRemaining}
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-Delete Timer
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={timeoutMinutes}
                onChange={handleChangeTimeout}
                disabled={isUpdating}
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={handleToggleAutoDelete}
                isLoading={isUpdating}
                variant={isEnabled ? "outline" : "primary"}
                leftIcon={isEnabled ? <FaPause /> : <FaPlay />}
              >
                {isEnabled ? 'Disable Auto-Delete' : 'Enable Auto-Delete'}
              </Button>
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            variant="secondary"
            leftIcon={<FaDownload />}
            onClick={onDownloadData}
          >
            Download Identity Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoDeleteControls; 