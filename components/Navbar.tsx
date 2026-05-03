"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ask", label: "Ask VotePilot" },
  { href: "/simulator", label: "Simulator" },
  { href: "/elections", label: "Elections" },
  { href: "/mythbuster", label: "Myth Buster" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '2px solid #1A1A2E' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            style={{
              background: '#FF6B2B',
              border: '2px solid #1A1A2E',
              boxShadow: '3px 3px 0px #1A1A2E',
              borderRadius: '10px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="w-9 h-9 flex items-center justify-center text-white font-extrabold text-lg group-hover:-translate-x-[1px] group-hover:-translate-y-[1px]"
          >
            V
          </div>
          <span
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#1A1A2E' }}
            className="font-extrabold text-xl tracking-tight hidden sm:block"
          >
            VotePilot <span style={{ color: '#FF6B2B' }}>AI</span>
          </span>
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: pathname === link.href ? '#FF6B2B' : '#1A1A2E',
                background: pathname === link.href ? '#FFF0E8' : 'transparent',
                border: pathname === link.href ? '2px solid #FF6B2B' : '2px solid transparent',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                padding: '6px 14px',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-[#F5F0E8]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/onboarding"
          className="btn-primary text-sm"
          style={{ padding: '8px 20px', fontSize: '14px' }}
        >
          Get Started →
        </Link>
      </div>
    </nav>
  )
}
