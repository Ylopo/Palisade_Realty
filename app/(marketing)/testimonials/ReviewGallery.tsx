'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const STAR = (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="#eeca00" aria-hidden="true">
    <path d="M9 1.5l2.09 4.24 4.67.68-3.38 3.29.8 4.65L9 12l-4.18 2.36.8-4.65L2.24 6.42l4.67-.68z" />
  </svg>
)
const STARS = <div className="rg-stars">{STAR}{STAR}{STAR}{STAR}{STAR}</div>

const CLAMP_HEIGHT = 130

export interface ReviewCardProps {
  quote: string
  agentName: string
  agentPhoto: string
  rating?: number
}

interface Props {
  reviews?: ReviewCardProps[]
}

function ReviewCard({ quote, agentName, agentPhoto, rating = 5.0 }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (quoteRef.current && quoteRef.current.scrollHeight > CLAMP_HEIGHT + 8) {
      setNeedsClamp(true)
    }
  }, [])

  return (
    <article className="rg-card">
      <div className="rg-bigquote" aria-hidden="true">&ldquo;</div>
      <div className={`rg-quote-wrap${needsClamp && !expanded ? ' is-clamped' : ''}${needsClamp && expanded ? ' is-expanded' : ''}`}>
        <p
          className="rg-quote"
          ref={quoteRef}
          style={needsClamp ? { maxHeight: expanded ? quoteRef.current?.scrollHeight : CLAMP_HEIGHT } : undefined}
        >
          {quote}
        </p>
      </div>
      {needsClamp && (
        <button
          className="rg-see-more"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <>See Less <span aria-hidden="true">↑</span></> : <>See More <span aria-hidden="true">→</span></>}
        </button>
      )}
      <div className="rg-card-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/assets/images/agents/${agentPhoto}`} alt={agentName} className="rg-agent-photo" loading="lazy" />
        <div className="rg-card-info">
          <p className="rg-agent-label">Review for: <strong>{agentName}</strong></p>
          <div className="rg-stars-row">
            {STARS}
            <span className="rg-rating-num">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

const REVIEWS: ReviewCardProps[] = [
  {
    quote: '“My partner and I have been working with Anh for years — first in buying our home and then selling. Working with Anh was honestly one of the best decisions we made. From guiding us through the purchase of our new home and then helping us sell our home, she made the entire process as stress-free as possible. She helped us search for a home for almost an entire year and would go above and beyond making sure we had everything on our must-have list. Her knowledge of the market and outstanding communication gave us confidence every step of the way. She was always available to answer our questions, offered honest advice, and went out of her way to make sure everything stayed on track. Thanks to her expertise, our home sold as quickly as possible in this unsure market. We truly felt like she had our best interests at heart the entire time. If you’re looking for a dedicated, professional, and genuinely caring realtor, we can’t recommend Anh Lam highly enough.”',
    agentName: 'Anh Lam', agentPhoto: 'anh-lam.jpg',
  },
  {
    quote: '“We worked with Wally on both the sale of our condo and the purchase of our home, and had a fantastic experience from start to finish. His attention to detail stood out throughout the process — he helped us with staging, created a professional video to boost exposure, and ensured our listing was on Zillow Showcase. What we appreciated most was his communication. He consistently provided real-time updates so we were always in the loop. Wally was also honest and transparent at every stage, which helped us feel confident in our decisions. He was not pushy — he would present the facts and respected our decisions. On top of that, his network of trusted professionals made the entire process much smoother. We would highly recommend him to anyone buying or selling a home.”',
    agentName: 'Wally Dally', agentPhoto: 'wally-dally.png',
  },
  {
    quote: '“Five stars truly isn’t enough to describe the experience of working with her. She brings a rare combination of deep market knowledge, flawless professionalism, and a brilliant, get-it-done attitude. Real estate transactions can be a minefield of stress, but she completely shielded me from all of it. The process was entirely seamless. She was proactively communicative, keeping me updated every step of the way and explaining everything clearly so I always felt confident in our choices. Her expertise is undeniable, but it’s her drive and dedication to her clients that make her an absolute rockstar in her field. She handles every detail so you can just focus on the excitement of your next chapter.”',
    agentName: 'Jennifer Crosby', agentPhoto: 'jennifer-crosby.jpg',
  },
  {
    quote: '“We had a great experience working with our realtor, Taylor. She was consistently responsive, friendly, and took the time to clearly explain each step of the process, which made everything feel much less overwhelming. She was also a strong negotiator and helped us feel confident we were getting the best possible outcome. We really appreciated how quickly she answered questions and kept things moving smoothly from start to finish!”',
    agentName: 'Taylor Schunk', agentPhoto: 'taylor-schunk.jpg',
  },
  {
    quote: '“We recently worked with Jeremy McHone to sell our home in Ramona, and the experience was absolutely exceptional from start to finish. Jeremy managed to help us sell our house completely off-market, which saved us an incredible amount of time and stress. What truly set him apart was his comprehensive management of the entire transaction. He flawlessly handled all the paperwork for both the sellers and the buyers, navigating the complexities of the process with total professionalism and transparency. Beyond the contracts and escrow, Jeremy went above and beyond by taking care of all interactions with the various contractors and vendors. We never had to worry about coordinating schedules or following up on progress — he handled it all. If you want a realtor who is proactive, organized, and truly takes the burden off your shoulders, we cannot recommend Jeremy highly enough!”',
    agentName: 'Jeremy McHone', agentPhoto: 'jeremy-mchone.png',
  },
  {
    quote: '“Corinne went above and beyond. We had been house hunting for months and she was always available every weekend to tour whatever listing we sent her way. She did her homework before each showing to provide us with the information we needed. She listened to our needs and would send listings our way that she found. She was always quick to respond and was consistently a dream to work with. We will be sending her name around to anyone we know who is house hunting!”',
    agentName: 'Corinne Mauro', agentPhoto: 'corinne-mauro.jpg',
  },
  {
    quote: '“We can’t recommend Jodi Kirkwood highly enough! She helped us both purchase our upstairs condo and sell our existing condo, and the entire experience was exceptional from start to finish. Her knowledge of the local market is outstanding, and her advice throughout the process was invaluable. She knew exactly how to position our condo, and thanks to her expertise, we received top dollar for our sale. What impressed us most was her attention to detail, market knowledge, and ability to navigate every challenge with confidence and ease. Buying and selling at the same time can be stressful, but she made the process smooth and manageable. We are incredibly grateful for all of her help and would absolutely work with her again.”',
    agentName: 'Jodi Kirkwood', agentPhoto: 'jodi-kirkwood.jpg',
  },
  {
    quote: '“Working with Katie was an amazing experience from start to finish. She is kind, patient, understanding, and truly listens to her clients. Throughout our home search, she took the time to understand exactly what we were looking for and never made us feel rushed or pressured. Katie was always professional, responsive, and available whenever we had questions or concerns. Her knowledge of the home-buying process gave us confidence every step of the way. What really stood out was how different she was from other realtors we had met — she genuinely cared about helping us find the right home and making sure we felt informed and supported. We would highly recommend her to anyone looking to buy or sell a home.”',
    agentName: 'Katie Lussier', agentPhoto: 'katie-lussier.jpg',
  },
  {
    quote: '“Chip was amazing from start to finish. He met with us ahead of listing the property and completed a very comprehensive interview about us and the property. He helped us set what turned out to be the perfect price point. He connected us with two staging resources that gave us a great ability to stage the property to reflect how much we loved it. He did a series of open houses that leveraged a great selling strategy, which was very successful and resulted in a sale in less than 3 weeks. He was a skilled negotiator with the buyer. We highly recommend Chip if you are looking for a realtor who is top shelf!”',
    agentName: 'Chip Morgan', agentPhoto: 'chip-morgan.jpg',
  },
]

export default function ReviewGallery({ reviews: externalReviews }: Props) {
  const displayReviews = externalReviews && externalReviews.length > 0 ? externalReviews : REVIEWS
  return (
    <section className="review-gallery" aria-labelledby="gallery-heading">
      <div className="section-header">
        <span className="section-eyebrow">Client Reviews</span>
        <h2 className="section-heading" id="gallery-heading">What Our Clients Are Sharing</h2>
        <p className="section-sub">Real reviews from real clients across San Diego.</p>
      </div>
      <div className="gallery-grid">
        {displayReviews.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </section>
  )
}
