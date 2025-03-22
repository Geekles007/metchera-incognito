import { faker } from '@faker-js/faker';

export type DocumentType = 'idcard' | 'passport' | 'driverlicense';
export type SocialMediaPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';

export interface Identity {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  age: number;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  phone: string;
  avatarUrl: string;
  createdAt: Date;
  expiresAt: Date; // Identity expires after X days
  // Auto delete settings
  autodelete: {
    enabled: boolean;
    deleteAt: Date;
    timeoutMinutes: number;
  };
  documentType?: DocumentType;
  documents: {
    idcard?: {
      number: string;
      issueDate: Date;
      expiryDate: Date;
      issuingAuthority: string;
    };
    passport?: {
      number: string;
      issueDate: Date;
      expiryDate: Date;
      issuingCountry: string;
      passportType: string;
    };
    driverlicense?: {
      number: string;
      issueDate: Date;
      expiryDate: Date;
      issuingState: string;
      class: string;
      restrictions: string[];
    };
  };
  // New fields for social media, email, and banking
  socialMedia: {
    [key in SocialMediaPlatform]?: {
      username: string;
      profileUrl: string;
      followers: number;
      following: number;
      bio: string;
      joinDate: Date;
    }
  };
  tempEmail: {
    address: string;
    accessUrl: string;
    password?: string;
    provider: string;
  };
  banking: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    balance: number;
    currency: string;
    creditCard?: {
      number: string;
      expiryDate: string;
      cvv: string;
      type: 'visa' | 'mastercard' | 'amex' | 'discover';
    };
  };
}

/**
 * Generate an ID card document
 */
function generateIdCard(nationality: string): Identity["documents"]["idcard"] {
  const issueDate = faker.date.past({ years: 5 });
  const expiryDate = faker.date.future({ years: 5, refDate: issueDate });
  
  return {
    number: `ID${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
    issueDate,
    expiryDate,
    issuingAuthority: nationality === 'United States' ? 
      `${faker.location.state()} Department of Public Safety` : 
      `${nationality} National Registry`,
  };
}

/**
 * Generate a passport document
 */
function generatePassport(nationality: string): Identity["documents"]["passport"] {
  const issueDate = faker.date.past({ years: 3 });
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + 10); // Passports typically valid for 10 years
  
  const passportTypes = ['Regular', 'Diplomatic', 'Service', 'Emergency'];
  
  return {
    number: faker.string.alpha({ length: 2, casing: 'upper' }) + faker.string.numeric(7),
    issueDate,
    expiryDate,
    issuingCountry: nationality,
    passportType: faker.helpers.arrayElement(passportTypes),
  };
}

/**
 * Generate a driver's license document
 */
function generateDriverLicense(state: string): Identity["documents"]["driverlicense"] {
  const issueDate = faker.date.past({ years: 2 });
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + 4); // Driver's licenses typically valid for 4 years
  
  const licenseClasses = ['A', 'B', 'C', 'D', 'M'];
  const possibleRestrictions = [
    'Corrective Lenses',
    'Outside Mirror',
    'Daytime Driving Only',
    'No Highway Driving',
    'Automatic Transmission',
    'No Passengers',
  ];
  
  return {
    number: `DL${faker.string.alphanumeric({ length: 10, casing: 'upper' })}`,
    issueDate,
    expiryDate,
    issuingState: state,
    class: faker.helpers.arrayElement(licenseClasses),
    restrictions: faker.helpers.arrayElements(possibleRestrictions, { min: 0, max: 2 }),
  };
}

/**
 * Generate social media profiles for an identity
 */
function generateSocialMediaProfiles(firstName: string, lastName: string): Identity['socialMedia'] {
  const socialMedia: Identity['socialMedia'] = {};
  const platforms: SocialMediaPlatform[] = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'];
  
  // Choose 2-4 random platforms for the identity
  const selectedPlatforms = faker.helpers.arrayElements(platforms, { min: 2, max: 4 });
  
  // Generate username variations
  const usernameBase = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const usernameWithDot = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  const usernameWithUnderScore = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  const usernameVariations = [
    usernameBase,
    usernameWithDot,
    usernameWithUnderScore,
    `${usernameBase}${faker.number.int({ min: 10, max: 999 })}`,
    `real${usernameBase}`,
    `the${firstName.toLowerCase()}`,
    `${firstName.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}`
  ];
  
  selectedPlatforms.forEach(platform => {
    const username = faker.helpers.arrayElement(usernameVariations);
    const joinDate = faker.date.past({ years: 7 });
    
    // Platform specific formatting
    switch (platform) {
      case 'facebook':
        socialMedia[platform] = {
          username: username,
          profileUrl: `https://facebook.com/${username}`,
          followers: faker.number.int({ min: 50, max: 1000 }),
          following: faker.number.int({ min: 50, max: 500 }),
          bio: faker.person.bio(),
          joinDate: joinDate
        };
        break;
      case 'twitter':
        socialMedia[platform] = {
          username: `@${username}`,
          profileUrl: `https://twitter.com/${username}`,
          followers: faker.number.int({ min: 10, max: 2000 }),
          following: faker.number.int({ min: 50, max: 1000 }),
          bio: faker.lorem.sentence(10),
          joinDate: joinDate
        };
        break;
      case 'instagram':
        socialMedia[platform] = {
          username: username,
          profileUrl: `https://instagram.com/${username}`,
          followers: faker.number.int({ min: 100, max: 5000 }),
          following: faker.number.int({ min: 100, max: 1000 }),
          bio: faker.lorem.sentences(2),
          joinDate: joinDate
        };
        break;
      case 'linkedin':
        socialMedia[platform] = {
          username: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          profileUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          followers: faker.number.int({ min: 50, max: 500 }),
          following: faker.number.int({ min: 50, max: 300 }),
          bio: `${faker.person.jobTitle()} at ${faker.company.name()} | ${faker.person.jobArea()} Professional`,
          joinDate: joinDate
        };
        break;
      case 'tiktok':
        socialMedia[platform] = {
          username: username,
          profileUrl: `https://tiktok.com/@${username}`,
          followers: faker.number.int({ min: 100, max: 10000 }),
          following: faker.number.int({ min: 50, max: 500 }),
          bio: faker.lorem.sentence(5),
          joinDate: joinDate
        };
        break;
    }
  });
  
  return socialMedia;
}

/**
 * Generate temporary email with inbox access
 */
function generateTempEmail(username: string): Identity['tempEmail'] {
  // List of temporary email providers that offer inbox access
  const emailProviders = [
    { domain: 'mailinator.com', baseUrl: 'https://www.mailinator.com/v4/public/inboxes.jsp?to=' },
    { domain: 'temp-mail.org', baseUrl: 'https://temp-mail.org/en/view/' },
    { domain: 'dispostable.com', baseUrl: 'https://www.dispostable.com/inbox/' },
    { domain: 'tempmail.plus', baseUrl: 'https://tempmail.plus/en/#!' },
    { domain: '10minutemail.com', baseUrl: 'https://10minutemail.com/' },
  ];
  
  const provider = faker.helpers.arrayElement(emailProviders);
  const emailUsername = `${username}${faker.number.int({ min: 100, max: 999 })}`;
  const emailAddress = `${emailUsername}@${provider.domain}`;
  
  // For some providers we need to encode the email for the access URL
  const encodedEmail = encodeURIComponent(emailAddress);
  let accessUrl = '';
  
  if (provider.domain === 'mailinator.com') {
    accessUrl = `${provider.baseUrl}${emailUsername}`;
  } else if (provider.domain === 'temp-mail.org') {
    accessUrl = `${provider.baseUrl}${encodedEmail}`;
  } else if (provider.domain === 'dispostable.com') {
    accessUrl = `${provider.baseUrl}${emailUsername}`;
  } else {
    accessUrl = provider.baseUrl;
  }
  
  return {
    address: emailAddress,
    accessUrl: accessUrl,
    provider: provider.domain,
    password: provider.domain.includes('10minutemail') ? undefined : faker.internet.password({ length: 12 })
  };
}

/**
 * Generate banking information
 */
function generateBankingInfo(): Identity['banking'] {
  const banks = [
    { name: 'National Bank', currency: 'USD' },
    { name: 'Metro Credit Union', currency: 'USD' },
    { name: 'First Federal Bank', currency: 'USD' },
    { name: 'City Trust', currency: 'USD' },
    { name: 'Global Banking Corp', currency: 'USD' }
  ];
  
  const selectedBank = faker.helpers.arrayElement(banks);
  const accountType = faker.helpers.arrayElement(['checking', 'savings']) as 'checking' | 'savings';
  
  // Generate credit card for some identities (70% chance)
  const hasCreditCard = faker.number.int({ min: 1, max: 10 }) <= 7;
  let creditCard;
  
  if (hasCreditCard) {
    const cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
    const selectedType = faker.helpers.arrayElement(cardTypes) as 'visa' | 'mastercard' | 'amex' | 'discover';
    
    // Format CC number based on type
    let ccNumber;
    switch (selectedType) {
      case 'visa':
        ccNumber = `4${faker.string.numeric(15)}`; // Visa starts with 4
        break;
      case 'mastercard':
        // Mastercard starts with 51-55
        ccNumber = `5${faker.number.int({ min: 1, max: 5 })}${faker.string.numeric(14)}`;
        break;
      case 'amex':
        // Amex starts with 34 or 37
        ccNumber = `3${faker.helpers.arrayElement(['4', '7'])}${faker.string.numeric(13)}`;
        break;
      case 'discover':
        // Discover starts with 6011
        ccNumber = `6011${faker.string.numeric(12)}`;
        break;
    }
    
    // Format as XXXX-XXXX-XXXX-XXXX or XXXX-XXXXXX-XXXXX for Amex
    let formattedNumber;
    if (selectedType === 'amex') {
      formattedNumber = `${ccNumber.substring(0, 4)}-${ccNumber.substring(4, 10)}-${ccNumber.substring(10)}`;
    } else {
      formattedNumber = `${ccNumber.substring(0, 4)}-${ccNumber.substring(4, 8)}-${ccNumber.substring(8, 12)}-${ccNumber.substring(12)}`;
    }
    
    // Generate expiry date (1-5 years in the future)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + faker.number.int({ min: 1, max: 5 }));
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expiryDate.getFullYear().toString().slice(-2);
    
    creditCard = {
      number: formattedNumber,
      expiryDate: `${month}/${year}`,
      cvv: selectedType === 'amex' ? faker.string.numeric(4) : faker.string.numeric(3),
      type: selectedType
    };
  }
  
  return {
    bankName: selectedBank.name,
    accountNumber: faker.string.numeric(10),
    routingNumber: faker.string.numeric(9),
    accountType,
    balance: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    currency: selectedBank.currency,
    ...(creditCard && { creditCard })
  };
}

/**
 * Generate a random identity with realistic details
 */
export function generateIdentity(documentType?: DocumentType, autoDeleteMinutes?: number): Identity {
  const gender = faker.person.sex() as 'male' | 'female';
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  
  const id = faker.string.uuid();
  const nationality = faker.location.country();
  const state = faker.location.state();
  
  // Create username for consistent usage across platforms
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}`;
  
  // Generate temporary email with inbox access
  const tempEmail = generateTempEmail(username);
  
  // Create expiration date (7 days from now)
  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Create auto-delete information
  const isAutoDeleteEnabled = autoDeleteMinutes !== undefined && autoDeleteMinutes > 0;
  const autoDeleteTime = isAutoDeleteEnabled ? new Date(createdAt.getTime() + autoDeleteMinutes * 60000) : new Date(createdAt.getTime() + 24 * 60 * 60000); // Default 24 hours if not specified but enabled
  
  // Determine document type if not specified
  const docType = documentType || faker.helpers.arrayElement(['idcard', 'passport', 'driverlicense'] as DocumentType[]);
  
  // Initialize empty documents object
  const documents: Identity['documents'] = {
    idcard: undefined,
    passport: undefined,
    driverlicense: undefined
  };
  
  // Generate only the selected document type
  switch (docType) {
    case 'idcard':
      documents.idcard = generateIdCard(nationality);
      break;
    case 'passport':
      documents.passport = generatePassport(nationality);
      break;
    case 'driverlicense':
      documents.driverlicense = generateDriverLicense(state);
      break;
  }
  
  // Generate social media profiles
  const socialMedia = generateSocialMediaProfiles(firstName, lastName);
  
  // Generate banking information
  const banking = generateBankingInfo();
  
  return {
    id,
    firstName,
    lastName,
    gender,
    dateOfBirth: birthdate.toISOString().split('T')[0],
    age: new Date().getFullYear() - birthdate.getFullYear(),
    nationality,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state,
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    email: tempEmail.address,
    phone: faker.phone.number(),
    avatarUrl: `https://i.pravatar.cc/150?u=${id}`, // Using pravatar.cc for realistic avatars
    createdAt,
    expiresAt,
    autodelete: {
      enabled: isAutoDeleteEnabled,
      deleteAt: autoDeleteTime,
      timeoutMinutes: isAutoDeleteEnabled ? autoDeleteMinutes : 24 * 60 // Default 24 hours
    },
    documentType: docType,
    documents,
    socialMedia,
    tempEmail,
    banking,
  };
}

/**
 * Generate multiple identities at once
 */
export function generateMultipleIdentities(count: number = 5): Identity[] {
  return Array.from({ length: count }, () => generateIdentity());
} 