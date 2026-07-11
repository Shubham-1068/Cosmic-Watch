import Link from 'next/link'
import { ArrowRight, Eye, Orbit, ShieldCheck } from 'lucide-react'
import { SiteFooter, SiteNav } from '@/components/SiteChrome'

const principles = [
  { icon: Eye, title: 'Clarity first', copy: 'Near-Earth data is complex. We make the important parts readable at a glance.' },
  { icon: ShieldCheck, title: 'Context over noise', copy: 'Risk indicators live alongside distance, velocity, and object size—not in isolation.' },
  { icon: Orbit, title: 'A shared sky', copy: 'Watchlists and community channels keep meaningful observations easy to share.' },
]

export default function AboutPage() {
  return <main className="editorial-page"><SiteNav/>
    <section className="about-hero"><div><p className="eyebrow">About Cosmic Watch</p><h1 className="display">A more considered way to watch the sky.</h1><p>Cosmic Watch is a focused workspace for understanding the near-Earth objects moving through our neighbourhood.</p></div><div className="about-orbit"><span/><span/><span/><i/></div></section>
    <section className="about-story"><p className="eyebrow">Our approach</p><h2 className="display">Space data is most useful when it is understandable.</h2><div className="about-story__copy"><p>We built Cosmic Watch around a simple belief: people should not have to navigate dense telemetry to understand an approaching object. The monitor brings the data, its context, and the next sensible action into a single calm view.</p><p>Whether you are tracking a close approach, building a watchlist, or comparing risk signals, the interface is designed to help you stay oriented.</p></div></section>
    <section className="about-principles">{principles.map(({icon: Icon,title,copy}) => <article key={title}><Icon size={22}/><h3>{title}</h3><p>{copy}</p></article>)}</section>
    <section className="about-cta"><p className="eyebrow">Get started</p><h2 className="display">The sky is always changing. Your view of it can stay clear.</h2><Link href="/guide" className="button-primary">Read the guide <ArrowRight size={16}/></Link></section>
    <SiteFooter/>
  </main>
}
