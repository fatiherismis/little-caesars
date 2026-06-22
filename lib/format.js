// Yardımcı biçimlendirme fonksiyonları

// Fiyatı Türk Lirası olarak biçimlendirir: 159.9 -> "159,90 ₺"
export function formatTL(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

// Tarihi Türkçe olarak biçimlendirir
export function formatDate(date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
