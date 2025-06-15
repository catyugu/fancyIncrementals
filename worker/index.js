export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route for getting all users
    if (url.pathname === '/api/users' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM users').all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // Route for adding a new user
    if (url.pathname === '/api/users' && request.method === 'POST') {
      try {
        const userData = await request.json();
        if (!userData.name || !userData.email) {
          return new Response(JSON.stringify({ error: 'Name and email are required' }), { status: 400 });
        }

        const stmt = env.DB.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
        await stmt.bind(userData.name, userData.email).run();

        return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
      } catch (e) {
        // Handle potential unique constraint errors for email
        if (e.message.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
        }
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // If no API route is matched, return null to let Pages serve the frontend
    return env.ASSETS.fetch(request);
  },
};