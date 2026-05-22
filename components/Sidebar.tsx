'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const nav = [
  { href: '/dashboard',              label: 'Overview',       icon: '📊' },
  { href: '/dashboard/applications', label: 'Applications',   icon: '📝' },
  { href: '/dashboard/companies',    label: 'Companies',      icon: '🏢' },
  { href: '/dashboard/prep',         label: 'Interview Prep', icon: '❓' },
  { href: '/dashboard/skills',       label: 'My Skills',      icon: '⚡' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-lg">🎯</div>
          <div>
            <div className="text-sm font-bold leading-tight">Job Tracker</div>
            <div className="text-xs text-slate-400 leading-tight mt-0.5">Hao Hong</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          {session?.user?.image && (
            <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{session?.user?.name}</div>
            <div className="text-xs text-slate-400 truncate">{session?.user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-xs text-slate-400 hover:text-white py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
