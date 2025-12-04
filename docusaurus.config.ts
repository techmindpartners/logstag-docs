import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Logstag Docs',
  tagline: 'Monitor Your Databases Like Never Before',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.logstag.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'logstag', // Usually your GitHub org/user name.
  projectName: 'logstag-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/logstag/logstag-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '', // Hiding title to show logo only or logo + text if logo includes it
      logo: {
        alt: 'Logstag',
        src: 'img/logstag.png',
        srcDark: 'img/logstag.png', // Ensure visibility in dark mode
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://logstag.com',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/logstag',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/logstag',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/logstag',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Logstag.com',
              href: 'https://logstag.com',
            },
            {
              label: 'Book a Demo',
              href: 'https://logstag.com/demo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Logstag. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
