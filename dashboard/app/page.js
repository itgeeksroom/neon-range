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
  const hasPhase = (phase) => events.some((event) => event.phase === phase);
  const recon = hasPhase("RECON");
  const services = hasPhase("SERVICE DISCOVERY");
  const enumeration = hasPhase("ENUMERATION");
  const credentials = hasPhase("CREDENTIAL ACCESS");
  const collection = hasPhase("COLLECTION");
  const stages = [
    { name: "RECON", done: recon, evidence: events.filter((e) => e.phase === "RECON") },
    { name: "SERVICES", done: services, evidence: events.filter((e) => e.phase === "SERVICE DISCOVERY") },
    { name: "ENUMERATION", done: enumeration, evidence: events.filter((e) => e.phase === "ENUMERATION") },
    { name: "CREDENTIALS", done: credentials, evidence: events.filter((e) => e.phase === "CREDENTIAL ACCESS") },
    { name: "DATA", done: collection, evidence: events.filter((e) => e.phase === "COLLECTION") }
  ];

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
          <PathStep active={recon} label="🔍 Recon / Port Scan" detail={recon ? "Observed" : "Waiting for scan"} />
          <div className="arrow">↓</div>
          <PathStep active={services} label="🌐 Service Discovery" detail={services ? "Open services discovered" : "Locked"} />
          <div className="arrow">↓</div>
          <PathStep active={enumeration} label="⚙ API Enumeration" detail={enumeration ? "Internal surface reached" : "Next: inspect the API"} />
          <div className="arrow">↓</div>
          <PathStep active={credentials} label="🔑 Credential Access" detail={credentials ? "Training credentials accessed" : "Locked"} />
          <div className="arrow">↓</div>
          <PathStep active={collection} label="🗄 Data Access" detail={collection ? "Synthetic data accessed" : "Locked"} />
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

      <section className="journey">
        <div className="eventsHead">
          <div><div className="eyebrow">ATTACK / INTERPRET</div><h2>ATTACK JOURNEY</h2></div>
          <div className="eventCount">{stages.filter((stage) => stage.done).length}/5 STAGES</div>
        </div>
        <div className="journeyRail">
          {stages.map((stage, index) => (
            <div className={"journeyStage " + (stage.done ? "done" : "waiting")} key={stage.name}>
              <div className="stageTop"><span>{stage.done ? "✓" : index + 1}</span><strong>{stage.name}</strong></div>
              <small>{stage.done ? stage.evidence.length + " evidence event(s)" : "Not reached"}</small>
              {stage.done && stage.evidence.length > 0 && (
                <details>
                  <summary>Evidence</summary>
                  {stage.evidence.slice(0, 5).map((event) => (
                    <div className="evidenceLine" key={event.id}>{event.method} {event.path}</div>
                  ))}
                </details>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="events">
        <div className="eventsHead">
          <div><div className="eyebrow">RAW TELEMETRY</div><h2>SECURITY EVENT STREAM</h2></div>
          <div className="eventCount">{events.length} EVENTS</div>
        </div>
        {events.length === 0 ? (
          <div className="emptyEvent">No activity yet. Start with the local recon sensor.</div>
        ) : (
          <div className="eventList">
            {events.slice(0, 6).map((event) => (
              <div className="eventRow" key={event.id}>
                <span className={"eventDot " + event.severity} />
                <div className="eventBody"><strong>{event.title}</strong><small>{event.method} {event.path} · {event.phase}</small></div>
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

function PathStep({ active, label, detail }) {
  return (
    <div className={"pathStep " + (active ? "active" : "locked")}>
      <div><strong>{label}</strong><small>{detail}</small></div>
      <span>{active ? "✓" : "🔒"}</span>
    </div>
  );
}

function Score({ label, value }) {
  return <div className="scoreRow"><span>{label}</span><strong>{value}</strong></div>;
}
