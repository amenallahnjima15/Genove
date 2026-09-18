import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { GenoveLogo } from "@/components/genove/GenoveLogo";

export function Footer() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  return (
    <footer className="bg-[#120924] text-slate-100 border-t border-purple-500/20 relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:py-14 grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-1">
          <Link to="/" className="inline-block transition-opacity hover:opacity-95">
            <GenoveLogo variant="full" height={52} />
          </Link>
          <p className="mt-3 max-w-sm text-xs text-slate-300/90 font-medium leading-relaxed">
            {t("footer.tagline")}
          </p>

          {isAuthenticated && user && (
            <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md max-w-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8C52FF] to-[#180E30] border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (user.name || "U").slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{user.name}</span>
                  <CheckCircle2 className="h-3 w-3 text-amber-400 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-300/80 truncate">{user.email}</div>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mt-6 flex max-w-sm gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {t("footer.placeholder")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.placeholder")}
              className="h-10 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            />
            <button
              type="submit"
              className="h-10 rounded-xl bg-[#8C52FF] px-4 text-sm font-extrabold text-white hover:bg-purple-600 shadow-md shadow-purple-500/25 transition-colors whitespace-nowrap"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>

        {/* Links hidden on mobile, visible on desktop (md+) */}
        <div className="hidden md:grid md:col-span-4 md:grid-cols-4 gap-8">
          <FooterCol
            title={t("footer.product")}
            items={[
              { label: t("nav.courses"), to: "/catalogue" as const },
              { label: t("nav.projects"), to: "/projets" as const },
              { label: t("nav.savoir"), to: "/savoir" as const },
              { label: t("footer.pricing"), soon: true },
            ]}
            soonText={t("footer.soon")}
          />
          <FooterCol
            title={t("footer.company")}
            items={[
              { label: t("footer.about"), soon: true },
              { label: t("footer.team"), soon: true },
              { label: t("footer.careers"), soon: true },
              { label: t("footer.press"), soon: true },
            ]}
            soonText={t("footer.soon")}
          />
          <FooterCol
            title={t("footer.legal")}
            items={[
              { label: t("footer.privacy"), soon: true },
              { label: t("footer.cgu"), soon: true },
              { label: t("footer.cookies"), soon: true },
              { label: t("footer.mentions"), soon: true },
            ]}
            soonText={t("footer.soon")}
          />
          <FooterCol
            title={t("footer.support")}
            items={[
              { label: t("footer.helpCenter"), to: "/aide" as const },
              { label: t("footer.contact"), to: "/aide" as const },
              { label: t("footer.faq"), to: "/aide" as const },
            ]}
            soonText={t("footer.soon")}
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-6 py-5 text-xs text-white/60 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} Genove. {t("footer.rights")}
          </span>
          <span>{t("footer.location")}</span>
        </div>
      </div>
    </footer>
  );
}

type Item = { label: string; to?: "/catalogue" | "/projets" | "/savoir" | "/aide"; soon?: boolean };

function FooterCol({ title, items, soonText }: { title: string; items: Item[]; soonText: string }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4 text-sm font-semibold">{title}</div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link
                to={it.to}
                onClick={(e) => {
                  if ((it.to === "/savoir" || it.to === "/aide") && !isAuthenticated) {
                    e.preventDefault();
                    navigate({ to: "/connexion", search: { mode: "login", redirect: it.to } });
                  }
                }}
                className="hover:text-amber-400 transition-colors font-medium"
              >
                {it.label}
              </Link>
            ) : (
              <span>
                {it.label}{" "}
                {it.soon && (
                  <span className="ml-1 text-[10px] uppercase tracking-wide text-white/40">
                    {soonText}
                  </span>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
