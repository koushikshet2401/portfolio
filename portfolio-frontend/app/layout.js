import '../styles/globals.css'

export const metadata = {
  title: 'Koushik Shet | Full Stack Developer Portfolio',
  description: 'Modern Full Stack Developer Portfolio with MERN Stack',
  keywords: 'full stack developer, MERN stack, React, Node.js, portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
