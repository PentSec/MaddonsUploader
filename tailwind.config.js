/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react"
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        fontFamily: {
            sans: ['ui-sans-serif', 'system-ui'],
            serif: ['ui-serif', 'Georgia'],
            mono: ['ui-monospace', 'SFMono-Regular'],
            display: ['Oswald'],
            body: ['Open Sans']
        },
        extend: {}
    },
    darkMode: 'class',
    plugins: [heroui()]
}
