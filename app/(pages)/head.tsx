import { getCachedUrlConfig } from '@/lib/url-config'

export default async function Head() {
  const config = await getCachedUrlConfig()
  return (
    <>
      {config?.analyticsSnippet?.headHtml ? (
        <meta name="injected-analytics" content="true" />
      ) : null}
      {config?.analyticsSnippet?.headHtml ? (
        // eslint-disable-next-line @next/next/no-sync-scripts
        <script dangerouslySetInnerHTML={{ __html: config.analyticsSnippet.headHtml }} />
      ) : null}
    </>
  )
}


