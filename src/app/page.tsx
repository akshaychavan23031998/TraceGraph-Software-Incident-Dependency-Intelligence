export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-6 py-16 sm:px-10">
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-16 flex items-center gap-3 text-sm font-medium tracking-wide text-slate-300">
          <span className="logo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          TraceGraph
        </header>

        <section className="max-w-4xl">
          <div className="badge">
            <span className="badge-dot" />
            Powered by CognoDB
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.045em] text-white sm:text-7xl lg:text-8xl">
            Trace<span className="text-gradient">Graph</span>
          </h1>
          <p className="mt-5 text-xl font-medium text-slate-300 sm:text-2xl">
            Software Incident &amp; Dependency Intelligence
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Explore service dependencies, investigate incidents, and understand
            system blast radius using graph-powered insights.
          </p>
        </section>

        <section className="intelligence-card mt-14" aria-labelledby="intelligence-title">
          <div className="card-grid" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow">Coming next</p>
            <h2 id="intelligence-title" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              System Dependency Intelligence
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-400">
              The interactive dependency explorer is coming next, bringing your
              services and their relationships into focus.
            </p>
          </div>
          <div className="node-preview" aria-hidden="true">
            <span className="node node-a" />
            <span className="node node-b" />
            <span className="node node-c" />
            <span className="edge edge-a" />
            <span className="edge edge-b" />
          </div>
        </section>
      </div>
    </main>
  );
}

