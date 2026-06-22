import AdminNav from "@/components/AdminNav";

// Admin bölümü için ortak düzen: üstte gezinme sekmeleri.
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 lg:px-16">{children}</div>
    </div>
  );
}
