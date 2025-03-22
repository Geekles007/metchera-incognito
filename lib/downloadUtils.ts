import { Identity } from './identityGenerator';

/**
 * Downloads identity data as a JSON file
 * @param identity The identity to download
 */
export const downloadIdentityAsJSON = (identity: Identity): void => {
  // Create a sanitized copy of the identity without sensitive internal fields
  const downloadData = {
    ...identity,
    // Remove internal fields that aren't needed in the download
    _collection: undefined,
    _path: undefined
  };

  // Convert to JSON string with pretty formatting
  const jsonData = JSON.stringify(downloadData, null, 2);
  
  // Create a blob with the JSON data
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = `identity_${identity.id}_${formatDateForFilename(new Date())}.json`;
  
  // Append to the body, click, and remove
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Formats a date for use in a filename (YYYY-MM-DD_HH-MM-SS)
 * @param date The date to format
 * @returns Formatted date string
 */
const formatDateForFilename = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}; 