import React from 'react';
import { Identity, SocialMediaPlatform } from '../lib/identityGenerator';
import { formatDate } from '../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaUser,
  FaCalendarAlt,
  FaUserFriends,
  FaExternalLinkAlt
} from 'react-icons/fa';

interface SocialMediaProfilesProps {
  identity: Identity;
}

const SocialMediaProfiles: React.FC<SocialMediaProfilesProps> = ({ identity }) => {
  const { socialMedia } = identity;
  const platforms = Object.keys(socialMedia) as SocialMediaPlatform[];

  // Function to get the icon for a platform
  const getPlatformIcon = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook className="w-5 h-5 text-blue-600" />;
      case 'twitter':
        return <FaTwitter className="w-5 h-5 text-blue-400" />;
      case 'instagram':
        return <FaInstagram className="w-5 h-5 text-pink-500" />;
      case 'linkedin':
        return <FaLinkedin className="w-5 h-5 text-blue-700" />;
      case 'tiktok':
        return <FaTiktok className="w-5 h-5 text-black dark:text-white" />;
    }
  };

  // Function to get platform name with proper capitalization
  const getPlatformName = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      case 'tiktok':
        return 'TikTok';
    }
  };

  // If no social media profiles, display a message
  if (platforms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">No social media profiles available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaUserFriends className="mr-2" />
          Social Media Profiles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform) => {
            const profile = socialMedia[platform];
            if (!profile) return null;

            return (
              <div key={platform} className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getPlatformIcon(platform)}
                    <h3 className="ml-2 text-lg font-semibold">{getPlatformName(platform)}</h3>
                  </div>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <span className="mr-1">Visit Profile</span>
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                      <FaUser className="mr-1 w-3 h-3" /> Username
                    </p>
                    <p className="text-sm font-medium">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                      <FaCalendarAlt className="mr-1 w-3 h-3" /> Joined
                    </p>
                    <p className="text-sm">{formatDate(profile.joinDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Followers</p>
                    <p className="text-sm font-medium">{profile.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Following</p>
                    <p className="text-sm font-medium">{profile.following.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bio</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{profile.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaProfiles; 