import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-black text-[#e5e2e1] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-[#777777] text-sm leading-relaxed max-w-xs">
              objects that embrace earth in every touch. curating natural harmony in modern living.
            </p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-4">shop</h3>
            <ul className="space-y-3">
              {['seating', 'tables', 'storage', 'lighting'].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat}`}
                    className="text-sm lowercase text-[#c6c6c6] hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-4">company</h3>
            <ul className="space-y-3">
              {[
                { href: '/collections', label: 'collections' },
                { href: '/about', label: 'about' },
                { href: '/contact', label: 'contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm lowercase text-[#c6c6c6] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2f2f2f] mt-12 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-[#777777] lowercase tracking-[0.05em]">
            © {new Date().getFullYear()} tht. all rights reserved.
          </p>
          <p className="text-xs text-[#777777] lowercase tracking-[0.05em]">
            objects of quiet intention
          </p>
        </div>
      </div>
    </footer>
  )
}
