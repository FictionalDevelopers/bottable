import type { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

let browser: Browser | null = null;

const pages: Map<string, Page> = new Map();

export async function getBrowserInstance(): Promise<Browser> {
  if (!browser) {
    console.log('NO BROWSER');

    browser = await puppeteer.launch();
  }

  return browser;
}

export async function getPage(url: string): Promise<Page> {
  const browser = await getBrowserInstance();

  const builtPage = pages.get(url);

  if (!builtPage) {
    console.log('NO PAGE');

    const page = await browser.newPage();
    await page.goto('https://develop-db-stage.wcfmc-sandbox.com/post-job');

    pages.set(url, page);

    return page;
  }

  return builtPage;
}
