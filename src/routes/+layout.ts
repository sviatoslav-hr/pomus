export const prerender = true;
// HACK: This prevents layout flickering on page load because of localStorage-based config.
//       But, this also makes app prerender with blank page, which is sad.
//       Ideally, I would love to keep prerendering and maybe hide flickering parts on the UI during initial load.
export const ssr = false;
export const trailingSlash = 'always';
