const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

/**
 * Sends a security event to ZentraSec backend threat engine and saves locally.
 * @param {Object} payload - Event details
 * @param {string} payload.event_type - Type of event (e.g. LOGIN_FAILED, RESULT_MODIFIED)
 * @param {string} [payload.username] - Username associated with event
 * @param {string} [payload.user_role] - Role of the user
 * @param {string} [payload.ip_address] - Client IP address
 * @param {string} [payload.resource] - Resource endpoint or URI
 * @param {Object} [payload.metadata] - Extra metadata parameters
 */
const sendSecurityEvent = async (payload) => {
  const eventId = uuidv4();
  const timestamp = new Date().toISOString();
  const targetUrl = process.env.ZENTRASEC_API_URL || 'http://localhost:5000/api/security/events';

  const event = {
    event_id: eventId,
    event_type: payload.event_type,
    username: payload.username || 'anonymous',
    user_role: payload.user_role || 'guest',
    ip_address: payload.ip_address || '127.0.0.1',
    resource: payload.resource || '/',
    timestamp: timestamp,
    source: 'school_portal',
    metadata: payload.metadata || {}
  };

  // NEVER include passwords, tokens or secrets in event payload
  if (event.metadata) {
    delete event.metadata.password;
    delete event.metadata.token;
    delete event.metadata.secret;
  }

  let deliveryStatus = 'LOCAL_ONLY';
  let errorMessage = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'SchoolPortalSecurityService'
      },
      body: JSON.stringify(event),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      deliveryStatus = 'SENT';
    } else {
      deliveryStatus = 'FAILED';
      errorMessage = `ZentraSec HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (err) {
    deliveryStatus = 'LOCAL_ONLY';
    errorMessage = err.name === 'AbortError' ? 'ZentraSec connection timed out' : `ZentraSec unavailable (${err.message})`;
    console.log(`[SecurityEventService] ZentraSec unavailable: ${errorMessage}. Event ${event.event_type} saved locally.`);
  }

  // Save event log into local SQLite database for history/monitoring
  db.run(
    `INSERT INTO security_events (event_id, event_type, username, user_role, ip_address, resource, timestamp, source, metadata, delivery_status, error_message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.event_id,
      event.event_type,
      event.username,
      event.user_role,
      event.ip_address,
      event.resource,
      event.timestamp,
      event.source,
      JSON.stringify(event.metadata),
      deliveryStatus,
      errorMessage
    ],
    (err) => {
      if (err) console.error("Error storing security event in SQLite:", err.message);
    }
  );

  return {
    ...event,
    delivery_status: deliveryStatus,
    error_message: errorMessage
  };
};

module.exports = {
  sendSecurityEvent
};
