import {type Locator, Page} from "@playwright/test";
import BasePage from "../BasePage/BasePage.js";
import chalk from "chalk";

export default class PromoPage extends BasePage{

    vipButton: Locator
    constructor(page: Page){
        super(page);

        this.vipButton = page.locator('#promo_promo_vip_tab')
    }


    async getPromoCardText(): Promise<Array<string>> {
        await this.page.waitForSelector('.promo-item__subtitle')
        return await this.page.evaluate(async () => {
            let nodeList = document.querySelectorAll('.promo-item__subtitle')
            if (nodeList !== null) {
                let array = Array.from(nodeList).map(title => title.textContent?.trim().toUpperCase() || '')
                 if (array.length > 0) {
                    return array
                }  else {
                    console.error("Array is empty")
                }
            }
            return []
        })
    }

    async getTournamentPromoText(): Promise<Array<string>> {
        return await this.page.evaluate(async () => {
            let nodeList = document.querySelectorAll('.tourn-item__subtitle')
            if (nodeList !== null) {
                let array:Array<string> = Array.from(nodeList).map(title => title.textContent?.trim().toUpperCase() || '')
                if (array.length > 0) {
                    return array
                }  else {
                    console.error("Array is empty")
                }
            }
            return []
        })
    }

    async checkPromoTourn({promoType, lang, expectedValue, section}:
            {promoType: 'promo' | 'tournament', lang: string, expectedValue: string, section: 'promo' | 'tournament'}): Promise<boolean> {
        let receivedArray
        let titleIsNotFound

        switch(section) {
            case "promo":
                receivedArray = await this.getPromoCardText();
                titleIsNotFound = await this.checkTitle({receivedArray, expectedValue});
                // console.log(chalk.green(`${lang}\n ${promoType}\n ${receivedArray}`));
                break;
            case "tournament":
                receivedArray = await this.getTournamentPromoText();
                titleIsNotFound = await this.checkTitle({receivedArray, expectedValue});
                // console.log(chalk.green(`${lang}\n ${promoType}\n ${receivedArray}`));
                break;
            default:
                // console.log(chalk.red(`Invalid section ${section}`));
                return false;
        }
        return titleIsNotFound
    }

    get vipButtonElement(): Locator {
            return this.vipButton
        }
}