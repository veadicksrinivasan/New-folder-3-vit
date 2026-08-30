/**
 * ZentraSec event reporter.
 * Uses the dashboard-provisioned connection (never POST /api/v1/connections).
 */
const BASE_URL = (process.env.ZENTRASEC_BASE_URL || 'http://172.18.225.26:8000').replace(/\/$/, '');
const CONNECTION_ID = process.env.ZENTRASEC_CONNECTION_ID || 'INC-1CFI';
const SECURE_TOKEN = process.env.ZENTRASEC_SECURE_TOKEN || '';
const EVENTS_URL = `${BASE_URL}/api/v1/events`;

const clientIp = (req) => {
  const forwarded = req?.headers?.['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req?.socket?.remoteAddress || req?.ip || '127.0.0.1';
};

async function postEvent(eventType, details = {}) {
  const payload = {
    connection_id: CONNECTION_ID,
    secure_token: SECURE_TOKEN,
    event_type: eventType,
    timestamp: new Date().toISOString(),
    source: 'nexacore-portal',
    ...details
  };

  console.log(`[ZentraSec] POST ${EVENTS_URL} event_type=${eventType} connection_id=${CONNECTION_ID}`);

  try {
    const response = await fetch(EVENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Connection-Id': CONNECTION_ID,
        'X-Secure-Token': SECURE_TOKEN,
        Authorization: `Bearer ${SECURE_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const bodyText = await response.text();
    console.log(`[ZentraSec] response status=${response.status} body=${bodyText}`);
    return { ok: response.ok, status: response.status, body: bodyText };
  } catch (err) {
    const cause = err.cause ? ` cause=${err.cause.code || err.cause.message || err.cause}` : '';
    console.log(`[ZentraSec] POST failed: ${err.message}${cause}`);
    return { ok: false, status: 0, body: err.message };
  }
}

const reportLoginFailure = (req, extra = {}) =>
  postEvent('LOGIN_FAILURE', {
    username: extra.username || req.body?.username || req.body?.email || 'anonymous',
    ip_address: extra.ip_address || clientIp(req),
    resource: '/api/auth/login',
    metadata: { reason: extra.reason || 'Invalid credentials' }
  });

const reportLoginSuccess = (req, extra = {}) =>
  postEvent('LOGIN_SUCCESS', {
    username: extra.username || req.body?.username || req.body?.email,
    user_role: extra.user_role || req.body?.role,
    ip_address: extra.ip_address || clientIp(req),
    resource: '/api/auth/login'
  });

const reportFileAccess = (req, extra = {}) =>
  postEvent('FILE_ACCESS', {
    username: extra.username || req.user?.username || req.user?.email || 'anonymous',
    ip_address: extra.ip_address || clientIp(req),
    resource: extra.resource || req.originalUrl,
    metadata: extra.metadata || {}
  });

const reportPrivilegeAccess = (req, extra = {}) =>
  postEvent('PRIVILEGE_ACCESS', {
    username: extra.username || req.user?.username || req.user?.email || 'anonymous',
    user_role: extra.user_role || req.user?.role || 'admin',
    ip_address: extra.ip_address || clientIp(req),
    resource: extra.resource || req.originalUrl,
    metadata: extra.metadata || {}
  });

const reportFileDownload = (req, extra = {}) =>
  postEvent('FILE_DOWNLOAD', {
    username: extra.username || req.user?.username || req.user?.email || 'anonymous',
    ip_address: extra.ip_address || clientIp(req),
    resource: extra.resource || req.originalUrl,
    metadata: extra.metadata || {}
  });

console.log(
  `[ZentraSec] Connector ready. Using provisioned connection_id=${CONNECTION_ID} base=${BASE_URL} (no /api/v1/connections registration)`
);

module.exports = {
  reportLoginFailure,
  reportLoginSuccess,
  reportFileAccess,
  reportPrivilegeAccess,
  reportFileDownload,
  postEvent
};
