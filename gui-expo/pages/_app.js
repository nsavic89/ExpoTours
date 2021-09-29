import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import '../styles/globals.css'
import {NextIntlProvider} from 'next-intl'


// font awesome icons
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({ Component, pageProps }) {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <Component {...pageProps} />
    </NextIntlProvider>
  )
}

export default MyApp

