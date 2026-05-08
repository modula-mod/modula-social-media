<script lang="ts">
  type View = 'feed' | 'messages' | 'explore' | 'notifications' | 'reels';

  let view: View = 'feed';
  let theme = 'dark';
  let accent = '#16d99a';
  let composer = '';

  const nav: { id: View; label: string; detail: string }[] = [
    { id: 'feed', label: 'Feed', detail: 'Live identity graph' },
    { id: 'messages', label: 'Messages', detail: 'Private threads' },
    { id: 'explore', label: 'Explore', detail: 'Network discovery' },
    { id: 'notifications', label: 'Alerts', detail: 'Runtime events' },
    { id: 'reels', label: 'Reels', detail: 'Short-form surface' }
  ];

  const posts = [
    {
      author: 'Andrei Milea',
      handle: '@andrei',
      role: 'Module owner',
      time: 'now',
      title: 'Social now runs as a compiled Svelte module.',
      body: 'The GitHub release ships frontend/dist, Modula serves that static folder, and the main Open WebUI frontend stays untouched during module updates.',
      tags: ['runtime', 'github', 'svelte'],
      score: '98',
      accent: 'hot'
    },
    {
      author: 'AKI Verifier',
      handle: '@aki',
      role: 'Trust layer',
      time: '12m',
      title: 'Provenance check passed.',
      body: 'Installed package source, resolved frontend entry, active version, and static asset root are separated into inspectable runtime metadata.',
      tags: ['evidence', 'policy'],
      score: '96',
      accent: 'safe'
    },
    {
      author: 'GAIA Runtime',
      handle: '@gaia',
      role: 'Execution layer',
      time: '31m',
      title: 'Rollback path remains clean.',
      body: 'Switching from one installed release folder to another changes the module URL version, not the host application build.',
      tags: ['rollback', 'ops'],
      score: '91',
      accent: 'ops'
    }
  ];

  const messages = [
    ['Marketplace Review', 'Release artifact contains frontend/dist and backend contracts.', '2m'],
    ['Publisher Ops', 'social-media v1.4.1 can be promoted after visual QA.', '18m'],
    ['Design System', 'Token sync received from parent Modula shell.', '44m']
  ];

  const notices = [
    ['Runtime frontend', 'Resolved from frontend/dist/index.html'],
    ['Static assets', 'Serving module-local JS and CSS'],
    ['Host rebuild', 'Not required for future module updates'],
    ['Sandbox mode', 'Active for marketplace package']
  ];

  function viewFromRoute(route: string): View {
    if (route.includes('/messages')) return 'messages';
    if (route.includes('/explore')) return 'explore';
    if (route.includes('/notifications')) return 'notifications';
    if (route.includes('/reels')) return 'reels';
    return 'feed';
  }

  function publish() {
    composer = '';
  }

  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'MODULA_THEME_SYNC') {
      theme = data.theme === 'light' ? 'light' : 'dark';
      const nextAccent = data.colors?.['--accent-primary'];
      if (nextAccent) accent = nextAccent.trim();
    }
    if (data.type === 'MODULA_SURFACE_CONTEXT') {
      view = viewFromRoute(String(data.route || ''));
    }
  });
</script>

<svelte:head>
  <style>
    :root {
      color-scheme: dark;
      --module-bg: #050706;
      --module-panel: rgba(14, 18, 16, 0.92);
      --module-panel-2: rgba(19, 26, 23, 0.9);
      --module-line: rgba(255, 255, 255, 0.1);
      --module-text: #effaf5;
      --module-muted: rgba(239, 250, 245, 0.62);
      --module-accent: #16d99a;
      --module-warn: #f4bf50;
      --module-danger: #ef5d6f;
      --module-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
    }

    :root[data-module-theme='light'] {
      color-scheme: light;
      --module-bg: #f4f8f5;
      --module-panel: rgba(255, 255, 255, 0.92);
      --module-panel-2: rgba(245, 250, 247, 0.96);
      --module-line: rgba(15, 23, 42, 0.11);
      --module-text: #0d1712;
      --module-muted: rgba(28, 39, 34, 0.64);
      --module-shadow: 0 26px 70px rgba(15, 23, 42, 0.14);
    }
  </style>
</svelte:head>

<div class="app" data-theme={theme} style={`--module-accent:${accent}`}>
  <aside class="rail">
    <div class="brand">
      <div class="brand-mark">M</div>
      <div>
        <div class="eyebrow">GitHub module</div>
        <strong>Social Media</strong>
      </div>
    </div>

    <nav class="nav" aria-label="Social surfaces">
      {#each nav as item}
        <button class:active={view === item.id} on:click={() => (view = item.id)}>
          <span>{item.label}</span>
          <small>{item.detail}</small>
        </button>
      {/each}
    </nav>

    <div class="release-card">
      <span>Release</span>
      <strong>v1.4.1</strong>
      <small>frontend/dist</small>
    </div>
  </aside>

  <main class="main">
    <section class="hero">
      <div>
        <div class="eyebrow">Sandbox surface</div>
        <h1>{nav.find((item) => item.id === view)?.label ?? 'Social'}</h1>
        <p>Compiled Svelte module loaded from the marketplace release folder. Designed to feel native to Modula without rebuilding the host.</p>
      </div>
      <div class="hero-actions">
        <button>Inspect runtime</button>
        <button class="primary">New post</button>
      </div>
    </section>

    {#if view === 'feed'}
      <section class="composer">
        <textarea bind:value={composer} placeholder="Publish into your Modula identity graph..." />
        <div class="composer-row">
          <span>Public</span><span>Media</span><span>AKI verify</span>
          <button on:click={publish} disabled={!composer.trim()}>Publish</button>
        </div>
      </section>

      <section class="feed-grid">
        <div class="posts">
          {#each posts as post}
            <article class={`post ${post.accent}`}>
              <div class="post-head">
                <div class="avatar">{post.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.handle} · {post.role} · {post.time}</span>
                </div>
                <div class="score">{post.score}</div>
              </div>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <div class="tags">{#each post.tags as tag}<span>#{tag}</span>{/each}</div>
              <div class="actions"><button>Reply</button><button>Boost</button><button>Love</button><button>Share</button></div>
            </article>
          {/each}
        </div>

        <aside class="side-stack">
          <div class="panel stats">
            <div><span>Reach</span><strong>81%</strong></div>
            <div><span>Trust</span><strong>96</strong></div>
            <div><span>Signals</span><strong>438</strong></div>
          </div>
          <div class="panel">
            <div class="panel-title">Suggested</div>
            {#each ['GAIA Builder', 'AKI Verifier', 'DIMON Ledger'] as person}
              <div class="person"><span>{person}</span><button>Follow</button></div>
            {/each}
          </div>
        </aside>
      </section>
    {:else if view === 'messages'}
      <section class="cards three">
        {#each messages as message}
          <article class="message"><strong>{message[0]}</strong><p>{message[1]}</p><span>{message[2]}</span></article>
        {/each}
      </section>
    {:else if view === 'explore'}
      <section class="cards topics">
        {#each ['#ModulaOS', '#GitHubOnly', '#SvelteRuntime', '#ProfileFirst', '#Marketplace'] as topic, index}
          <article class="topic"><span>0{index + 1}</span><strong>{topic}</strong><p>{(index + 2) * 19}k graph signals</p></article>
        {/each}
      </section>
    {:else if view === 'notifications'}
      <section class="cards two">
        {#each notices as notice}
          <article class="notice"><span></span><div><strong>{notice[0]}</strong><p>{notice[1]}</p></div></article>
        {/each}
      </section>
    {:else}
      <section class="reels">
        {#each ['Runtime launch', 'Compiled Svelte', 'Rollback ready'] as reel}
          <article><strong>{reel}</strong><p>Short-form module surface</p></article>
        {/each}
      </section>
    {/if}
  </main>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html), :global(body), :global(#app) { margin: 0; min-height: 100%; background: transparent; color: var(--module-text); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(body) { overflow: hidden; }

  .app { min-height: 100vh; width: 100%; padding: 18px; display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 18px; background: radial-gradient(circle at 16% 6%, color-mix(in srgb, var(--module-accent) 22%, transparent), transparent 28%), radial-gradient(circle at 88% 4%, rgba(255,255,255,0.08), transparent 24%), var(--module-bg); color: var(--module-text); }
  .app[data-theme='light'] { background: radial-gradient(circle at 16% 6%, color-mix(in srgb, var(--module-accent) 18%, transparent), transparent 30%), var(--module-bg); }
  button { border: 0; color: inherit; font: inherit; cursor: pointer; }
  .eyebrow { color: var(--module-muted); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
  .rail, .hero, .composer, .post, .panel, .message, .topic, .notice, .reels article { border: 1px solid var(--module-line); background: linear-gradient(180deg, var(--module-panel), var(--module-panel-2)); box-shadow: var(--module-shadow); }
  .rail { border-radius: 30px; padding: 16px; display: flex; flex-direction: column; gap: 18px; min-height: calc(100vh - 36px); }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 42px; height: 42px; border-radius: 16px; display: grid; place-items: center; background: var(--module-accent); color: #02110b; font-weight: 900; }
  .nav { display: grid; gap: 8px; }
  .nav button { text-align: left; border-radius: 18px; background: transparent; padding: 12px; color: var(--module-muted); }
  .nav button span { display: block; color: var(--module-text); font-weight: 750; }
  .nav button small { display: block; margin-top: 3px; }
  .nav button.active { background: color-mix(in srgb, var(--module-accent) 14%, transparent); outline: 1px solid color-mix(in srgb, var(--module-accent) 38%, transparent); }
  .release-card { margin-top: auto; border-radius: 22px; padding: 14px; background: color-mix(in srgb, var(--module-accent) 12%, transparent); border: 1px solid color-mix(in srgb, var(--module-accent) 28%, transparent); }
  .release-card span, .release-card small { display: block; color: var(--module-muted); }
  .release-card strong { display: block; font-size: 26px; letter-spacing: -0.04em; margin: 4px 0; }
  .main { min-width: 0; display: grid; align-content: start; gap: 18px; }
  .hero { border-radius: 34px; padding: 24px; display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; overflow: hidden; position: relative; }
  .hero:after { content: ''; position: absolute; inset: auto -8% -70% 42%; height: 240px; background: radial-gradient(circle, color-mix(in srgb, var(--module-accent) 30%, transparent), transparent 62%); pointer-events: none; }
  h1 { margin: 8px 0 0; font-size: clamp(38px, 6vw, 74px); line-height: 0.88; letter-spacing: -0.075em; }
  .hero p { max-width: 720px; color: var(--module-muted); line-height: 1.65; margin: 16px 0 0; }
  .hero-actions { display: flex; gap: 10px; position: relative; z-index: 1; }
  .hero-actions button, .composer button, .person button { border-radius: 999px; padding: 10px 13px; background: rgba(255,255,255,0.08); border: 1px solid var(--module-line); }
  .hero-actions .primary, .composer button { background: var(--module-accent); color: #02110b; font-weight: 850; }
  .composer { border-radius: 28px; padding: 16px; }
  textarea { width: 100%; min-height: 86px; resize: vertical; background: rgba(255,255,255,0.045); border: 1px solid var(--module-line); border-radius: 22px; color: var(--module-text); padding: 14px; outline: none; }
  .composer-row { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .composer-row span { border: 1px solid var(--module-line); color: var(--module-muted); padding: 8px 10px; border-radius: 999px; font-size: 13px; }
  .composer-row button { margin-left: auto; }
  .feed-grid { display: grid; grid-template-columns: minmax(0, 1fr) 310px; gap: 18px; align-items: start; }
  .posts, .side-stack, .cards, .reels { display: grid; gap: 14px; }
  .post { border-radius: 30px; padding: 18px; }
  .post-head { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 48px; height: 48px; border-radius: 18px; background: linear-gradient(135deg, var(--module-accent), color-mix(in srgb, var(--module-accent) 18%, #020806)); display: grid; place-items: center; color: #02110b; font-weight: 900; }
  .post-head span, .post p, .message p, .topic p, .notice p { color: var(--module-muted); }
  .score { margin-left: auto; width: 42px; height: 42px; border-radius: 999px; display: grid; place-items: center; background: color-mix(in srgb, var(--module-accent) 16%, transparent); color: var(--module-accent); font-weight: 900; }
  .post h2 { margin: 16px 0 8px; font-size: 24px; letter-spacing: -0.035em; }
  .post p { line-height: 1.6; }
  .tags, .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .tags span, .actions button { border-radius: 999px; padding: 8px 10px; background: rgba(255,255,255,0.06); color: var(--module-muted); }
  .panel { border-radius: 28px; padding: 16px; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .stats div { border-radius: 20px; background: rgba(255,255,255,0.055); padding: 12px; }
  .stats span { color: var(--module-muted); font-size: 12px; }
  .stats strong { display: block; margin-top: 6px; font-size: 24px; }
  .panel-title { color: var(--module-muted); text-transform: uppercase; letter-spacing: 0.18em; font-size: 11px; margin-bottom: 10px; }
  .person { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid var(--module-line); }
  .person:first-of-type { border-top: 0; }
  .cards.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cards.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .cards.topics { grid-template-columns: repeat(5, minmax(150px, 1fr)); }
  .message, .topic, .notice { border-radius: 28px; padding: 18px; min-height: 160px; }
  .topic span { color: var(--module-accent); font-weight: 900; }
  .notice { display: flex; gap: 12px; min-height: 120px; }
  .notice > span { width: 12px; height: 12px; margin-top: 4px; border-radius: 999px; background: var(--module-accent); box-shadow: 0 0 0 8px color-mix(in srgb, var(--module-accent) 12%, transparent); }
  .reels { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .reels article { border-radius: 34px; min-height: 360px; padding: 20px; display: flex; flex-direction: column; justify-content: flex-end; background: radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--module-accent) 24%, transparent), transparent 42%), linear-gradient(180deg, var(--module-panel), var(--module-panel-2)); }
  .reels strong { font-size: 28px; letter-spacing: -0.045em; }
  .reels p { color: var(--module-muted); }

  @media (max-width: 1180px) {
    .app { grid-template-columns: 1fr; }
    .rail { min-height: auto; }
    .nav { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .release-card { display: none; }
  }
  @media (max-width: 860px) {
    .app { padding: 10px; }
    .hero, .feed-grid { grid-template-columns: 1fr; display: grid; }
    .cards.two, .cards.three, .cards.topics, .reels { grid-template-columns: 1fr; }
    .nav { grid-template-columns: 1fr 1fr; }
    .hero-actions { flex-wrap: wrap; }
  }
</style>
