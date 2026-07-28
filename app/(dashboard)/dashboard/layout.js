// layout.jsx

import { UserProvider } from "@/app/lib/providers/userContext"
import { createClient } from "@/app/lib/supabase/server"
import DashboardNavigation from "@/app/_comps/DashboardNav";
import { DM_Sans, Inter } from "next/font/google";

import "@/app/globals.css";
export const runtime = 'nodejs'

const Primaryfont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const HeadingsFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: `Grossary | %s`,
    default: ` Admin`,
  }, 
}
export default async function WebAppLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className={`${HeadingsFont.variable} ${Primaryfont.variable} antialiased`}>
      <UserProvider user={user}>
        <div className="lg:grid grid-cols-[16rem_1fr]">
          <div><DashboardNavigation data={user} /></div>
          <div>{children}</div>
        </div>
      </UserProvider>
    </div>
  )
}