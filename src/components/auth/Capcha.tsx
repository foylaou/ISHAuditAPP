import { SCRIPT_URL, Turnstile } from '@marsidev/react-turnstile'
import Script from 'next/script'

export default function TurnstileWidget() {
    return (
        <>
            <Script
                id="turnstile-script"
                src={SCRIPT_URL}
                strategy="beforeInteractive"
            />

            <Turnstile
                injectScript={false}
                scriptOptions={{ id: 'turnstile-script' }}
                siteKey='0x4AAAAAABA44qkoEHBUVvap'
            />
        </>
    )
}
