import QRCode from 'qrcode';
import { Identity } from './identityGenerator';

/**
 * Generate QR code data URL for an identity document
 */
export async function generateQRCodeForIdentity(identity: Identity): Promise<string> {
  // Create validation data as a URL with document info
  const documentType = identity.documentType || 'idcard';
  const document = identity.documents[documentType];
  
  if (!document) {
    throw new Error(`No document information available for type: ${documentType}`);
  }
  
  // Create a verification payload
  const payload = {
    id: identity.id,
    name: `${identity.firstName} ${identity.lastName}`,
    docType: documentType,
    docNumber: getDocumentNumber(identity) || 'UNKNOWN',
    issuedAt: getIssueDate(identity) || new Date(),
    expires: getExpiryDate(identity) || new Date(),
    validationUrl: `https://metchera-id.verify.com/v/${identity.id}`
  };
  
  // Convert to JSON and base64 encode
  const dataString = JSON.stringify(payload);
  const encodedData = Buffer.from(dataString).toString('base64');
  
  // Generate QR code as data URL
  try {
    return await QRCode.toDataURL(encodedData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Extract document number based on document type
 */
export function getDocumentNumber(identity: Identity): string {
  const { documentType = 'idcard', documents } = identity;
  
  switch (documentType) {
    case 'idcard':
      return documents.idcard?.number || '';
    case 'passport':
      return documents.passport?.number || '';
    case 'driverlicense':
      return documents.driverlicense?.number || '';
    default:
      return '';
  }
}

/**
 * Extract issue date based on document type
 */
export function getIssueDate(identity: Identity): Date | null {
  const { documentType = 'idcard', documents } = identity;
  
  switch (documentType) {
    case 'idcard':
      return documents.idcard?.issueDate || null;
    case 'passport':
      return documents.passport?.issueDate || null;
    case 'driverlicense':
      return documents.driverlicense?.issueDate || null;
    default:
      return null;
  }
}

/**
 * Extract expiry date based on document type
 */
export function getExpiryDate(identity: Identity): Date | null {
  const { documentType = 'idcard', documents } = identity;
  
  switch (documentType) {
    case 'idcard':
      return documents.idcard?.expiryDate || null;
    case 'passport':
      return documents.passport?.expiryDate || null;
    case 'driverlicense':
      return documents.driverlicense?.expiryDate || null;
    default:
      return null;
  }
}

/**
 * Validate a QR code by decoding the data
 */
export function validateQRCode(qrData: string): { 
  valid: boolean;
  data?: any;
  error?: string;
} {
  try {
    // Decode base64 data
    const decodedData = Buffer.from(qrData, 'base64').toString();
    const data = JSON.parse(decodedData);
    
    // Check required fields
    if (!data.id || !data.name || !data.docType || !data.docNumber) {
      return { valid: false, error: 'Missing required fields in QR code data' };
    }
    
    // TODO: In a real application, you would verify against a database here
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: 'Invalid QR code data format' };
  }
} 