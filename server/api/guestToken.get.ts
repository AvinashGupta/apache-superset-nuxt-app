import sign from 'jwt-encode'

const USER = {
  "last_name": "User",
  "username": "guest",
  "first_name": "Guest"
}

function generateGuestGToken({
  dashboardId,
  supersetGuestJwtAudience,
  supersetGuestJwtSecret
}: any) {
  if (!supersetGuestJwtAudience || !supersetGuestJwtSecret) {
    throw new Error('Guest secrets not found')   
  }
  console.log('..', dashboardId, supersetGuestJwtAudience, supersetGuestJwtSecret)
  const now = Date.now()
  const exp = now + 1000 * 60 * 5
  const resources = [{ "type": "dashboard", "id": dashboardId }]
  const claims = {
      "user": USER,
      "resources": resources,
      "rls_rules": [],
      "iat": now,
      "exp": exp,
      "aud": supersetGuestJwtAudience,
      "type": "guest",
  }
  const token = sign(claims, supersetGuestJwtSecret, { alg: 'HS256' });
  return token
}

export default defineEventHandler((event) => {
  const secrets = useRuntimeConfig();
  console.log('asdads')
  const { dashboardId } = getQuery<{ dashboardId: string }>(event);
  
  const guestToken = generateGuestGToken({...secrets, dashboardId})

  return { guestToken }
})