/**
 * Netlify Serverless Function: Strava OAuth & November Activity Importer
 * Path: /.netlify/functions/strava (or /api/strava)
 *
 * Environment Variables required in Netlify:
 *   - STRAVA_CLIENT_ID
 *   - STRAVA_CLIENT_SECRET
 */

const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);
const WALK_TYPES = new Set(['Walk', 'Hike', 'Snowshoe']);

function mapStravaSport(act) {
  const sportType = act.sport_type || act.type || '';
  if (RUN_TYPES.has(sportType)) return 'Correr';
  if (WALK_TYPES.has(sportType)) return 'Caminar';
  return null;
}

function getDefaultEditionYear(now = new Date()) {
  // Regla: hasta el 31 de octubre se usa el noviembre del año anterior;
  // desde el 1 de noviembre se usa el noviembre del año actual.
  return now.getUTCMonth() >= 10 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const clientId = process.env.STRAVA_CLIENT_ID || '297299';
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  // GET request: return public Client ID so frontend can redirect to Strava OAuth
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        configured: Boolean(clientId && clientSecret),
        clientId: clientId || null
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          'Faltan las variables STRAVA_CLIENT_ID o STRAVA_CLIENT_SECRET en la configuración de Netlify.'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { code, refreshToken } = body;
    const editionYear = Number(body.editionYear) || getDefaultEditionYear();

    if (!code && !refreshToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing authorization code or refreshToken.' })
      };
    }

    // 1. Exchange code or refresh_token for access_token
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret
    });

    if (code) {
      tokenParams.set('code', code);
      tokenParams.set('grant_type', 'authorization_code');
    } else {
      tokenParams.set('refresh_token', refreshToken);
      tokenParams.set('grant_type', 'refresh_token');
    }

    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: tokenData.message || 'No se pudo autorizar con Strava.',
          details: tokenData
        })
      };
    }

    const accessToken = tokenData.access_token;
    let athlete = tokenData.athlete || null;

    // If refreshing token, Strava doesn't always include athlete profile in token response
    if (!athlete) {
      const athleteRes = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (athleteRes.ok) {
        athlete = await athleteRes.json();
      }
    }

    // 2. Compute November window for the active Movember edition with ±14h timezone buffer
    // so local-time Nov 1 00:00 and Nov 30 23:59 are never missed across any UTC offset.
    const TZ_BUFFER_SEC = 14 * 3600;
    const rawAfter =
      Number(body.after) || Math.floor(Date.UTC(editionYear, 10, 1, 0, 0, 0) / 1000);
    const rawBefore =
      Number(body.before) || Math.floor(Date.UTC(editionYear, 10, 30, 23, 59, 59) / 1000);
    const afterEpoch = rawAfter - TZ_BUFFER_SEC;
    const beforeEpoch = rawBefore + TZ_BUFFER_SEC;

    // 3. Fetch athlete activities in that November range
    const actsUrl = `https://www.strava.com/api/v3/athlete/activities?after=${afterEpoch}&before=${beforeEpoch}&per_page=200`;
    const actsRes = await fetch(actsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!actsRes.ok) {
      const errData = await actsRes.json().catch(() => ({}));
      return {
        statusCode: actsRes.status,
        headers,
        body: JSON.stringify({
          error: errData.message || 'Error al obtener las actividades de Strava.'
        })
      };
    }

    const rawActivities = await actsRes.json();
    const importedActivities = [];

    for (const act of Array.isArray(rawActivities) ? rawActivities : []) {
      const mappedSport = mapStravaSport(act);
      if (!mappedSport) continue;

      const distanceMeters = Number(act.distance) || 0;
      const km = Math.round((distanceMeters / 1000) * 100) / 100;
      if (km <= 0) continue;

      const startLocal = String(act.start_date_local || act.start_date || '');
      const dateISO = startLocal.slice(0, 10);

      // Verify activity falls in November of editionYear in local time
      if (!dateISO.startsWith(`${editionYear}-11-`)) continue;

      importedActivities.push({
        id: `strava_${act.id}`,
        stravaId: String(act.id),
        sport: mappedSport,
        stravaSportType: act.sport_type || act.type || '',
        km,
        dateISO,
        editionYear,
        note: act.name ? String(act.name).slice(0, 80) : `${mappedSport} (Strava)`,
        createdAt: act.start_date || new Date().toISOString()
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        editionYear,
        athlete: athlete
          ? {
              id: athlete.id,
              firstname: athlete.firstname || '',
              lastname: athlete.lastname || '',
              username: athlete.username || ''
            }
          : null,
        refreshToken: tokenData.refresh_token || refreshToken || null,
        activities: importedActivities
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message || 'Error interno en la función de Strava.'
      })
    };
  }
};

