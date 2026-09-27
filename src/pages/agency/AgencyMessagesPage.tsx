import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { ArrowRightIcon, MessageIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { AGENCY_CONVERSATIONS, QUICK_REPLY_TEMPLATES, getAgencyTripById, getConversationById, getCustomerById } from "@/data/agencyMock";

export default function AgencyMessagesPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, { from: "agency"; text: string }[]>>({});

  const active = conversationId ? getConversationById(conversationId) : undefined;
  const filteredConversations = AGENCY_CONVERSATIONS.filter((c) => {
    const customer = getCustomerById(c.customerId);
    return customer?.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  function send() {
    if (!active || !composer.trim()) return;
    setLocalMessages((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), { from: "agency", text: composer.trim() }],
    }));
    setComposer("");
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-0 overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle) md:grid-cols-[320px_1fr]">
      <div className={cn("flex flex-col border-(--color-border) md:border-e", active && "hidden md:flex")}>
        <div className="border-b border-(--color-border) p-4">
          <h1 className="mb-3 text-lg font-extrabold text-(--color-text-primary)">پەیامەکان</h1>
          <Input placeholder="گەڕان بە ناوی گەشتیار" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((c) => {
            const customer = getCustomerById(c.customerId);
            const trip = c.tripId ? getAgencyTripById(c.tripId) : undefined;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/agency/messages/${c.id}`)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-(--color-border) px-4 py-3 text-start hover:bg-(--color-surface-elevated)",
                  active?.id === c.id && "bg-(--color-primary-50)"
                )}
              >
                <Avatar src={customer?.avatarUrl ?? ""} alt={customer?.name ?? ""} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-(--color-text-primary)">{customer?.name}</p>
                    {c.unread > 0 && <Badge tone="primary">{c.unread}</Badge>}
                  </div>
                  <p className="truncate text-xs text-(--color-text-muted)">{trip?.title}</p>
                  <p className="truncate text-xs text-(--color-text-secondary)">{c.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn("flex flex-col", !active && "hidden md:flex")}>
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState icon={<MessageIcon className="size-7" />} title="گفتوگۆیەک هەڵبژێرە" description="لە لیستی لای ڕاست گفتوگۆیەک هەڵبژێرە بۆ دیتنی پەیامەکان." />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-(--color-border) p-4">
              <button type="button" onClick={() => navigate("/agency/messages")} className="text-(--color-text-secondary) md:hidden">
                <ArrowRightIcon className="size-5 rotate-180" />
              </button>
              <Avatar src={getCustomerById(active.customerId)?.avatarUrl ?? ""} alt="" size="sm" />
              <div>
                <p className="text-sm font-bold text-(--color-text-primary)">{getCustomerById(active.customerId)?.name}</p>
                <p className="text-xs text-(--color-text-muted)">{active.tripId ? getAgencyTripById(active.tripId)?.title : ""}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[75%] rounded-(--radius-lg) px-4 py-2.5 text-sm",
                      m.from === "agency" ? "self-end rounded-se-sm bg-(--color-primary-50) text-(--color-text-primary)" : "self-start rounded-ss-sm bg-(--color-surface-elevated) text-(--color-text-primary)"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                {(localMessages[active.id] ?? []).map((m, i) => (
                  <div key={i} className="max-w-[75%] self-end rounded-(--radius-lg) rounded-se-sm bg-(--color-primary-50) px-4 py-2.5 text-sm text-(--color-text-primary)">
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-(--color-border) p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_REPLY_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setComposer(t.text)}
                    className="rounded-(--radius-pill) bg-(--color-surface-elevated) px-3 py-1.5 text-xs font-semibold text-(--color-text-secondary) hover:bg-(--color-primary-50) hover:text-(--color-primary-dark)"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2"
              >
                <Input value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="پەیامێک بنووسە..." className="flex-1" />
                <button type="submit" className="flex h-12 shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-primary) px-5 text-sm font-bold text-white">
                  ناردن
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
