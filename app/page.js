import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Odoo Implementation Project
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A comprehensive solution built with Next.js and Odoo integration. 
            This project demonstrates modern web development practices combined with enterprise ERP capabilities.
          </p>
        </div>
        
        <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">Modular Architecture</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Built with a flexible architecture that allows easy integration of Odoo modules and custom features.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">Seamless Integration</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Smooth integration with Odoo's ERP system for comprehensive business management.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">Modern UI/UX</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Clean, responsive interface designed for optimal user experience across devices.
            </p>
          </div>
        </div>

        <div className="mt-12 w-full max-w-2xl bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">Getting Started</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            To begin working with this project, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
            <li>Install dependencies: <code className="bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">npm install</code></li>
            <li>Configure your Odoo connection in environment variables</li>
            <li>Start the development server: <code className="bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">npm run dev</code></li>
            <li>Access the application at <a href="http://localhost:3000" className="text-blue-500 hover:underline">http://localhost:3000</a></li>
          </ol>
        </div>

        <div className="mt-12 flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
