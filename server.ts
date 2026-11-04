import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure Gemini key exists
const geminiApiKey = process.env.GEMINI_API_KEY || '';

const ai = geminiApiKey 
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory User and Session Store
  const users = new Map<string, { id: string; name: string; email: string; password?: string; picture?: string }>();
  const sessions = new Map<string, { id: string; name: string; email: string; picture?: string }>();

  // Seed default credential for testing/evaluation
  users.set('test@ferrari.com', {
    id: 'usr_test',
    name: 'Scuderia Guest',
    email: 'test@ferrari.com',
    password: 'password123',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });

  // Middleware to authenticate Bearer tokens or cookies
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.cookie || '';
      const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => {
        const parts = c.split('=');
        return [parts[0].trim(), parts.slice(1).join('=')];
      })) : {};
      token = cookies.session_token || '';
    }

    if (token && sessions.has(token)) {
      (req as any).user = sessions.get(token);
    }
    next();
  });

  // Auth Endpoint: Get Current User
  app.get('/api/auth/me', (req, res) => {
    if ((req as any).user) {
      return res.json({ user: (req as any).user });
    }
    return res.status(401).json({ error: 'Not authenticated' });
  });

  // Auth Endpoint: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (users.has(email.toLowerCase())) {
      return res.status(400).json({ error: 'Account with this email already exists.' });
    }
    const id = 'usr_' + Math.random().toString(36).substring(2, 11);
    const newUser = { id, name, email: email.toLowerCase(), password };
    users.set(email.toLowerCase(), newUser);

    // Auto-login after registration
    const token = 'tok_' + Math.random().toString(36).substring(2, 17);
    sessions.set(token, { id, name, email: newUser.email });

    res.cookie('session_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({ user: { id, name, email: newUser.email }, token });
  });

  // Auth Endpoint: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = users.get(email.toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = 'tok_' + Math.random().toString(36).substring(2, 17);
    sessions.set(token, { id: user.id, name: user.name, email: user.email, picture: user.picture });

    res.cookie('session_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, picture: user.picture }, token });
  });

  // Auth Endpoint: Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.cookie || '';
      const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => {
        const parts = c.split('=');
        return [parts[0].trim(), parts.slice(1).join('=')];
      })) : {};
      token = cookies.session_token || '';
    }

    if (token) {
      sessions.delete(token);
    }
    res.clearCookie('session_token', { secure: true, sameSite: 'none' });
    return res.json({ success: true });
  });

  // Google OAuth configuration
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  // Google OAuth URL Generation
  app.get('/api/auth/url', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;
    const redirectUri = `${appUrl}/auth/callback`;

    if (!googleClientId) {
      return res.json({
        enabled: false,
        error: 'Google OAuth is not configured in the server environment.'
      });
    }

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return res.json({ enabled: true, url: authUrl });
  });

  // Google OAuth Callback Handler
  const handleGoogleCallback = async (req: express.Request, res: express.Response) => {
    const { code, error } = req.query;
    if (error) {
      return res.send(`
        <html>
          <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
            <div style="text-align:center;border:1px solid #333;padding:2rem;border-radius:1rem;background:#111;">
              <h3 style="color:#ef4444;">AUTHENTICATION ERROR</h3>
              <p>${error}</p>
              <button onclick="window.close()" style="background:#ef4444;color:#fff;border:none;padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_FAILURE', error: "${error}" }, '*');
                setTimeout(() => window.close(), 3000);
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send('No authorization code provided');
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;
    const redirectUri = `${appUrl}/auth/callback`;

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        }).toString()
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${errText}`);
      }

      const tokens = await tokenResponse.json();
      const accessToken = tokens.access_token;

      // Fetch user info using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch Google user info');
      }

      const googleUser = await userInfoResponse.json();

      const email = googleUser.email.toLowerCase();
      const name = googleUser.name;
      const picture = googleUser.picture;

      // Create or update user in memory
      let user = users.get(email);
      if (!user) {
        const id = 'usr_' + Math.random().toString(36).substring(2, 11);
        user = { id, name, email, picture };
        users.set(email, user);
      } else if (picture) {
        user.picture = picture;
      }

      // Establish session
      const token = 'tok_' + Math.random().toString(36).substring(2, 17);
      sessions.set(token, { id: user.id, name: user.name, email: user.email, picture: user.picture });

      // Set cookie
      res.cookie('session_token', token, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      const userJson = JSON.stringify({ id: user.id, name: user.name, email: user.email, picture: user.picture });

      res.send(`
        <html>
          <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
            <div style="text-align:center;border:1px solid #333;padding:2rem;border-radius:1rem;background:#111;max-width:400px;width:90%;">
              <img src="${picture || ''}" style="width:80px;height:80px;border-radius:50%;border:2px solid #ef4444;margin-bottom:1rem;object-fit:cover;"/>
              <h3 style="color:#ef4444;margin:0 0 0.5rem 0;">AUTHENTICATION SUCCESSFUL</h3>
              <p style="margin:0 0 1rem 0;color:#bbb;font-size:14px;">Welcome to the Ferrari Atelier, <strong>${name}</strong>.</p>
              <p style="font-size:12px;color:#666;">This window will close automatically...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: ${userJson}, 
                  token: "${token}" 
                }, '*');
                setTimeout(() => window.close(), 1500);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Google OAuth callback error:', err);
      res.send(`
        <html>
          <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
            <div style="text-align:center;border:1px solid #333;padding:2rem;border-radius:1rem;background:#111;max-width:400px;width:90%;">
              <h3 style="color:#ef4444;">EXCHANGE ERROR</h3>
              <p style="color:#bbb;">${err.message}</p>
              <button onclick="window.close()" style="background:#ef4444;color:#fff;border:none;padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer;margin-top:1rem;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_FAILURE', error: "${err.message}" }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  app.get('/auth/callback', handleGoogleCallback);
  app.get('/auth/callback/', handleGoogleCallback);

  // API Route: AI-powered Car Recommendation
  app.post('/api/recommend', async (req, res) => {
    try {
      const { budget, lifestyle, preference, description, carModelsList } = req.body;

      if (!ai) {
        return res.status(503).json({
          error: 'AI Recommendation service is currently unavailable. No Gemini API key provided on the server. Please check your Secrets in Settings.',
        });
      }

      const prompt = `
        You are an elite, high-society Ferrari Concierge at the headquarters in Maranello, Italy. Your job is to analyze a client's lifestyle profile, budget limits, driving preferences, and custom descriptions to recommend the perfect Ferrari from our official line-up.

        Client Profile:
        - Target Budget: ${budget || 'Unlimited'}
        - Primary Lifestyle Use: ${lifestyle || 'Daily / Track / Collector'}
        - Propulsion / Style Preference: ${preference || 'Any'}
        - Client's Personal Narrative: "${description || 'I desire the absolute best Ferrari.'}"

        Available Ferrari Lineup (Id, Name, Year, Price, Horsepower, Description):
        ${JSON.stringify(carModelsList || [])}

        Instructions:
        1. Evaluate the client's inputs against our available inventory list.
        2. Select the absolute BEST matching model ID (must match one of the IDs in the provided lineup list).
        3. Formulate an incredibly high-end, elegant, personalized advisory letter (reasoning) of about 150-250 words. Write in a sophisticated, Italian-luxury concierge tone ("Caro Cliente...", "Maranello greetings", etc.). Discuss engine sound, heritage matching, dynamic capabilities, and lifestyle fit.
        4. Select exactly two alternative matching model IDs as runner-ups.

        You must return the output strictly in JSON format matching this schema:
        {
          "recommendedModelId": "the-model-id-string",
          "reasoning": "The personalized elite concierge letter goes here...",
          "alternativeIds": ["alt-id-1", "alt-id-2"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedModelId: {
                type: Type.STRING,
                description: 'The exact ID of the recommended Ferrari model.',
              },
              reasoning: {
                type: Type.STRING,
                description: 'Elegant, personalized letter of recommendation.',
              },
              alternativeIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Two other recommended Ferrari model IDs.',
              },
            },
            required: ['recommendedModelId', 'reasoning', 'alternativeIds'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedRecommendation = JSON.parse(responseText.trim());

      return res.json(parsedRecommendation);
    } catch (error: any) {
      console.error('Gemini recommendation failed: ', error);
      return res.status(500).json({
        error: 'Maranello database lookup failed. Please try again.',
        details: error.message,
      });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ferrari Universe Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
