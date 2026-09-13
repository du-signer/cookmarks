import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "Upload", icon: UploadTabIcon, end: true },
  { to: "/cookmarks", label: "Cookmarks", icon: BookmarkIcon, end: false },
  { to: "/fridge", label: "Fridge Check", icon: FridgeIcon, end: false },
  { to: "/grocery", label: "Grocery List", icon: ListIcon, end: false },
];

export function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-paper/90 backdrop-blur sm:block">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-serif text-xl text-ink">Cookmarks</span>
          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-dim"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition ${
                  isActive ? "text-ink" : "text-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon active={isActive} />
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

interface IconProps {
  active: boolean;
}

function UploadTabIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4.5L5 20V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}

function FridgeIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M5 10h14M8 6v1.5M8 13v1.5" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
      <path d="M9 6h10M9 12h10M9 18h10" strokeLinecap="round" />
      <path d="M5 6h.01M5 12h.01M5 18h.01" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}
