/* Termíny koncertů – uložené v prohlížeči (localStorage) */
const STORAGE_KEY = "nocni-ozveny-events";

const DEFAULT_EVENTS = [
  { id: "1", date: "2026-10-18", place: "Klub Jazz Dock, Praha", note: "Večerní blues set" },
  { id: "2", date: "2026-11-02", place: "Svatba – Vila Čáp, Beroun", note: "3 hodiny" },
  { id: "3", date: "2026-12-12", place: "Firemní večírek, Brno", note: "Akusticky" }
];

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS.slice();
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_EVENTS.slice();
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatDateCs(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return d + ". " + m + ". " + y;
}

function sortEvents(events) {
  return events.slice().sort(function (a, b) {
    return (a.date || "").localeCompare(b.date || "");
  });
}

function renderPublicList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const events = sortEvents(loadEvents());
  if (!events.length) {
    el.innerHTML = "<p>Zatím žádné termíny. Přidej je ve <a href=\"admin.html\">správě</a>.</p>";
    return;
  }
  let html = "<ul class=\"event-list\">";
  events.forEach(function (ev) {
    html +=
      "<li>" +
      "<strong>" + formatDateCs(ev.date) + "</strong>" +
      " — " + (ev.place || "") +
      (ev.note ? " <span class=\"event-note\">(" + ev.note + ")</span>" : "") +
      "</li>";
  });
  html += "</ul>";
  el.innerHTML = html;
}

function renderAdminTable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const events = sortEvents(loadEvents());
  if (!events.length) {
    el.innerHTML = "<p>Žádné termíny.</p>";
    return;
  }
  let html =
    "<table><tr><th>Datum</th><th>Místo</th><th>Poznámka</th><th></th></tr>";
  events.forEach(function (ev) {
    html +=
      "<tr>" +
      "<td>" + formatDateCs(ev.date) + "</td>" +
      "<td>" + (ev.place || "") + "</td>" +
      "<td>" + (ev.note || "") + "</td>" +
      "<td><button type=\"button\" class=\"btn-danger\" data-id=\"" +
      ev.id +
      "\">Smazat</button></td>" +
      "</tr>";
  });
  html += "</table>";
  el.innerHTML = html;

  el.querySelectorAll("button[data-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-id");
      const next = loadEvents().filter(function (e) {
        return e.id !== id;
      });
      saveEvents(next);
      renderAdminTable(containerId);
    });
  });
}

function addEvent(date, place, note) {
  const events = loadEvents();
  events.push({
    id: String(Date.now()),
    date: date,
    place: place,
    note: note || ""
  });
  saveEvents(events);
}
