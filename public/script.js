const socket = io();
const ctx = document.getElementById("trafficChart").getContext("2d");
let configModalInstance;

const trafficData = {
  labels: Array(30).fill(""),
  datasets: [
    {
      label: "Requests",
      data: Array(30).fill(0),
      borderColor: "#00f3ff",
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, "rgba(0, 243, 255, 0.4)");
        gradient.addColorStop(1, "rgba(0, 243, 255, 0)");
        return gradient;
      },
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
    },
  ],
};

const chart = new Chart(ctx, {
  type: "line",
  data: trafficData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        beginAtZero: true,
        grid: { color: "#333" },
        ticks: { color: "#888" },
      },
    },
    animation: false,
    interaction: { mode: "nearest", intersect: false },
  },
});

function renderKeys(keys) {
  const tbody = document.getElementById("keyTableBody");
  tbody.innerHTML = keys
    .map(
      (k) => `
        <tr>
            <td class="text-info font-monospace">
                <span style="opacity:0.5">...</span>${k.key.slice(-6)}
            </td>
            <td>
                <span class="badge ${k.status === "active" ? "bg-success" : "bg-danger"} bg-opacity-75">
                    ${k.status.toUpperCase()}
                </span>
            </td>
            <td class="fw-bold">${k.usage}</td>
            <td class="${k.errors > 0 ? "text-danger" : "text-muted"}">${k.errors}</td>
        </tr>
    `,
    )
    .join("");
}

function addLog(log) {
  const container = document.getElementById("logContainer");
  const entry = document.createElement("div");

  let colorClass = "text-light";
  if (log.type === "error") colorClass = "text-danger";
  if (log.type === "success") colorClass = "text-success";
  if (log.type === "info") colorClass = "text-info";

  entry.className = `log-entry ${colorClass}`;
  entry.innerHTML = `<span class="text-muted me-2">[${log.timestamp}]</span>${log.message}`;

  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;

  if (container.children.length > 200) {
    container.removeChild(container.firstChild);
  }
}

async function showConfigModal() {
  if (!configModalInstance) {
    configModalInstance = new bootstrap.Modal(
      document.getElementById("configModal"),
    );
  }

  const output = document.getElementById("configOutput");
  output.value = "Loading models from server...";
  configModalInstance.show();

  try {
    const res = await fetch("/api/config-template");
    const models = await res.json();
    renderConfigYAML(models);
  } catch (e) {
    output.value = "Error connecting to server.";
  }
}

async function refreshModels() {
  const btn = document.getElementById("btnRefresh");
  const originalText = btn.innerHTML;
  btn.innerHTML = "Scanning...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/refresh-models", { method: "POST" });
    const models = await res.json();
    renderConfigYAML(models);
    alert(`Scan complete! Found ${models.length} models.`);
  } catch (e) {
    alert("Scan failed.");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function renderConfigYAML(models) {
  const header = `name: Gemini Proxy Config
version: 1.0.0
schema: v1
models:`;

  const body = models
    .map(
      (m) =>
        `  - name: "⚡ ${m}"
    model: "${m}"
    provider: openai
    apiBase: "http://localhost:13337/v1"
    apiKey: "sk-local-proxy"
    contextLength: 128000`,
    )
    .join("\n");

  document.getElementById("configOutput").value = `${header}\n${body}`;
  document.getElementById("modelCount").innerText =
    `Total available models: ${models.length}`;
}

function copyConfig() {
  const text = document.getElementById("configOutput");
  text.select();
  navigator.clipboard.writeText(text.value);

  const btn = document.querySelector("#configModal .btn-cyber");
  btn.innerText = "COPIED YAML!";
  setTimeout(() => (btn.innerText = "COPY TO CLIPBOARD"), 2000);
}

async function addKey() {
  const input = document.getElementById("newKeyInput");
  const key = input.value.trim();
  if (!key) return;

  try {
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();

    if (data.success) {
      input.value = "";
      input.placeholder = "Key added successfully!";
      setTimeout(() => (input.placeholder = "AIzaSy..."), 2000);
    } else {
      alert(data.error);
    }
  } catch (e) {
    console.error(e);
  }
}

socket.on("connect", () => {
  fetch("/api/keys")
    .then((res) => res.json())
    .then(renderKeys);
});
socket.on("stats_update", (keys) => {
  renderKeys(keys);
});
socket.on("log", (log) => {
  addLog(log);
});
socket.on("traffic_update", () => {
  const data = chart.data.datasets[0].data;
  data[data.length - 1] += 1;
  chart.update();
  updateTPS(data);
});

setInterval(() => {
  const data = chart.data.datasets[0].data;
  data.push(0);
  data.shift();
  chart.update();
  updateTPS(data);
}, 2000);

function updateTPS(data) {
  const total = data.reduce((a, b) => a + b, 0);
  document.getElementById("tpsIndicator").innerText =
    `${total * 2} EST. REQ/MIN`;
}
