/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}', // Adjust this path according to your project's structure
      './node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}', // Include ShadCN components
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2563eb',
            light: '#3b82f6',
            dark: '#1e40af',
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'), // If you need typography plugin
      require('@tailwindcss/forms'), // If you're using forms plugin
      // Other plugins as per your requirements
    ],
  }
  
  