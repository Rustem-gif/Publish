import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 900000,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'],
    ['list'],
    // ['playwright-qase-reporter', {
    //               debug: true,
    //               mode: 'testops',
    //               logging: true,
    //               testops: {
    //                 api: {
    //                   token: '2b3e65ab1ee17f1440a13c94b9d1da5429f590fdbcc8d080ddc41268ae50305b',
    //                 },
    //
    //                 project: 'AUTOMATION',
    //                 uploadAttachments: true,
    //                 run: {
    //                   complete: false,
    //                   title: 'Unpublish all failed experiment',
    //                   id: '194'
    //
    //                 }
    //
    //               }
    //             }
    //           ]
],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    headless: false

 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'prod',
      use: { viewport: {'width': 1024, 'height': 1980}},
      testMatch: '**/tests/Prod/*.spec.ts'
      ,
    },
    //
    {
      name: 'stage',
      use: { viewport: {'width': 1024, 'height': 1980},
      httpCredentials: {
          username: 'kingbilly-staging',
          password: '616113',
        },
      },
      testMatch: '**/tests/Stage/*.stage.ts',
    },

    {
      name: 'prod-vip',
      use: { viewport: {'width': 1024, 'height': 1980}},
      testMatch: '**/tests/VIP/*.vip.ts'
      ,
    },

    {
      name: 'stage-vip',
      use: { viewport: {'width': 1024, 'height': 1980},
      httpCredentials: {
          username: 'kingbilly-staging',
          password: '616113',
        }},
      testMatch: '**/tests/VIP/*.stage.ts'
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
