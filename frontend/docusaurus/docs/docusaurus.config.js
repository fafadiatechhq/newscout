// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Newscout',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: false,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'NewScout',
        // logo: {
        //   alt: 'NewScout Logo',
        //   src: 'img/logo.svg',
        // },

        items: [
          {
            label: 'All',
            to: '/feed',
            position: 'left',
          },
          {
            label: 'Technology',
            to: '/feed?category=technology',
            position: 'left',
          },
          {
            label: 'Business',
            to: '/feed?category=business',
            position: 'left',
          },
          {
            label: 'Trending',
            to: '/trending',
            position: 'right',
          },
          {
            label: 'Bookmarks',
            to: '/bookmarks',
            position: 'right',
          },
          {
            label: 'API Docs',
            to: '/docs/apidocs',
            position: 'right',
          },
          {
            label: 'Login',
            to: '/login',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',

        links: [
          {
            title: 'Discover',
            items: [
              { label: 'Browse Feed', to: '/feed' },
              { label: 'Trending', to: '/trending' },
              { label: 'Technology', to: '/feed?category=technology' },
              { label: 'Business', to: '/feed?category=business' },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About', to: '/about' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Contact', to: '/contact' },
              { label: 'API Docs', to: '/api-docs' },
            ],
          },
          {
            title: 'Legal',
            items: [
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Cookie Policy', to: '/cookies' },
            ],
          },
        ],

        copyright: `© ${new Date().getFullYear()} NewScout. All rights reserved. Aggregating 50+ verified publishers.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      docs: {
        sidebar: {
          hideable: false,
        },
      },
    }),
}

export default config
