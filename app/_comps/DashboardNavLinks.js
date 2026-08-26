'use client';

import { BarChart, FileText, Grid, PlusCircle, ShieldOff, Users } from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./Profile";

const navLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    exact: true,
    icon: Grid,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    exact: false,
    icon: Users,
  },
    {
    name: 'Lists',
    href: '/dashboard/lists',
    exact: false,
    icon: FileText,
  },

     {
    name: 'Surveys',
    href: '/dashboard/surveys',
    exact: false,
    icon: FileText,
  },
  {
    name: 'Blog Post',
    href: '/dashboard/blog-post',
    exact: false,
    icon: PlusCircle,
  },
      {
    name: 'Reset Password',
    href: '/dashboard/reset-password',
    exact: false,
    icon: ShieldOff,
  },

]

function DashNavLinks({ data }) {
  const pathname = usePathname()

  return (
    <main className="">
      <nav className="h-[60-vh] text-white w-full z-50 flex items-center justify-center mt-10 font-(--font-sans)">
        <ul className="grid grid-cols-4 gap-2 text-center w-full lg:grid-cols-1 lg:grid-rows-4 lg:gap-10 mt-60">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)

            return (
              <li
                key={link.name}
                className="flex flex-col items-center justify-center font-bold lg:justify-center lg:flex-row lg:gap-2"
              >
                <Link
                  href={link.href}
                  className={`flex flex-col lg:flex-row items-center lg:gap-10 lg:text-(--text-secondary)
                    lg:w-[90%] lg:ml-[5%] hover:bg-(--accent-secondary) hover:text-gray-50
                    hover:rounded-sm lg:p-3 active:opacity-60
                    ${isActive ? 'text-[#E32227] lg:bg-(--accent-primary) rounded-sm lg:text-gray-50' : ''}`}
                >
                  <link.icon />
                  <span>{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Profile data={data} />
    </main>
  )
}

export default DashNavLinks