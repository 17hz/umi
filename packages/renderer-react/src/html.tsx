import React from 'react';
import { IHtmlProps } from './types';

export type IScript =
  | Partial<{
      async: boolean;
      charset: string;
      content: string;
      crossOrigin: string | null;
      defer: boolean;
      src: string;
      type: string;
    }>
  | string;

const RE_URL = /^(http:|https:)?\/\//;

function isUrl(str: string) {
  return (
    RE_URL.test(str) ||
    (str.startsWith('/') && !str.startsWith('/*')) ||
    str.startsWith('./') ||
    str.startsWith('../')
  );
}

function genaretorScript(script: IScript, extraProps = {}) {
  if (typeof script === 'string') {
    return isUrl(script)
      ? {
          src: script,
          ...extraProps,
        }
      : { content: script };
  } else if (typeof script === 'object') {
    return {
      ...script,
      ...extraProps,
    };
  } else {
    throw new Error(`Invalid script type: ${typeof script}`);
  }
}

function generatorStyle(style: string) {
  return isUrl(style)
    ? { type: 'link', href: style }
    : { type: 'style', content: style };
}

export function Html({
  children,
  loaderData,
  manifest,
  metadata,
}: React.PropsWithChildren<IHtmlProps>) {
  // TODO: 处理 head 标签，比如 favicon.ico 的一致性
  // TODO: root 支持配置
  return (
    <html lang={metadata?.lang || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {metadata?.title && <title>{metadata.title}</title>}
        {metadata?.favicons?.map((favicon, key) => {
          return <link key={key} rel="shortcut icon" href={favicon} />;
        })}
        {metadata?.description && (
          <meta name="description" content={metadata.description} />
        )}
        {metadata?.keywords?.length && (
          <meta name="keywords" content={metadata.keywords.join(',')} />
        )}
        {metadata?.metas?.map((em) => (
          <meta key={em.name} name={em.name} content={em.content} />
        ))}

        {metadata?.links?.map((link: Record<string, string>, key) => {
          return <link key={key} {...link} />;
        })}
        {metadata?.styles?.map((style: string, key) => {
          const { type, href, content } = generatorStyle(style);
          if (type === 'link') {
            return <link key={key} rel="stylesheet" href={href} />;
          } else if (type === 'style') {
            return <style key={key}>{content}</style>;
          }
        })}
        {metadata?.headScripts?.map((script: IScript, key) => {
          const { content, ...rest } = genaretorScript(script);
          return (
            <script key={key} {...(rest as any)}>
              {content}
            </script>
          );
        })}
        {manifest?.assets['umi.css'] && (
          <link rel="stylesheet" href={manifest?.assets['umi.css']} />
        )}
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`,
          }}
        />

        <div id="root">{children}</div>
        {loaderData && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__UMI_LOADER_DATA__ = ${JSON.stringify(
                loaderData,
              )}`,
            }}
          />
        )}
        {metadata?.scripts?.map((script: IScript, key) => {
          const { content, ...rest } = genaretorScript(script, { async: true });
          return (
            <script key={key} {...(rest as any)}>
              {content}
            </script>
          );
        })}
      </body>
    </html>
  );
}
