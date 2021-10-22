// log the pageview with their URL
export const pageview = (url: string) => {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '', {
      page_path: url,
    })
  }
  
  // log specific events happening.
  export const event = ({ action, params }: {
    action: Gtag.EventNames | string, params: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
  }) => {
    window.gtag('event', action, params)
  }