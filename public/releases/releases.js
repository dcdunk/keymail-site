// Reads GitHub Releases for the app repo; release.sh publishes there, so this page never needs editing.
// ponytail: unauthenticated GitHub API, 60 requests/hour per visitor IP. Fine for a changelog.
(async () => {
  const list = document.getElementById('list');
  const fallback = 'See releases on GitHub.';
  try {
    const r = await fetch('https://api.github.com/repos/dcdunk/keymail-app/releases?per_page=50',
      { headers: { Accept: 'application/vnd.github.html+json' } });
    if (!r.ok) throw r.status;
    const rels = (await r.json()).filter(x => !x.draft);
    if (!rels.length) { list.innerHTML = '<p class="empty">No releases yet. The first one is on its way.</p>'; return; }
    list.innerHTML = '';
    rels.forEach((x, i) => {
      const el = document.createElement('article');
      el.className = 'rel'; el.id = x.tag_name;
      el.innerHTML = '<div class="meta"><a class="ver"></a><time></time></div><div class="body"></div>';
      const ver = el.querySelector('.ver');
      ver.textContent = x.tag_name; ver.href = '#' + x.tag_name;
      if (i === 0) ver.insertAdjacentHTML('afterend', '<span class="tag">Latest</span>');
      const t = el.querySelector('time');
      t.dateTime = x.published_at;
      t.textContent = new Date(x.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      el.querySelector('.body').innerHTML = '<h2></h2>' + (x.body_html || '<p>No notes for this release.</p>'); // body_html is sanitized by GitHub
      el.querySelector('h2').textContent = x.name || x.tag_name;
      list.append(el);
    });
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch {
    list.innerHTML = '<p class="empty">Couldn\'t load release notes. ' + fallback + '</p>';
  }
})();
