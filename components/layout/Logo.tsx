import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="inline-block" aria-label="T.E.T">
      <div className="flex flex-col items-start">
        <span
          className="text-lg font-black uppercase tracking-[0.02em] text-black"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          T.E.T
        </span>
        <span className="text-[10px] font-normal lowercase tracking-[0.05em] text-[#777777]">
          The Earthy Touch co.
        </span>
      </div>
    </Link>
  )
}
