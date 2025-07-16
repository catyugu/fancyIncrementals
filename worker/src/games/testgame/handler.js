import { generateHash, newResponse } from '../../utils';

// The hardcoded secret is removed. It will now be accessed from env.SAVE_SECRET.

export async function saveGame(request, env) {
    try {
        // We now get the secret from the environment variables.
        const SAVE_SECRET = env.SAVE_SECRET;
        if (!SAVE_SECRET) {
            throw new Error("SAVE_SECRET is not defined in the worker environment.");
        }

        const { email, ...gameState } = await request.json();
        if (!email) {
            return newResponse({ error: 'Email is required' }, 400);
        }

        const gameStateString = JSON.stringify(gameState);
        const hash = await generateHash(gameStateString, SAVE_SECRET);

        const saveData = {
            gameState: gameStateString,
            hash,
        };

        await env.GAME_SAVES_BUCKET.put(email, JSON.stringify(saveData));
        return newResponse({ message: 'Game saved successfully' });

    } catch (e) {
        // Log the error for debugging.
        console.error("Error in saveGame:", e.message);
        return newResponse({ error: e.message }, 500);
    }
}

export async function loadGame(request, env) {
    try {
        // We also get the secret from the environment variables here.
        const SAVE_SECRET = env.SAVE_SECRET;
        if (!SAVE_SECRET) {
            throw new Error("SAVE_SECRET is not defined in the worker environment.");
        }

        const url = new URL(request.url);
        const email = url.searchParams.get('email');
        if (!email) {
            return newResponse({ error: 'Email is required' }, 400);
        }

        const saveData = await env.GAME_SAVES_BUCKET.get(email);
        if (!saveData) {
            return newResponse({ error: 'No save data found for this email' }, 404);
        }

        const { gameState, hash } = JSON.parse(await saveData.text());
        const expectedHash = await generateHash(gameState, SAVE_SECRET);

        if (hash !== expectedHash) {
            return newResponse({ error: 'Save data has been tampered with!' }, 400);
        }

        return newResponse(JSON.parse(gameState));

    } catch (e) {
        // Log the error for debugging.
        console.error("Error in loadGame:", e.message);
        return newResponse({ error: e.message }, 500);
    }
}