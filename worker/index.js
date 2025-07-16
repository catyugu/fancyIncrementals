export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/save' && request.method === 'POST') {
      try {
        const { email, score } = await request.json();
        if (!email || typeof score !== 'number') {
          return new Response(JSON.stringify({ error: 'Email and score are required' }), { status: 400 });
        }

        const stmt = env.DB.prepare('INSERT OR REPLACE INTO test_game_saves (email, score) VALUES (?, ?)');
        await stmt.bind(email, score).run();

        return new Response(JSON.stringify({ message: 'Game saved successfully' }), { status: 200 });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    if (url.pathname === '/api/load' && request.method === 'GET') {
      try {
        const email = url.searchParams.get('email');
        if (!email) {
          return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        const stmt = env.DB.prepare('SELECT score FROM test_game_saves WHERE email = ?');
        const result = await stmt.bind(email).first();

        if (result) {
          return new Response(JSON.stringify({ score: result.score }), {
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ error: 'No save data found for this email' }), { status: 404 });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  },
};