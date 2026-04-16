export default function MarqueeTicker() {
  const words = ['Furniture', 'Interior', 'Design', 'Craft', 'Living']
  const repeated = [...words, ...words, ...words, ...words]

  return (
    <div className="overflow-hidden bg-[#3b3d2b] opacity-10 py-5 my-0">
      <div className="flex whitespace-nowrap animate-marquee">
        {repeated.map((word, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-[clamp(1.4rem,3vw,3rem)] font-black tracking-[0.12em] uppercase text-[#e5e2e1]">
              {word}
            </span>
            <span className="text-[#9a9c7a] mx-6 text-[clamp(1rem,2vw,1.4rem)]">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
