import { getTranslations } from "next-intl/server";
import type { TeamDetail } from "@/lib/api";

const RESULT_STYLE: Record<string, string> = {
  W: "bg-[#C8F04A] text-[#020B0A]",
  D: "bg-white/20 text-white",
  L: "bg-red-500/80 text-white",
};

function FormPills({ form }: { form: string }) {
  const items = form.replace(/[^WDL]/gi, "").toUpperCase().slice(-5).split("");
  if (items.length === 0) return <span className="text-white/30">—</span>;
  return (
    <div className="flex gap-1">
      {items.map((r, i) => (
        <span
          key={`${r}-${i}`}
          className={`grid h-5 w-5 place-items-center rounded text-[10px] font-extrabold ${
            RESULT_STYLE[r] ?? "bg-white/10 text-white/60"
          }`}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

/** One team's season stats: recent form, goals, clean sheets, cards. */
export async function TeamStats({ detail }: { detail: TeamDetail }) {
  const t = await getTranslations("teamStats");
  const s = detail.stats;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center gap-2">
        {detail.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={detail.logo}
            alt={detail.name}
            width={24}
            height={24}
            referrerPolicy="no-referrer"
            className="h-6 w-6 shrink-0 object-contain"
          />
        ) : null}
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold leading-tight">
            {detail.name}
          </span>
          {(() => {
            const sub = [
              detail.country && detail.country !== detail.name ? detail.country : null,
              detail.founded ? `${t("founded")} ${detail.founded}` : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return sub ? (
              <span className="block truncate text-[10px] text-white/40">{sub}</span>
            ) : null;
          })()}
        </div>
      </div>

      {!s ? (
        <p className="text-[12px] text-white/35">{t("noData")}</p>
      ) : (
        <dl className="space-y-1.5 text-[12px]">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/45">{t("form")}</dt>
            <dd>
              <FormPills form={s.form} />
            </dd>
          </div>
          <Row label={t("record")} value={`${s.wins}-${s.draws}-${s.losses}`} />
          <Row label={t("goals")} value={`${s.goalsFor} : ${s.goalsAgainst}`} />
          <Row label={t("cleanSheets")} value={`${s.cleanSheets}`} />
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/45">{t("cards")}</dt>
            <dd className="flex items-center gap-2 font-medium tabular-nums">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-3 w-2 rounded-[2px] bg-yellow-400" />
                {s.yellowCards}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-3 w-2 rounded-[2px] bg-red-500" />
                {s.redCards}
              </span>
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-white/45">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
