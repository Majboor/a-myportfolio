import React from 'react'

// A/B landing hero. Variant A is the original narrative hero; variant B is an
// alternate, punchier "terminal" layout with a distinct headline, structure and
// CTA. Toggle live with the pill, or link straight to a variant via ?variant=b.
// Icons/paths are passed in from App so both variants share one icon source.

function VariantToggle({ variant, setVariant }) {
  return (
    <div className="variant-toggle" role="group" aria-label="Landing layout variant">
      <span className="variant-toggle-label">Layout</span>
      <button
        type="button"
        className={variant === 'a' ? 'is-active' : ''}
        aria-pressed={variant === 'a'}
        onClick={() => setVariant('a')}
      >
        A
      </button>
      <button
        type="button"
        className={variant === 'b' ? 'is-active' : ''}
        aria-pressed={variant === 'b'}
        onClick={() => setVariant('b')}
      >
        B
      </button>
    </div>
  )
}

function HeroA({ stats, Icon, ICON, toggle }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {toggle}
      <p className="eyebrow">Full-stack &amp; AI developer</p>
      <h1 id="hero-title">
        I build fast, polished web products —
        <span className="grad"> from 3D storefronts to AI apps.</span>
      </h1>
      <p className="lede">
        I'm Waleed Ajmal. I ship end-to-end: designing the interface, wiring the API,
        and folding in AI and real-time 3D where it actually earns its place. Below is a
        selection of things I've built and put online.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#work">
          See my work <Icon path={ICON.arrow} />
        </a>
        <a className="btn btn-ghost" href="https://github.com/waleedsworld" target="_blank" rel="noreferrer">
          <Icon path={ICON.github} /> GitHub
        </a>
      </div>
      <ul className="stat-strip">
        {stats.map((s) => (
          <li key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HeroB({ stats, Icon, ICON, toggle }) {
  return (
    <section className="hero hero-b" aria-labelledby="hero-title">
      {toggle}
      <div className="hero-b-grid">
        <div className="hero-b-copy">
          <p className="eyebrow eyebrow-b">
            <span className="dot" aria-hidden="true" /> Open to freelance &amp; collaboration
          </p>
          <h1 id="hero-title">
            Ship the thing.
            <span className="grad"> I turn rough ideas into products people can open.</span>
          </h1>
          <p className="lede">
            Full-stack &amp; AI engineer. React on the front, Python and Node on the back,
            AI and real-time 3D where they earn their place — designed, built and deployed
            end-to-end.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#contact">
              Start a project <Icon path={ICON.arrow} />
            </a>
            <a className="btn btn-ghost" href="#work">
              Browse the work
            </a>
          </div>
          <ul className="stat-inline">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong> <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="hero-b-terminal" aria-hidden="true">
          <div className="term-bar">
            <span className="term-dot term-red" />
            <span className="term-dot term-amber" />
            <span className="term-dot term-green" />
            <span className="term-title">waleed@waleeds.world: ~</span>
          </div>
          <pre className="term-body">
{`$ whoami
waleed-ajmal — full-stack & AI dev

$ ls ./ships
techrealm/    dsm-3d-store/
voronova-ai/  preservemy-world/
walletwala/   homely-hues/

$ cat stack.txt
react · typescript · three.js
python · flask · fastapi · node
llms · vision · gaussian-splats

$ deploy --status
`}
            <span className="term-ok">● live on cloudflare + aws</span>
            <span className="term-cursor">▋</span>
          </pre>
        </aside>
      </div>
    </section>
  )
}

export default function Hero({ variant, setVariant, stats, Icon, ICON }) {
  const toggle = <VariantToggle variant={variant} setVariant={setVariant} />
  const props = { stats, Icon, ICON, toggle }
  return variant === 'b' ? <HeroB {...props} /> : <HeroA {...props} />
}
