type ProjectCanvasProps = {
  state?: "blank" | "first" | "broken" | "repaired" | "updated";
  compact?: boolean;
};

export function ProjectCanvas({
  state = "first",
  compact = false,
}: ProjectCanvasProps) {
  const hasContent = state !== "blank";
  const broken = state === "broken";
  const updated = state === "updated";

  return (
    <section
      className={`project-canvas${compact ? " project-canvas--compact" : ""}`}
      aria-label={`Repair Café website ${
        state === "blank" ? "before building" : `${state} version`
      }`}
    >
      <header>
        <span aria-hidden="true">● ● ●</span>
        <b>repair-cafe.preview</b>
        <em>{state === "repaired" || state === "updated" ? "checked" : state}</em>
      </header>

      {hasContent ? (
        <div className="project-canvas__page">
          <nav aria-label="Example project header">
            <strong>RE:PAIR</strong>
            <span>{updated ? "SATURDAY · 10:30" : "SATURDAY · WEST HALL"}</span>
          </nav>
          <div className="project-canvas__hero">
            <small>NEIGHBORHOOD REPAIR CAFÉ</small>
            <h2>Bring it broken.<br />Leave with a plan.</h2>
            <p>Small appliances, clothing, and bicycles · {updated ? "10:30" : "10:00"}–14:00</p>
            <mark className={broken ? "is-broken" : ""}>
              {broken
                ? "WALK-INS ARE GUARANTEED A REPAIR"
                : "Repairs depend on volunteer availability"}
            </mark>
            <a
              href={broken ? undefined : "mailto:hello@repair-cafe.example"}
              className={broken ? "is-broken" : ""}
              onClick={(event) => event.preventDefault()}
            >
              Ask about a repair <span aria-hidden="true">↗</span>
            </a>
          </div>
          <footer>
            <span>JULY 25</span>
            <span>WEST HALL COMMUNITY ROOM</span>
          </footer>
        </div>
      ) : (
        <div className="project-canvas__blank">
          <span aria-hidden="true">＋</span>
          <strong>No project page yet</strong>
          <p>We will build the first complete path in small, visible steps.</p>
        </div>
      )}
    </section>
  );
}
