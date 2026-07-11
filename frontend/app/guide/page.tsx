import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { SiteFooter, SiteNav } from '@/components/SiteChrome'

const sections = [
  ['Getting started', ['Overview', 'Reading the monitor', 'Understanding risk']],
  ['Workflows', ['Build a watchlist', 'Review analytics', 'Join the community']],
  ['Reference', ['Risk levels', 'Object data', 'Notifications']],
]

export default function GuidePage() {
  return <main className="editorial-page"><SiteNav/>
    <div className="guide-layout"><aside className="guide-sidebar"><p className="eyebrow">Documentation</p>{sections.map(([group, items]) => <div key={group}><h2>{group}</h2>{items.map(item => <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} key={item} className={item === 'Overview' ? 'active' : ''}>{item}</a>)}</div>)}</aside>
      <article className="guide-content"><nav className="guide-breadcrumb"><Link href="/">Cosmic Watch</Link><ChevronRight size={14}/><span>Guide</span></nav><p className="eyebrow">Getting started</p><h1 className="display">Use Cosmic Watch with confidence.</h1><p className="guide-lead">A practical guide to following near-Earth objects, understanding their data, and keeping the objects that matter close at hand.</p>
        <section id="overview"><h2>Overview</h2><p>Cosmic Watch combines a live object feed, risk assessment, analytics, and a personal watchlist. Start with the monitor, then narrow your attention as you learn more.</p><div className="guide-callout"><Check size={18}/><div><strong>Before you begin</strong><p>Create an account to save a watchlist and receive notifications for objects you follow.</p></div></div></section>
        <section id="reading-the-monitor"><h2>Reading the monitor</h2><p>The monitor presents the current feed of near-Earth objects. Select an object to examine its estimated size, closest approach, relative velocity, and risk signal.</p><div className="guide-code"><span>Object card</span><code>Distance · Velocity · Estimated diameter · Risk level</code></div></section>
        <section id="understanding-risk"><h2>Understanding risk</h2><p>Risk levels are contextual indicators, not predictions. They combine an object’s hazardous classification with proximity and estimated dimensions to help you prioritize review.</p><div className="guide-grid"><div><b>Low</b><p>Routine object information.</p></div><div><b>Medium</b><p>Worth keeping in view.</p></div><div><b>High</b><p>Prioritize a closer review.</p></div></div></section>
        <section id="build-a-watchlist"><h2>Build a watchlist</h2><p>Save any object from the monitor to your watchlist. It becomes a focused working set you can revisit whenever you need.</p><Link className="guide-next" href="/watchlist">Open your watchlist <ArrowRight size={15}/></Link></section>
      </article>
      <aside className="guide-on-page"><p>On this page</p><a href="#overview">Overview</a><a href="#reading-the-monitor">Reading the monitor</a><a href="#understanding-risk">Understanding risk</a><a href="#build-a-watchlist">Build a watchlist</a></aside>
    </div><SiteFooter/>
  </main>
}
