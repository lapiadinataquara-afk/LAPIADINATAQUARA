import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'La Piadina – Farm to Table',
  description: 'Peça sua piadina artesanal com ingredientes frescos. Delivery rápido e saboroso!',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'system-ui, sans-serif', borderRadius: '0.5rem' },
            success: { style: { background: '#5C7A2C', color: 'white' } },
            error: { style: { background: '#8B2323', color: 'white' } },
          }}
        />
      </body>
    </html>
  )
}
