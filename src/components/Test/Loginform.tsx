'use client'
import { Turnstile } from '@marsidev/react-turnstile'
import React from "react";

export default function LoginForm() {
    const formRef = React.useRef<HTMLFormElement>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(formRef.current!)
        const token = formData.get('cf-turnstile-response')

        const res = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify({ token }),
            headers: {
                'content-type': 'application/json'
            }
        })

        const data = await res.json()
        if (data.success) {
            // the token has been validated
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="password" />
            <Turnstile siteKey='0x4AAAAAABA44qkoEHBUVvap' />
            <button type='submit'>Login</button>
        </form>
    )
}
