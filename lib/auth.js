// Admin kimlik doğrulama yardımcıları.
// Basit bir yaklaşım: doğru giriş yapıldığında ADMIN_SECRET değerini taşıyan
// httpOnly bir çerez (admin_auth) ayarlanır. Korunan rotalar bu çerezi kontrol eder.

export const AUTH_COOKIE = "admin_auth";

// Çerez değeri geçerli mi? (ADMIN_SECRET ile eşleşiyor mu)
export function isValidToken(token) {
  const secret = process.env.ADMIN_SECRET || "dev-secret";
  return Boolean(token) && token === secret;
}

// Kullanıcı adı/şifre ortam değişkenleriyle eşleşiyor mu?
export function checkCredentials(username, password) {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}
