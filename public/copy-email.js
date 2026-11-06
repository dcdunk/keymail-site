// Some Macs have no app set up for email links, so a mailto click does nothing. Copy the address too.
document.querySelectorAll('a[href^="mailto:"].btn').forEach(b => b.addEventListener('click', async () => {
  const label = b.textContent;
  const addr = b.href.slice(7);
  try { await navigator.clipboard.writeText(addr); }
  catch { // older fallback when the Clipboard API is refused
    const t = Object.assign(document.createElement('textarea'), { value: addr });
    document.body.append(t); t.select();
    const ok = document.execCommand('copy'); t.remove();
    if (!ok) return;
  }
  b.textContent = 'Email address copied';
  setTimeout(() => { b.textContent = label; }, 2500);
}));
