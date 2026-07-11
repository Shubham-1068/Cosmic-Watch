'use client'

import Link from 'next/link'
import { ArrowRight, Orbit, Radar, ShieldCheck } from 'lucide-react'
import { SiteFooter, SiteNav } from './SiteChrome'
import AsteroidVisualizer from './AsteroidVisualizer'

export default function Homepage() {
  const features = [
    { Icon: Radar, title: 'Live approach feed', copy: 'Follow the current stream of near-Earth objects and their approach windows.' },
    { Icon: ShieldCheck, title: 'Risk, in context', copy: 'See relevant hazard signals with distance, size, and velocity alongside.' },
    { Icon: Orbit, title: 'A shared record', copy: 'Keep important objects close and discuss observations with your team.' },
  ]
  return <main className="editorial-page">
    <SiteNav />
    <section className="hero-surface overflow-hidden"><div className="mx-auto grid min-h-[650px] max-w-[1280px] grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-20 lg:px-16">
        <p className="eyebrow">Near-Earth intelligence</p>
        <h1 className="display max-w-[620px] text-[clamp(54px,7vw,88px)] leading-[1.02]">Know what’s moving through our sky.</h1>
        <p className="mt-7 max-w-[500px] text-[18px] leading-7 text-[#554b42]">Cosmic Watch brings live asteroid approaches, risk signals, and observations into one considered monitoring workspace.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/register" className="button-dark">Start monitoring <ArrowRight size={16}/></Link><Link href="/dashboard" className="button-outline">Explore live data</Link></div>
      </div>
      <div className="hero-globe relative min-h-[440px] overflow-hidden bg-black">
        <div className="absolute inset-0 z-10"><AsteroidVisualizer autoRotate /></div>
        <p className="absolute bottom-9 left-9 font-mono text-xs tracking-[.22em] text-[#fff4d1]">OBSERVATION WINDOW · LIVE</p>
      </div>
    </div></section>
    <section className="mx-auto max-w-[1280px] px-8 py-24 lg:px-16"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">A clearer orbit</p><h2 className="display text-5xl leading-[1.08]">One calm view of a changing sky.</h2></div><p className="max-w-[570px] self-end text-lg leading-8 text-[#655c52]">The monitor is designed for the people who need to act on near-Earth object data. Essential context stays visible; the signal never gets lost in the interface.</p></div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">{features.map(({ Icon, title, copy }) => <article key={title} className="editorial-card p-8"><div className="mb-16 grid h-11 w-11 place-items-center rounded-lg bg-[#f8edcb] text-[#e84a20]"><Icon size={21}/></div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#655c52]">{copy}</p></article>)}</div>
    </section>
    <section className="mx-auto mb-24 max-w-[1216px] rounded-xl bg-[#f8edcb] px-8 py-16 text-center lg:px-16"><p className="eyebrow">Built for attention</p><h2 className="display cta-title mx-auto max-w-3xl text-5xl leading-tight">The next approach is easier to understand when the whole picture is in view.</h2><Link className="button-primary mt-8" href="/register">Create your workspace <ArrowRight size={16}/></Link></section>
    <SiteFooter />
  </main>
}
