import getSelector from 'get-selector';
import Head from 'next/head';
import { stringifyUrl } from 'query-string';
import { useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [url, setUrl] = useState(
    'https://develop-db-stage.wcfmc-sandbox.com/post-job',
  );
  const [fetching, setFetching] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function fetchUrl({ selector }: { selector?: string } = {}) {
    setFetching(true);

    fetch(
      stringifyUrl({
        url: '/api/page',
        query: { url, selector },
      }),
    )
      .then((res) => res.json())
      .then(({ content }) => {
        setFetching(false);
        const doc = iframeRef.current?.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(content);
          doc.addEventListener('focusout', async (e) => {
            e.preventDefault();
            const element = e.target as HTMLInputElement;

            if (element.matches('input')) {
              console.log('INPUT BLUR!', element.value);
              return;
            }

            console.log('focusout');
          });
          doc.addEventListener('click', async (e) => {
            e.preventDefault();

            const selector = getSelector(e.target);

            const element = e.target as HTMLElement;

            if (element?.matches('a *')) {
              console.log('LINK!');
              return;
            }

            if (element?.matches('input')) {
              console.log('INPUT!');
              return;
            }

            fetchUrl({ selector });
          });
        }
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Bottable!</h1>
        <div>
          <input
            placeholder='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <button onClick={() => fetchUrl()} disabled={!url && fetching}>
            {`Fetch${fetching ? ' (...)' : ''}`}
          </button>
        </div>
        <div style={{ width: '100%' }}>
          <iframe width='100%' height={500} ref={iframeRef} />
        </div>
      </main>
    </div>
  );
}
