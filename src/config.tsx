import profileImage from '@/app/profile.webp';
import { GithubIcon } from '@/components/icons/github';
import { LinkedInIcon } from '@/components/icons/linkedin';

export const CONFIG = {
  name: 'Ali Rıza ÇELEBİ',
  title: 'Frontend Developer',
  headshot: profileImage,
  description: `Hi, I'm Ali Rıza ÇELEBİ. I work as a Frontend Developer. I'll be sharing blog posts and short notes here.`,
  socials: [
    {
      platform: 'GitHub',
      link: 'https://github.com/celebiali',
      icon: <GithubIcon />,
    },
    {
      platform: 'LinkedIn',
      link: 'https://www.linkedin.com/in/ali-r%C4%B1za-%C3%A7elebi-99a3a3181/',
      icon: <LinkedInIcon />,
    },
  ],
};
