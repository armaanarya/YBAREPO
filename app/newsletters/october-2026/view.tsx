'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'

export function OctoberUpdateView() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const link: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }
  const h2: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }
  const h3: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.1875rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.005em', marginTop: '2.25rem' }
  const strong: React.CSSProperties = { color: T.dark, fontWeight: 700 }
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Link
          href="/newsletters"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.muted, padding: '4px 0', marginBottom: '1.5rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
        >
          ← All newsletters
        </Link>
        <Badge>Newsletters</Badge>
        <TextStagger
          text="YBA October Update | October 2026"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          Youth Blockchain Association · Nov 1, 2026
        </p>
      </BlurFade>

      <article>
        <p style={{ ...body, marginTop: '2.5rem' }}>Hi everyone,</p>
        <p style={body}>Welcome to the first YBA Monthly Update from the Youth Blockchain Association.</p>
        <p style={body}>
          Each month, we&apos;ll share what YBA is building with students, supporters, partners, schools, and the broader blockchain community. Alongside major announcements, we&apos;ll cover the work behind them: our progress, the challenges we&apos;re working through, how we&apos;re using our funding, the programs we&apos;re developing, and where we could use your help.
        </p>
        <p style={body}>
          You can expect updates on YBA HACKS, our educational curriculum, partnerships, school outreach, student participation, fundraising, and upcoming opportunities. We want this newsletter to keep YBA transparent, document our growth, and give the people supporting our mission a direct way to follow our work and get involved.
        </p>
        <p style={body}>
          This October, we&apos;ve focused on planning YBA HACKS, developing our new blockchain curriculum, and growing our student community.
        </p>

        <h2 style={h2}>YBA HACKS</h2>
        <p style={body}>
          We&apos;re targeting <strong style={strong}>April 2027</strong> for YBA HACKS, our first flagship hackathon for Bay Area high school students. Our goal is to bring together approximately <strong style={strong}>100 students</strong> for a one-day, nine-hour event. Teams will build projects, work with mentors, and present to industry judges.
        </p>

        <h3 style={h3}>Hackathon Venue and date</h3>
        <p style={body}>
          We&apos;re evaluating venues across the Bay Area. The venue will determine the final capacity and date, so securing one is our biggest priority right now.
        </p>
        <p style={body}>
          We expect YBA HACKS and our related programming to need approximately <strong style={strong}>$6,500</strong>. This budget covers the venue, food, prizes, student AI access, workshops, equipment, and the tools YBA uses throughout the year.
        </p>
        <p style={body}>
          So far, we&apos;ve raised approximately <strong style={strong}>$2,700</strong>, putting us over 40% of the way toward our goal.
        </p>

        <h2 style={h2}>Our new curriculum series</h2>
        <p style={body}>
          We&apos;re preparing to formally announce a new YBA blockchain curriculum series for high school students. It will introduce students to blockchain fundamentals, then move into real applications and industry concepts. No prior technical knowledge is required.
        </p>
        <p style={body}>
          The series starts with what blockchain is and how it works. Later topics include smart contracts, DeFi, tokenization, stablecoins, infrastructure, DAOs, and the companies building blockchain technology today.
        </p>
        <p style={body}>
          We want students to understand blockchain beyond cryptocurrency, including its technology, infrastructure, and the real-world systems being built around it.
        </p>
        <p style={body}>
          The first round of educational content is already live on the Youth Blockchain Association YouTube channel, with more coming soon.
        </p>
        <p style={body}>
          <a href="https://www.youtube.com/@YouthBlockchainAssociation" {...ext} style={link}>Watch the YBA Curriculum Series</a>
        </p>
        <p style={body}>
          The curriculum will also support our school chapters and workshops, and eventually help students prepare for YBA HACKS.
        </p>

        <h2 style={h2}>Partnerships</h2>
        <p style={body}>
          Thank you to the organizations already formally supporting YBA, including{' '}
          <a href="https://www.openassets.to/" {...ext} style={link}>OpenAssets</a> and{' '}
          <a href="https://www.compound.xyz/" {...ext} style={link}>Compound Foundation</a> and the donation from the Co-founder of{' '}
          <a href="https://www.tradegix.com/" {...ext} style={link}>GIX</a>. We are delighted to continue to have more conversations with leaders in the fintech and blockchain industry.
        </p>
        <p style={body}>
          We&apos;re also formally partnered with the{' '}
          <a href="https://www.universityblockchain.org/" {...ext} style={link}>University Blockchain Conference</a> and{' '}
          <a href="http://college.xyz" {...ext} style={link}>College.xyz</a>. These partnerships help us connect with schools, university blockchain organizations, and the broader industry.
        </p>
        <p style={body}>
          We&apos;re continuing conversations with additional sponsors, mentors, and organizations interested in supporting YBA HACKS and our educational programs.
        </p>

        <h2 style={h2}>Growing the YBA community</h2>
        <p style={body}>
          Nearly <strong style={strong}>100 high school students have already expressed interest</strong>{' '}in YBA and the programs we&apos;re building.
        </p>
        <p style={body}>
          We&apos;re continuing outreach to schools across the Bay Area while developing workshops, curriculum, student-written content, and opportunities to learn directly from people working in blockchain, fintech, AI, and related industries.
        </p>
        <p style={body}>
          Every introduction helps. If you know an industry professional, company, school, mentor, or high school student who might be interested in YBA, we&apos;d appreciate the connection.
        </p>

        <h2 style={h2}>How you can support YBA</h2>
        <p style={body}>
          The best way to help right now is to introduce us to students, mentors, venues, sponsors, or others in the industry who might want to get involved.
        </p>
        <p style={body}>
          Financial support also helps us keep YBA HACKS and our educational programs accessible to students.
        </p>
        <p style={body}>
          <a href="https://hcb.hackclub.com/donations/start/youth-blockchain-association" {...ext} style={{ ...link, fontWeight: 700 }}>Support YBA</a>
        </p>
        <p style={body}>
          Thank you to everyone who has supported YBA so far. We&apos;re excited about what&apos;s taking shape and look forward to sharing more soon.
        </p>
        <p style={body}>
          <strong style={strong}>Youth Blockchain Association</strong>
          <br />
          <a href="https://joinyba.org/" style={link}>joinyba.org</a>
        </p>
        <p style={{ ...body, fontSize: '0.875rem', color: T.muted }}>
          YBA is fiscally sponsored by The Hack Foundation (d.b.a. Hack Club), a 501(c)(3) nonprofit. Donations are tax deductible to the extent permitted by law.
        </p>
      </article>
    </section>
  )
}
