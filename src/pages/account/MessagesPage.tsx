import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/States";
import { ArrowRightIcon, MessageIcon } from "@/components/icons";
import { CONVERSATIONS, TRIPS, getAgencyById } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface LocalMessage {
  id: string;
  from: "traveler" | "agency";
  text: string;
  at: string;
}

export default function MessagesPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  const [extraMessages, setExtraMessages] = useState<Record<string, LocalMessage[]>>({});
  const [draft, setDraft] = useState("");

  const active = conversationId ? CONVERSATIONS.find((c) => c.id === conversationId) : undefined;

  const allMessages: LocalMessage[] = useMemo(() => {
    if (!active) return [];
    return [...active.messages, ...(extraMessages[active.id] ?? [])];
  }, [active, extraMessages]);

  function sendMessage() {
    if (!active || !draft.trim()) return;
    const msg: LocalMessage = { id: `local-${Date.now()}`, from: "traveler", text: draft.trim(), at: "ئێستا" };
    setExtraMessages((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), msg] }));
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-lg) px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 hidden text-2xl font-extrabold text-(--color-text-primary) sm:block">پەیامەکان</h1>

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle) md:grid-cols-[320px_1fr] md:gap-0">
        {/* Conversation list */}
        <div className={cn("border-(--color-border) md:border-e", active ? "hidden md:block" : "block")}>
          {CONVERSATIONS.length === 0 ? (
            <EmptyState icon={<MessageIcon className="size-7" />} title="هیچ پەیامێک نییە" className="border-none shadow-none" />
          ) : (
            <ul>
              {CONVERSATIONS.map((c) => (
                <ConversationRow key={c.id} conversation={c} active={c.id === conversationId} />
              ))}
            </ul>
          )}
        </div>

        {/* Thread */}
        <div className={cn("flex flex-col", active ? "flex" : "hidden md:flex")}>
          {!active ? (
            <div className="flex flex-1 items-center justify-center p-10">
              <EmptyState icon={<MessageIcon className="size-7" />} title="گفتوگۆیەک هەڵبژێرە" description="پەیامەکانت لێرە دەردەکەون." className="border-none shadow-none" />
            </div>
          ) : (
            <>
              <ThreadHeader conversation={active} onBack={() => navigate("/account/messages")} />
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ minHeight: 320, maxHeight: 480 }}>
                {allMessages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-(--color-border) p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="پەیامێک بنووسە..."
                  className="h-11 flex-1 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-4 text-sm focus:border-(--color-primary)"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex h-11 items-center justify-center rounded-(--radius-pill) bg-(--color-primary) px-5 text-sm font-semibold text-white cursor-pointer"
                >
                  ناردن
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationRow({ conversation, active }: { conversation: Conversation; active: boolean }) {
  const agency = getAgencyById(conversation.agencyId);
  const trip = conversation.tripId ? TRIPS.find((t) => t.id === conversation.tripId) : undefined;
  if (!agency) return null;
  return (
    <li>
      <Link
        to={`/account/messages/${conversation.id}`}
        className={cn(
          "flex items-center gap-3 border-b border-(--color-border) p-4 transition-colors hover:bg-(--color-surface-elevated)",
          active && "bg-(--color-primary-50)"
        )}
      >
        <Avatar src={agency.logo} alt={agency.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-(--color-text-primary)">{agency.name}</p>
            {conversation.unread > 0 && <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-[10px] font-bold text-white">{conversation.unread}</span>}
          </div>
          {trip && <p className="truncate text-xs text-(--color-text-muted)">{trip.title}</p>}
          <p className="mt-0.5 truncate text-sm text-(--color-text-secondary)">{conversation.lastMessage}</p>
        </div>
      </Link>
    </li>
  );
}

function ThreadHeader({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const agency = getAgencyById(conversation.agencyId);
  const trip = conversation.tripId ? TRIPS.find((t) => t.id === conversation.tripId) : undefined;
  if (!agency) return null;
  return (
    <div className="flex items-center gap-3 border-b border-(--color-border) p-4">
      <button type="button" onClick={onBack} className="flex size-8 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) md:hidden">
        <ArrowRightIcon className="size-4 rtl:rotate-180" />
      </button>
      <Avatar src={agency.logo} alt={agency.name} size="sm" />
      <div>
        <p className="font-semibold text-(--color-text-primary)">{agency.name}</p>
        {trip && <p className="text-xs text-(--color-text-muted)">{trip.title}</p>}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: LocalMessage }) {
  const isTraveler = message.from === "traveler";
  return (
    <div className={cn("flex", isTraveler ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-(--radius-lg) px-4 py-2.5 text-sm",
          isTraveler ? "rounded-ee-sm bg-(--color-primary) text-white" : "rounded-ss-sm bg-(--color-surface-elevated) text-(--color-text-primary)"
        )}
      >
        <p>{message.text}</p>
        <p className={cn("mt-1 text-[10px]", isTraveler ? "text-white/70" : "text-(--color-text-muted)")}>{message.at}</p>
      </div>
    </div>
  );
}
