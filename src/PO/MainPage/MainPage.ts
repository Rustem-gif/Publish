import {type Locator, type Page, expect} from "@playwright/test";
import BasePage from "../BasePage/BasePage.js";
import chalk from "chalk";


export default class MainPage extends BasePage {

    constructor(page: Page) {
        super(page);

    }


    async clickThroughAllBanners(): Promise<void> {
        const numberOfBanners: number = await this.page.evaluate(() => {
            // @ts-ignore
            let number: number = document.querySelector('.slick-dots').childElementCount
            return number
        })

        for (let i = 0; i < numberOfBanners; i++) {
            await this.arrowMainSlider.click()
            await this.page.waitForTimeout(1000)
        }
    }


    async getPromoMainText(): Promise<Array<string>> {
        return await this.page.evaluate(async () => {
            let nodeList = document.querySelectorAll('span.banner-slide__text')
            if (nodeList !== null) {
                let array = Array.from(nodeList).map(title => title.textContent?.trim().toUpperCase() || '')
                if (array.length > 0) {
                    return array
                } else {
                    console.error("Array is empty")
                }
            }
            return []
        })
    }


    async checkPromoTourn(
        {promoType, lang, expectedValue, section}:
            {promoType: 'mainSlider' | 'footer' | 'tournament', lang: string, expectedValue: string, section: 'mainSlider' | 'footer' | 'tournament'}): Promise<boolean> {
        let receivedArray
        let titleIsNotFound

        if (section === 'mainSlider'){
            receivedArray = await this.getPromoMainText()
            titleIsNotFound = await this.checkTitle({receivedArray, expectedValue})
            //console.log(chalk.green(`${lang}\n ${promoType}\n ${receivedArray}`))


        } else if (section === 'footer') {
            receivedArray = await this.getFooterPromoTitles()
            titleIsNotFound = await this.checkTitle({receivedArray, expectedValue})
            //console.log(chalk.green(`${lang}\n ${promoType}\n ${receivedArray}`))


        } else if (section === 'tournament') {
            receivedArray = await this.getTournamentMainText()
            titleIsNotFound = await this.checkTitle({receivedArray, expectedValue})
            //console.log(chalk.green(`${lang}\n ${promoType}\n ${receivedArray}`))

        } 
        else {
            throw new Error(`Invalid section: ${section}`)
        }
        console.log(titleIsNotFound)
        return titleIsNotFound
    }
}



