/* Carry non-personal campaign labels to the Play install referrer.
   No cookies, storage, visitor IDs, analytics SDK or network requests. */
(() => {
  const incoming = new URLSearchParams(location.search);
  const sources = new Set(['instagram', 'facebook', 'youtube', 'toumari_site']);
  const media = new Set(['social', 'referral', 'cpc']);
  const safeLabel = value => /^[a-z0-9_-]{1,80}$/.test(value || '') ? value : null;
  const campaign = new URLSearchParams({
    utm_source: sources.has(incoming.get('utm_source')) ? incoming.get('utm_source') : 'toumari_site',
    utm_medium: media.has(incoming.get('utm_medium')) ? incoming.get('utm_medium') : 'referral',
    utm_campaign: safeLabel(incoming.get('utm_campaign')) || 'studio_hub'
  });
  const content = safeLabel(incoming.get('utm_content'));
  if (content) campaign.set('utm_content', content);
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.origin === 'https://play.google.com' && url.pathname === '/store/apps/details' &&
        ['com.toumari.parcelplatform.makeroom', 'com.afterglow.puzzle'].includes(url.searchParams.get('id'))) {
      url.searchParams.set('referrer', campaign.toString());
      link.href = url.href;
    }
  }
})();
