

## Plan: Sidebar standard einklappbar machen

### Problem
Die aktuelle Sidebar ist auf Mobile (393px) immer sichtbar und nimmt Platz weg. Auf Desktop klappt sie nur zwischen 220px und 60px um. Es fehlt ein typisches Verhalten: auf Mobile als Overlay/Drawer, auf Desktop zwischen voll und Icon-Modus.

### Umsetzung

**1. Layout.tsx anpassen**
- Mobile (<768px): Sidebar standardmäßig ausgeblendet, öffnet als Overlay mit halbtransparentem Backdrop
- Desktop (≥768px): Sidebar zwischen voller Breite (220px) und Icon-Modus (60px) umschaltbar
- `useIsMobile()` Hook nutzen für die Unterscheidung
- Klick auf Backdrop schließt die Sidebar auf Mobile

**2. AppSidebar.tsx anpassen**
- Neue Props: `collapsed`, `open` (für Mobile), `onClose` (für Mobile Backdrop-Klick)
- Mobile: Sidebar als fixed/absolute Overlay mit z-30, Backdrop dahinter
- Desktop: Bleibt wie bisher (sticky, collapsed/expanded)
- Auf Mobile: Klick auf einen NavLink schließt die Sidebar automatisch

**3. Verhalten**
- Menu-Button in der Topbar: Auf Mobile öffnet/schließt Overlay, auf Desktop toggled collapsed
- Smooth Transition für beide Modi
- Sidebar-State wird pro Session gehalten (useState)

### Dateien
- `src/components/Layout.tsx` — Mobile-State hinzufügen, Backdrop rendern
- `src/components/AppSidebar.tsx` — Overlay-Modus für Mobile, auto-close bei Navigation

