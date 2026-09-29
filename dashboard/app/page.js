async function getStatus() {
  try {
    const base = process.env.BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${base}/api/status`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    return {
      lab: "STARTING",
      score: 42,
      assets: { api: 1, containers: 2, data_stores: 1, identities: 1 },
      findings: { critical: 2, high: 3, medium: 4 },
      current_mission: { id: 1, name: "Find the Door", difficulty: "BEGINNER" }
    };
  }
}

async function getEvents() {
  try {
    const base = process.env.BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${base}/api/events`, { cache: "no-store" });
    if (!res.ok) throw new Error("Events unavailable");
    return await res.json();
  } catch {
    return { events: [] };
  }
}

export default async function Home() {
  const s = await getStatus();
  const eventData = await getEvents();
  const events = eventData.events || [];

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">AUTONOMOUS CLOUD SECURITY LAB</div>
          <h1>NEON//RANGE</h1>
        </div>
        <div className="status"><span className="dot" /> LAB {s.lab}</div>
        <div className="score">SECURITY SCORE <strong>{s.score}/100</strong></div>
      </header>

      <section className="grid">
        <article className="panel">
          <h2>ASSETS</h2>
          <div className="metric">🌐 API <span>{s.assets.api}</span></div>
          <div className="metric">📦 Containers <span>{s.assets.containers}</span></div>
          <div className="metric">🗄 Data Stores <span>{s.assets.data_stores}</span></div>
          <div className="metric">🔑 Identities <span>{s.assets.identities}</span></div>
          <hr />
          <div className="danger">🔴 Critical <span>{s.findings.critical}</span></div>
          <div className="high">🟠 High <span>{s.findings.high}</span></div>
          <div className="medium">🟡 Medium <span>{s.findings.medium}</span></div>
        </article>

        <article className="panel path">
          <h2>LIVE ATTACK PATH</h2>
          <div className="node source">🌐 Internet</div>
          <div className="arrow">↓</div>
          <div className="node exposed">⚠ Vulnerable API</div>
          <div className="arrow">↓</div>
          <div className="node identity">🔑 Fake Workload Identity</div>
          <div className="arrow">↓</div>
          <div className="node data">🗄 Synthetic Customer Data</div>
        </article>

        <article className="panel">
          <h2>SECURITY POSTURE</h2>
          <Score label="CSPM" value="55%" />
          <Score label="DSPM" value="40%" />
          <Score label="IAM" value="35%" />
          <Score label="Runtime" value="82%" />
          <Score label="Vuln" value="61%" />
        </article>
      </section>

      <section className="events">
        <div className="eventsHead">
          <div><div className="eyebrow">DETECT / INVESTIGATE</div><h2>LIVE SECURITY EVENTS</h2></div>
          <div className="eventCount">{events.length} EVENTS</div>
        </div>
        {events.length === 0 ? (
          <div className="emptyEvent">No NovaCorp activity yet. Open the target API to generate telemetry.</div>
        ) : (
          <div className="eventList">
            {events.slice(0, 8).map((event) => (
              <div className="eventRow" key={event.id}>
                <span className={"eventDot " + event.severity} />
                <div className="eventBody">
                  <strong>{event.title}</strong>
                  <small>{event.method} {event.path} · {event.phase} · {event.source}</small>
                </div>
                <span className="eventTime">{event.time}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mission">
        <div className="eyebrow">🎮 TRAINING MODE</div>
        <h2>MISSION 01 / {s.current_mission.name.toUpperCase()}</h2>
        <p>Learn how attackers discover exposed applications — from absolute beginner level.</p>
        <div className="difficulty">Difficulty ●○○○○ &nbsp; {s.current_mission.difficulty}</div>
        <div className="buttons">
          <a href="http://localhost:8080/docs">START MISSION</a>
          <a className="secondary" href="http://localhost:8000/api/events">VIEW EVENTS</a>
        </div>
      </section>
    </main>
  );
}

function Score({ label, value }) {
  return <div className="scoreRow"><span>{label}</span><strong>{value}</strong></div>;
}
