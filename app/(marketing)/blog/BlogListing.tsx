'use client'

import { useState } from 'react'

export interface Post {
  s: string   // slug
  t: string   // title
  c: string   // category
  d: string   // display date
  iso: string
  x: string   // excerpt
  img?: string // cover image URL (optional — Sanity posts may have one)
}

interface Props {
  posts?: Post[]
}

const POSTS: Post[] = [
  {s:'what-to-look-for-when-buying-a-house',t:"What To Look For When Buying A House: A Complete Checklist",c:'Buyer',d:'May 23, 2026',iso:'2026-05-23',x:"Buying a home involves evaluating dozens of factors simultaneously. This comprehensive checklist helps you focus on what matters most so you don't miss critical details during tours."},
  {s:'should-you-buy-or-rent-a-home-right-now',t:"Should You Buy or Rent a Home Right Now?",c:'Buyer',d:'May 9, 2026',iso:'2026-05-09',x:"The buy-vs-rent debate is one of the most personal financial decisions you'll face. This breakdown helps you weigh the numbers and lifestyle factors to reach the right answer for you."},
  {s:'should-you-accept-the-first-offer-on-your-house',t:"Should You Accept the First Offer on Your House?",c:'Seller',d:'Apr 26, 2026',iso:'2026-04-26',x:"Receiving an offer quickly can feel exciting, but it raises an important question: is the first offer the best offer? Here's how to evaluate it objectively before deciding."},
  {s:'what-new-homeowners-wish-they-had-known-before-buying',t:"What New Homeowners Wish They Had Known Before Buying",c:'Buyer',d:'Apr 14, 2026',iso:'2026-04-14',x:"The learning curve of homeownership can be steep. These hard-earned lessons from new homeowners can help you avoid common surprises and feel more prepared for the journey ahead."},
  {s:'how-to-prepare-your-home-for-spring-showings',t:"How To Prepare Your Home for Spring Showings",c:'Seller',d:'Mar 31, 2026',iso:'2026-03-31',x:"Spring is peak selling season in San Diego. These targeted preparation strategies help your home shine when buyer activity is at its highest, maximizing both interest and offers."},
  {s:'what-is-equity-and-how-can-it-work-for-you',t:"What Is Home Equity and How Can It Work For You?",c:'Homeowner',d:'Mar 18, 2026',iso:'2026-03-18',x:"Home equity is one of the most powerful tools available to homeowners, but many don't fully understand how to leverage it. Here's a clear explanation of what it is and how to use it wisely."},
  {s:'the-san-diego-neighborhoods-worth-watching-in-2026',t:"The San Diego Neighborhoods Worth Watching in 2026",c:'Buyer',d:'Mar 4, 2026',iso:'2026-03-04',x:"Some of San Diego's most promising neighborhoods are still undervalued. This guide highlights emerging areas where lifestyle and investment potential align for smart buyers in 2026."},
  {s:'how-long-does-it-take-to-buy-a-home',t:"How Long Does It Actually Take To Buy A Home?",c:'Buyer',d:'Feb 19, 2026',iso:'2026-02-19',x:"Most buyers underestimate the timeline from initial search to closing day. Understanding the full process — and what can cause delays — helps you plan with realistic expectations."},
  {s:'mistakes-sellers-make-in-a-cooling-market',t:"5 Mistakes Sellers Make in a Cooling Market",c:'Seller',d:'Feb 5, 2026',iso:'2026-02-05',x:"As the market shifts, sellers who cling to peak-market strategies often pay the price. Avoiding these five mistakes can be the difference between a fast, profitable sale and a prolonged listing."},
  {s:'home-maintenance-checklist-for-new-homeowners',t:"The Essential Home Maintenance Checklist for New Homeowners",c:'Homeowner',d:'Jan 22, 2026',iso:'2026-01-22',x:"New homeowners are often surprised by how much regular maintenance a home requires. This checklist breaks it all down by season so nothing slips through the cracks."},
  {s:'understanding-escrow-a-guide-for-first-time-buyers',t:"Understanding Escrow: A Guide for First-Time Buyers",c:'Buyer',d:'Jan 8, 2026',iso:'2026-01-08',x:"Escrow is one of the most confusing parts of the home-buying process for first-timers. This plain-English guide explains what it is, who's involved, and what to expect."},
  {s:'how-to-negotiate-after-a-home-inspection',t:"How To Negotiate After a Home Inspection",c:'Buyer',d:'Dec 18, 2025',iso:'2025-12-18',x:"A home inspection almost always surfaces something. Knowing how to interpret the report and negotiate effectively can save you thousands — or protect you from a costly mistake."},
  {s:'what-does-a-real-estate-agent-actually-do',t:"What Does a Real Estate Agent Actually Do?",c:'General',d:'Dec 4, 2025',iso:'2025-12-04',x:"Many buyers and sellers don't fully understand what a real estate agent does or how they're compensated. This honest breakdown explains the value a skilled agent brings to every transaction."},
  {s:'top-red-flags-in-home-inspections',t:"Top Red Flags To Watch For in a Home Inspection",c:'Buyer',d:'Nov 19, 2025',iso:'2025-11-19',x:"Not all inspection findings are created equal. Knowing which issues are deal-breakers versus minor fixes helps you avoid overreacting — or missing something that could cost you dearly."},
  {s:'budget-friendly-home-improvement-projects-perfect-to-tackle-this-fall',t:"5 Budget-Friendly Home Improvement Projects Perfect to Tackle This Fall",c:'Homeowner',d:'Oct 5, 2025',iso:'2025-10-05',x:"Fall is the ideal season for tackling home improvement projects before winter arrives. These affordable updates add real value without requiring a major investment of time or money."},
  {s:'how-many-showings-does-it-take-to-sell-a-house',t:"How Many Showings Does It Take To Sell A House?",c:'Seller',d:'Sep 16, 2025',iso:'2025-09-16',x:"Sellers often wonder how many showings are normal before receiving an offer. The answer depends on your market, pricing, and presentation — all factors you can influence."},
  {s:'what-you-should-know-about-a-homes-hvac-system',t:"What You Should Know About A Home's HVAC System",c:'Homeowner',d:'Aug 31, 2025',iso:'2025-08-31',x:"Your home's HVAC system is one of its most expensive components. Understanding how it works, how to maintain it, and when to replace it can save you thousands of dollars."},
  {s:'should-you-buy-a-new-house-before-selling-your-old-one-lets-explore-the-pros-and-cons',t:"Should You Buy A New House Before Selling Your Old One? Pros and Cons",c:'Seller',d:'Aug 15, 2025',iso:'2025-08-15',x:"The buy-before-sell dilemma is one of the most common challenges for move-up buyers. This breakdown of the pros and cons helps you choose the right strategy for your situation."},
  {s:'safety-tips-to-keep-your-house-safe-during-a-renovation',t:"Safety Tips to Keep Your House Safe During A Renovation",c:'Homeowner',d:'Jul 29, 2025',iso:'2025-07-29',x:"Home renovations create excitement but also real hazards. Keeping your household and your contractors safe requires planning, communication, and awareness of common risks."},
  {s:'5-questions-to-ask-yourself-before-deciding-to-buy-a-house',t:"5 Questions to Ask Yourself Before Deciding To Buy A House",c:'Buyer',d:'Jun 30, 2025',iso:'2025-06-30',x:"Homeownership is one of life's biggest commitments. Asking yourself these five honest questions before you start searching can save you time, money, and stress."},
  {s:'what-is-an-accessory-dwelling-unit',t:"What is an Accessory Dwelling Unit?",c:'Homeowner',d:'Jun 5, 2025',iso:'2025-06-05',x:"Accessory dwelling units — also called ADUs, granny flats, or in-law suites — are becoming one of the most popular housing solutions in San Diego. Here's what you need to know."},
  {s:'signs-of-foundation-problems-on-a-house',t:"Don't Overlook These Signs of Foundation Problems on A House",c:'Buyer',d:'May 23, 2025',iso:'2025-05-23',x:"Foundation problems are among the most serious and costly issues a homeowner can face. Learning to spot the warning signs early can protect your investment and your safety."},
  {s:'5-ways-to-involve-your-children-in-the-home-buying-process',t:"5 Ways to Involve Your Children in The Home Buying Process",c:'Buyer',d:'Apr 15, 2025',iso:'2025-04-15',x:"Moving is a big transition for kids. Involving them in the home search process helps reduce anxiety, builds excitement, and makes the new house feel like their home too."},
  {s:'curb-appeal-projects-to-focus-on-if-you-want-to-sell-your-home-this-spring',t:"Curb Appeal Projects to Focus On If You Want To Sell Your Home This Spring",c:'Seller',d:'Mar 31, 2025',iso:'2025-03-31',x:"Spring is peak selling season, and first impressions start before buyers step through the door. These targeted curb appeal improvements maximize impact without exceeding your budget."},
  {s:'questions-to-ask-before-making-an-offer-on-a-house',t:"Don't Know How Much To Offer on A House? Let These Questions Guide You",c:'Buyer',d:'Mar 24, 2025',iso:'2025-03-24',x:"Determining the right offer price is part art, part science. These questions help you evaluate the home's true value and craft a competitive offer in any market condition."},
  {s:'7-signs-its-time-to-sell-your-house',t:"7 Huge Signs It's Time To Sell Your House",c:'Seller',d:'Mar 3, 2025',iso:'2025-03-03',x:"Knowing when it's the right time to sell your home is a deeply personal decision, but there are clear signals that the timing may be ideal for making your move."},
  {s:'guide-to-down-payment-assistance-programs',t:"Down Payment Assistance Programs: How Do They Work?",c:'Buyer',d:'Feb 12, 2025',iso:'2025-02-12',x:"For many aspiring homeowners, the down payment is the single biggest obstacle. Down payment assistance programs exist to bridge that gap — here's how they work and who qualifies."},
  {s:'5-expert-decluttering-methods-to-try-for-a-tidier-home',t:"From KonMari To 20/20: 5 Expert Decluttering Methods To Try",c:'Homeowner',d:'Jan 29, 2025',iso:'2025-01-29',x:"There's no one-size-fits-all solution to decluttering. Different methods work for different personalities. This roundup helps you find the approach that will stick for you."},
  {s:'closing-costs-associated-with-selling-your-home',t:"Planning To Sell? Don't Forget To Factor in These Closing Costs",c:'Seller',d:'Jan 17, 2025',iso:'2025-01-17',x:"Seller closing costs can take a significant bite out of your profit if you're not prepared. Here's a comprehensive look at what sellers should expect to pay at the closing table."},
  {s:'buyers-guide-to-homeownership-in-2025-part-2',t:"Buyers' Guide to Homeownership in 2025 [PART 2]",c:'Buyer',d:'Dec 27, 2024',iso:'2024-12-27',x:"Part 2 of our guide breaks down the step-by-step process of buying a home in 2025: from getting pre-approved to navigating inspections, negotiations, and closing day."},
  {s:'buyers-guide-to-homeownership-in-2025-part-1-2oVY1',t:"Buyers' Guide to Homeownership in 2025 [PART 1]",c:'Buyer',d:'Dec 26, 2024',iso:'2024-12-26',x:"Part 1 lays the foundation for your homeownership journey in 2025: assessing your finances, understanding the market, and setting realistic goals before you start searching."},
  {s:'what-to-know-about-buying-or-selling-a-home-in-winter',t:"What You Should Know About Buying or Selling A Home in Winter",c:'General',d:'Dec 5, 2024',iso:'2024-12-05',x:"The winter real estate market has unique advantages and challenges. Whether you're buying or selling, understanding the season's dynamics can lead to better outcomes."},
  {s:'pros-and-cons-of-buying-a-home-near-a-school',t:"Pros and Cons of Buying A Home Near A School",c:'Buyer',d:'Nov 18, 2024',iso:'2024-11-18',x:"Living near a school has real-world implications for daily life, noise levels, traffic, and property value. This balanced look helps you decide if it's the right fit."},
  {s:'5-common-issues-that-make-your-house-seem-haunted',t:"Think Your House Is Haunted? Here's What's Really Going On",c:'Homeowner',d:'Oct 31, 2024',iso:'2024-10-31',x:"Strange noises, flickering lights, and creaking floors don't mean ghosts — they often signal fixable maintenance issues. Here's how to diagnose and solve these spooky symptoms."},
  {s:'6-habits-of-successful-home-sellers',t:"6 Habits of Successful Home Sellers",c:'Seller',d:'Oct 21, 2024',iso:'2024-10-21',x:"The most successful sellers share common habits around pricing, presentation, and communication. Adopting these practices can help you sell faster and for more money."},
  {s:'5-reasons-to-buy-a-home-in-the-fall-full-infographic',t:"5 Reasons You'll Fall In Love Buying A Home in the Fall",c:'Buyer',d:'Sep 26, 2024',iso:'2024-09-26',x:"While spring gets all the attention, fall is quietly one of the best times to buy a home. Less competition, motivated sellers, and clearer views of the property all work in your favor."},
  {s:'heres-your-fall-cleanup-checklist-to-prep-your-yard-for-winter',t:"Here's Your Fall Cleanup Checklist To Prep Your Yard For Winter",c:'Homeowner',d:'Sep 13, 2024',iso:'2024-09-13',x:"Fall yard maintenance protects your landscaping investment and sets up your lawn for a lush spring. This checklist covers every task worth doing before winter arrives."},
  {s:'can-a-generator-add-value-to-your-home',t:"Can A Generator Add Value To Your Home?",c:'Homeowner',d:'Aug 29, 2024',iso:'2024-08-29',x:"As power outages become more frequent, whole-home generators are gaining appeal among buyers. Here's an honest look at the costs, benefits, and potential return on investment."},
  {s:'moving-to-a-new-state-dont-forget-to-add-these-tasks-to-your-to-do-list',t:"Moving To A New State? Don't Forget These Tasks",c:'Buyer',d:'Aug 20, 2024',iso:'2024-08-20',x:"Relocating across state lines involves a whole new checklist beyond the usual move. From updating your license to registering your vehicle, here's what you need to handle first."},
  {s:'7-little-ways-you-can-upgrade-your-bathroom',t:"7 Little Ways You Can Upgrade Your Bathroom (Without Draining Your Savings)",c:'Homeowner',d:'Jul 30, 2024',iso:'2024-07-30',x:"A full bathroom remodel isn't always necessary to make a big impact. These seven targeted upgrades deliver a fresh, modern look at a fraction of the cost of a full renovation."},
  {s:'here-are-5-issues-that-could-delay-your-real-estate-closing',t:"Heads Up! 5 Issues That Could Delay Your Real Estate Closing",c:'Buyer',d:'Jul 11, 2024',iso:'2024-07-11',x:"Even after both parties agree on a price, the road to closing can have unexpected bumps. Knowing these common delay triggers helps you stay prepared and keep things on track."},
  {s:'what-to-love-and-hate-about-corner-lots-factors-to-consider-before-buying',t:"What To Love (and Hate) About Corner Lots Before Buying",c:'Buyer',d:'Jun 21, 2024',iso:'2024-06-21',x:"Corner lots offer extra space and curb appeal, but they also come with more maintenance and potential noise. This balanced guide helps you decide if a corner lot is right for you."},
  {s:'does-a-swimming-pool-boost-or-hurt-your-homes-value',t:"Does A Swimming Pool Boost or Hurt Your Home's Value?",c:'Homeowner',d:'Jun 7, 2024',iso:'2024-06-07',x:"A pool can be a dream feature or a deal-breaker depending on the buyer. Here's an honest assessment of how a swimming pool affects your home's value in the San Diego market."},
  {s:'3-huge-signs-a-home-buyer-isnt-serious',t:"3 Huge Signs A Home Buyer Isn't Serious",c:'Seller',d:'May 24, 2024',iso:'2024-05-24',x:"Not every buyer who shows interest in your home is ready to buy. Learning to recognize low-commitment signals early saves you time and helps you focus on serious prospects."},
  {s:'homeowners-heres-your-maintenance-and-safety-checklist-for-may',t:"Homeowners, Here's Your Maintenance and Safety Checklist for May",c:'Homeowner',d:'Apr 30, 2024',iso:'2024-04-30',x:"May is a great month to tackle home maintenance tasks before summer heat arrives. This checklist keeps your home safe, efficient, and well-protected through the warmer months."},
]

const BADGE_MAP: Record<string, string> = {
  Buyer: 'Buyer', Seller: 'Seller', Homeowner: 'Homeowner',
  General: 'General', 'New Homeowner': 'NewHomeowner', Parents: 'Parents',
}
const FB_IMG = 'https://placehold.co/800x533/58172a/eeca00?text=Palisade+Realty'
const PER_PAGE = 15
const CATEGORIES = ['All Posts', 'Buyer', 'Seller', 'Homeowner', 'General']

export default function BlogListing({ posts: externalPosts }: Props) {
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(1)

  const allPosts = externalPosts && externalPosts.length > 0 ? externalPosts : POSTS
  const filtered = cat === 'all' ? allPosts : allPosts.filter((p) => p.c === cat)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)



  function handleCat(newCat: string) {
    setCat(newCat)
    setPage(1)
  }

  function handlePage(n: number) {
    setPage(n)
    document.querySelector('.blog-listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="blog-listing" aria-label="Blog articles">
      <div className="blog-filter" role="group" aria-label="Filter posts by category">
        {CATEGORIES.map((label) => {
          const key = label === 'All Posts' ? 'all' : label
          return (
            <button
              key={key}
              className={`bf-tab${cat === key ? ' active' : ''}`}
              data-cat={key}
              onClick={() => handleCat(key)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="blog-grid" id="blog-grid" role="list" aria-live="polite" aria-label="Blog posts">
        {pagePosts.length === 0 ? (
          <p className="blog-no-results">No posts found in this category.</p>
        ) : (
          pagePosts.map((p) => {
            const badgeKey = BADGE_MAP[p.c] || 'default'
            return (
              <article key={p.s} className="bc reveal" role="listitem" data-cat={p.c}>
                <a href={`/blog/${p.s}`} className="bc-link" aria-label={p.t}>
                  <div className="bc-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img ?? `/images/blog/${p.s}.jpg`}
                      alt={p.t}
                      loading="lazy"
                      width={800}
                      height={533}
                      onError={(e) => { (e.target as HTMLImageElement).src = FB_IMG }}
                    />
                  </div>
                  <div className="bc-body">
                    <div className="bc-meta">
                      {p.c && <span className={`bc-badge bc-badge--${badgeKey}`}>{p.c}</span>}
                      <time className="bc-date" dateTime={p.iso}>{p.d}</time>
                    </div>
                    <h2 className="bc-title">{p.t}</h2>
                    <p className="bc-excerpt">{p.x}</p>
                    <span className="bc-read-more" aria-hidden="true">Read More →</span>
                  </div>
                </a>
              </article>
            )
          })
        )}
      </div>

      {totalPages > 1 && (
        <nav className="blog-pagination" id="blog-pagination" aria-label="Blog pagination">
          <button
            className="bp-btn bp-arrow"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => handlePage(page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`bp-btn${n === page ? ' active' : ''}`}
              aria-label={`Page ${n}`}
              aria-current={n === page ? 'page' : undefined}
              onClick={() => handlePage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="bp-btn bp-arrow"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => handlePage(page + 1)}
          >
            ›
          </button>
          <span className="bp-info">Page {page} of {totalPages}</span>
        </nav>
      )}
    </section>
  )
}
