// Static assets are served by the Cloudflare Vite plugin. No remote bindings.
export default {
  fetch() {
    return new Response('Not found', { status: 404 });
  },
};
