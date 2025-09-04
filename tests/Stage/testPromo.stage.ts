import { Browser, expect, Page, test } from "@playwright/test";
import MainPage from "../../src/PO/MainPage/MainPage.js";
import PromoPage from "../../src/PO/PromoPage/PromoPage.js";
import { STAGE_USER_ACCOUTNS } from "../../src/Data/UserAccounts.js";
import chalk from "chalk";
import { Ilocale, IpromoTournTitle } from "../../src/Interfaces.js";
import pLimit from "p-limit";

const locales: Ilocale = {
    'EN-AU': 'EN-AU',
    'EN-NZ': 'EN-NZ',
    'CA': 'CA',
    'EN': 'EN',
    'DE': 'DE',
    'NO': 'NO'
};

const commonPromoTournTitle = {
    promo: 'ROYAL PREMIERE SPINS',
    tourn: 'non tourn',
    vip: `nonVip`
};

const promoTournTitle: IpromoTournTitle = {
    EN: commonPromoTournTitle,
    'EN-AU': commonPromoTournTitle, 
    'EN-NZ': commonPromoTournTitle,
    'CA': commonPromoTournTitle,
    DE: {
        promo: 'KÖNIGLICHE PREMIERENSPIELE',
        tourn: 'non tourn',
        vip: `nonVip`
    },
    NO: {
        promo: 'KONGELIGE PREMIERESPINN',
        tourn: 'non tourn',
        vip: `nonVip`
    }
};

async function initializePages(browser: Browser, numberOfPages: number): Promise<{ pages: Page[], mainPages: MainPage[], promoPages: PromoPage[], tournamentPages: PromoPage[] }> {
    const ctx = await browser.newContext();
    const pages: Array<Page> = [];
    const mainPages: Array<MainPage> = [];
    const promoPages: Array<PromoPage> = [];
    const tournamentPages: Array<PromoPage> = [];

    for (let i = 0; i < numberOfPages; i++) {
        const page = await ctx.newPage();
        pages.push(page);
        mainPages.push(new MainPage(page));
        promoPages.push(new PromoPage(page));
        tournamentPages.push(new PromoPage(page));
    }

    return { pages, mainPages, promoPages, tournamentPages };
}

function logError(context: string, message: string, expected?: string, actual?: boolean) {
    console.error(chalk.bgRed.whiteBright(`\n[ERROR] ${context}`));
    console.error(chalk.red(`Message: ${message}`));

    if (expected !== undefined) {
        console.error(chalk.yellow(`Expected: ${expected}`));
    }

    if (actual !== undefined) {
        console.error(chalk.green(`Actual: ${actual}`));
    }

    console.error(`\n`);
}

let errorSummary: Array<string> = [];
const mainPageLink = 'https://kingbilly-staging.casino.p6m.tech/';
const promoPageLink = 'https://kingbilly-staging.casino.p6m.tech/promotions';
const tournamentPageLink = 'https://kingbilly-staging.casino.p6m.tech/tournaments';

test.describe('Check unpublish on the main page', () => {
    let pages: Page[];
    let mainPages: MainPage[];
    let promoPages: PromoPage[];
    let tournamentPages: PromoPage[];
    const steps: Promise<void>[] = [];

    test.beforeEach(async ({ browser }) => {
        // Initialize pages and page objects
        const result = await initializePages(browser, 19);
        pages = result.pages;
        mainPages = result.mainPages;
        promoPages = result.promoPages;
        tournamentPages = result.tournamentPages;

        // Navigate to the main and promo pages
        await mainPages[0].goTo(mainPageLink);
    });

    for (const [status, creds] of Object.entries(STAGE_USER_ACCOUTNS)) {
        test(`Unpublish ${status}`, async () => {
            // Log in with the current account
            if (creds.type === 'anon') {
                    console.log(chalk.yellow(`Skipping login for ${status} user`));
                    await mainPages[0].closePage();
                } else {
                    await mainPages[0].logIn({ email: creds.email, password: creds.password });
                    await mainPages[0].closePage();
                }

            const localesToTestMain = [
                {
                    lang: 'EN',
                    page: mainPages[1],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'EN-AU',
                    page: mainPages[2],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'EN-NZ',
                    page: mainPages[3],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'CA',
                    page: mainPages[4],
                    promoTitle: promoTournTitle.CA.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'DE',
                    page: mainPages[5],
                    promoTitle: promoTournTitle.DE.promo,
                    tournamentTitle: promoTournTitle.DE.tourn
                },
                {
                    lang: 'NO',
                    page: mainPages[6],
                    promoTitle: promoTournTitle.NO.promo,
                    tournamentTitle: promoTournTitle.NO.tourn
                },
            ];

            const localesToTestPromo = [
                {
                    lang: 'EN',
                    page: promoPages[7],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn,
                    vipPromoTitle: promoTournTitle.EN.vip
                },
                {
                    lang: 'EN-AU',
                    page: promoPages[8],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn,
                    vipPromoTitle: promoTournTitle.EN.vip
                },
                {
                    lang: 'EN-NZ',
                    page: promoPages[9],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn,
                    vipPromoTitle: promoTournTitle.EN.vip
                },
                {
                    lang: 'CA',
                    page: promoPages[10],
                    promoTitle: promoTournTitle.CA.promo,
                    tournamentTitle: promoTournTitle.EN.tourn,
                    vipPromoTitle: promoTournTitle.EN.vip
                },
                {
                    lang: 'DE',
                    page: promoPages[11],
                    promoTitle: promoTournTitle.DE.promo,
                    tournamentTitle: promoTournTitle.DE.tourn,
                    vipPromoTitle: promoTournTitle.DE.vip
                },
                {
                    lang: 'NO',
                    page: promoPages[12],
                    promoTitle: promoTournTitle.NO.promo,
                    tournamentTitle: promoTournTitle.NO.tourn,
                    vipPromoTitle: promoTournTitle.NO.vip
                },
            ];

            const localesToTestTournament = [
                {
                    lang: 'EN',
                    page: tournamentPages[13],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'EN-AU',
                    page: tournamentPages[14],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'EN-NZ',
                    page: tournamentPages[15],
                    promoTitle: promoTournTitle.EN.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'CA',
                    page: tournamentPages[16],
                    promoTitle: promoTournTitle.CA.promo,
                    tournamentTitle: promoTournTitle.EN.tourn
                },
                {
                    lang: 'DE',
                    page: tournamentPages[17],
                    promoTitle: promoTournTitle.DE.promo,
                    tournamentTitle: promoTournTitle.DE.tourn
                },
                {
                    lang: 'NO',
                    page: tournamentPages[18],
                    promoTitle: promoTournTitle.NO.promo,
                    tournamentTitle: promoTournTitle.NO.tourn
                },
            ];

            const limit = pLimit(10); // Set concurrency limit to 10

            const allTests = [
                ...localesToTestMain.map(({ lang, page, promoTitle, tournamentTitle }) =>
                    limit(async () => {
                        await test.step(`Checking ${lang} Main Page`, async () => {
                            await page.goTo(mainPageLink);
                            await page.waitForTimeout(6000);
                            await page.changeLanguge(lang);
                            await page.waitForTimeout(2000);
                            if (creds.type !== 'anon') {
                                await page.clickThroughAllBanners();

                                
                                    steps.push(test.step('Promo Main Page Slider', async () => {
                                        console.log(chalk.yellow(`Checking Promo Main Page Slider for ${lang}`));
                                        const titleIsNotFound = await page.checkPromoTourn({
                                            promoType: 'mainSlider',
                                            lang: locales[lang],
                                            expectedValue: promoTitle,
                                            section: 'mainSlider',
                                        });

                                        if (!titleIsNotFound) {
                                            logError(
                                                `Promo Main Page Slider - ${lang}`,
                                                `Expected promo title "${promoTitle}" is NOT found`,
                                                promoTitle,
                                                titleIsNotFound
                                            );
                                            errorSummary.push(`Promo Main Page Slider - ${lang}: ${promoTitle} is NOT found`);
                                        } else {
                                            console.log(`Promo Main Page Slider check passed for ${lang}`);
                                        }

                                        expect.soft(titleIsNotFound).toEqual(true);
                                    }));
                                } else {
                                    console.log(chalk.yellow(`Skipping Promo Main Page Slider check for ${lang} as user is anon`));
                                }

                                // Promo Footer (always run)
                                steps.push(test.step('Promo Main Footer', async () => {
                                    const titleIsNotFound = await page.checkPromoTourn({
                                        promoType: 'footer',
                                        lang: locales[lang],
                                        expectedValue: promoTitle,
                                        section: 'footer',
                                    });

                                    if (!titleIsNotFound) {
                                        logError(
                                            `Promo Footer - ${lang}`,
                                            `Expected promo title "${promoTitle}" is NOT found`,
                                            promoTitle,
                                            titleIsNotFound
                                        );
                                        errorSummary.push(`Promo Footer - ${lang}: ${promoTitle} is NOT found`);
                                    } else {
                                        console.log(`Promo Footer check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFound).toEqual(true);
                                }));

                                // Tournament Main Page Slider (always run)
                                steps.push(test.step('Tournament Main Page Slider', async () => {
                                    const titleIsNotFound = await page.checkPromoTourn({
                                        promoType: 'tournament',
                                        lang: locales[lang],
                                        expectedValue: tournamentTitle,
                                        section: 'tournament',
                                    });

                                    if (!titleIsNotFound) {
                                        logError(
                                            `Tournament Main Page Slider - ${lang}`,
                                            `Expected tournament title "${tournamentTitle}" is NOT found`,
                                            tournamentTitle,
                                            titleIsNotFound
                                        );
                                        errorSummary.push(`Tournament Main Page Slider - ${lang}: ${tournamentTitle} is NOT found`);
                                    } else {
                                        console.log(`Tournament Main Page Slider check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFound).toEqual(true);
                                }));

                                // Run all collected steps in parallel
                                await Promise.all(steps);

                                // Close the page
                                await page.closePage();
                            });
                        })
                    ),

                ...localesToTestPromo.map(({ lang, page, promoTitle, tournamentTitle, vipPromoTitle }) =>
                    limit(async () => {
                        await test.step(`Checking ${lang} Promo and Tournament Page`, async () => {
                            await page.goTo(promoPageLink);
                            await page.waitForTimeout(2000);
                            await page.changeLanguge(lang);
                           await page.waitForTimeout(2000);

                            await Promise.all([
                                test.step('Promo Card', async () => {
                                    const titleIsNotFound = await page.checkPromoTourn({
                                        promoType: 'promo',
                                        lang: locales[lang],
                                        expectedValue: promoTitle,
                                        section: 'promo',
                                    });

                                    if (!titleIsNotFound) {
                                        logError(
                                            `Promo Promo Page - ${lang}`,
                                            `Expected promo title "${promoTitle}" is NOT found`,
                                            promoTitle,
                                            titleIsNotFound
                                        );
                                        errorSummary.push(`Promo Promo Page - ${lang}: ${promoTitle} is NOT found`);
                                    } else {
                                        console.log(`Promo Promo Page check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFound).toEqual(true);
                                }),

                                test.step('Tournament Promo', async () => {
                                    const titleIsNotFound = await page.checkPromoTourn({
                                        promoType: 'tournament',
                                        lang: locales[lang],
                                        expectedValue: tournamentTitle,
                                        section: 'tournament',
                                    });

                                    if (!titleIsNotFound) {
                                        logError(
                                            `Promo Promo Page - ${lang}`,
                                            `Expected promo title "${tournamentTitle}" is NOT found`,
                                            tournamentTitle,
                                            titleIsNotFound
                                        );
                                        errorSummary.push(`Tournament Promo Page - ${lang}: ${tournamentTitle} is NOT found`);
                                    } else {
                                        console.log(`Tournament Promo Page check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFound).toEqual(true);
                                }),

                                test.step('Check VIP promos', async () => {
                                    await page.vipButtonElement.click();

                                    await page.changeLanguge(lang);
                                    await page.waitForTimeout(2000);
                                    const receivedArray = await page.getPromoCardText();
                                    const titleIsNotFoundVip = await page.checkTitle({
                                        receivedArray: receivedArray,
                                        expectedValue: vipPromoTitle
                                    });

                                    if (!titleIsNotFoundVip) {
                                        logError(
                                            `VIP Promo Page - ${lang}`,
                                            `Expected promo title "${vipPromoTitle}" is NOT found`,
                                            vipPromoTitle,
                                            titleIsNotFoundVip
                                        );
                                        errorSummary.push(`VIP Promo Page - ${lang}: ${vipPromoTitle} is NOT found`);
                                    } else {
                                        console.log(`VIP Promo Page check passed for ${lang}`);
                                    }
                                })
                            ]);
                            await page.closePage();
                        });
                    })
                ),

                ...localesToTestTournament.map(({ lang, page, promoTitle, tournamentTitle }) =>
                    limit(async () => {
                        await test.step(`Checking ${lang} Tournament Page`, async () => {
                            await page.goTo(tournamentPageLink);
                            await page.changeLanguge(lang);
                            await page.waitForTimeout(2000);
                            console.log(lang);

                            await Promise.all([
                                test.step('Tournament Page Tournament', async () => {
                                    const receivedArray = await page.getTournamentPromoText();
                                    const titleIsNotFoundTournament = await page.checkTitle({
                                        receivedArray: receivedArray,
                                        expectedValue: tournamentTitle
                                    });

                                    if (!titleIsNotFoundTournament) {
                                        logError(
                                            `Tournament Page Tournament - ${lang}`,
                                            `Expected promo title "${tournamentTitle}" is NOT found`,
                                            tournamentTitle,
                                            titleIsNotFoundTournament
                                        );
                                        errorSummary.push(`Tournament Page Tournament - ${lang}: ${tournamentTitle} is NOT found`);
                                    } else {
                                        console.log(`Tournament Page check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFoundTournament).toEqual(true);
                                }),

                                test.step('Tournament Page Promo', async () => {
                                    const receivedArray = await page.getPromoCardText();
                                    const titleIsNotFoundPromo = await page.checkTitle({
                                        receivedArray: receivedArray,
                                        expectedValue: promoTitle
                                    });

                                    if (!titleIsNotFoundPromo) {
                                        logError(
                                            `Tournament Page Promo - ${lang}`,
                                            `Expected promo title "${promoTitle}" is NOT found`,
                                            promoTitle,
                                            titleIsNotFoundPromo
                                        );
                                        errorSummary.push(`Tournament Page Promo - ${lang}: ${promoTitle} is NOT found`);
                                    } else {
                                        console.log(`Tournament Page check passed for ${lang}`);
                                    }

                                    expect.soft(titleIsNotFoundPromo).toEqual(true);
                                }),
                            ]);
                            await page.closePage();
                        });
                    })
                )
            ];

            await Promise.all(allTests);
        });
    }

    test.afterAll(() => {
        if (errorSummary.length > 0) {
            console.log(chalk.bgRed.whiteBright('\n=== ERROR SUMMARY ==='));
            errorSummary.forEach((error, index) => {
                console.log(chalk.red(`${index + 1}. ${error}`));
            });
        } else {
            console.log(chalk.bgGreen.whiteBright('\nAll tests passed without errors!'));
        }
    });
});