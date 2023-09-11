import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Web3ModalProvider from "./web3-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Staking',
  description: 'Staking Dapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{padding: '20px'}}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  )
}
