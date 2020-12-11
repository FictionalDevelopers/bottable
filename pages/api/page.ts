import { NextApiRequest, NextApiResponse } from 'next';
import { getPage } from './_browser';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { url: urlParam, selector: selectorParam = '' },
  } = req;

  const url = typeof urlParam === 'string' ? urlParam : urlParam.join();
  const selector =
    typeof selectorParam === 'string' ? selectorParam : selectorParam.join();

  const page = await getPage(url);

  console.log('SELECTOR', selector, selector.split(' '));

  if (selector) {
    try {
      await page.click(selector);
    } catch (e) {
      console.log('ERROR');
      console.log(e);
    }
  }

  res.statusCode = 200;
  res.json({ content: await page.content() });
};
