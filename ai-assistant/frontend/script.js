const stocks = [
  { symbol: "RELIANCE", company: "Reliance Industries", price: 2964.5, change: 1.27, volume: "2.4M" },
  { symbol: "HDFCBANK", company: "HDFC Bank", price: 1677.1, change: -0.42, volume: "1.2M" },
  { symbol: "TCS", company: "Tata Consultancy", price: 4180.0, change: 0.85, volume: "0.7M" },
  { symbol: "SBIN", company: "State Bank of India", price: 829.2, change: 2.15, volume: "4.6M" },
  { symbol: "INFY", company: "Infosys", price: 1792.4, change: -0.73, volume: "1.8M" }
];

function renderWatchlist(items) {
  const watchlist = document.getElementById("watchlist");
  watchlist.innerHTML = items
    .map(
      (item) => `
      <div class="watchlist-item">
        <div>
          <div class="symbol">${item.symbol}</div>
          <div class="company">${item.company}</div>
        </div>
        <div style="text-align:right;">
          <div>₹${item.price.toFixed(2)}</div>
          <div class="${item.change >= 0 ? "up" : "down"}">${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}%</div>
        </div>
      </div>
    `
    )
    .join("");
}

function drawChart() {
  const canvas = document.getElementById("marketChart");
  const ctx = canvas.getContext("2d");
  const values = [22180, 22220, 22165, 22300, 22340, 22290, 22410, 22370, 22455, 22510, 22460, 22540];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#1f3866";
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const y = (canvas.height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const min = Math.min(...values) - 40;
  const max = Math.max(...values) + 40;
  const stepX = canvas.width / (values.length - 1);

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = i * stepX;
    const y = canvas.height - ((v - min) / (max - min)) * canvas.height;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#55a5ff";
  ctx.stroke();

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(85,165,255,0.35)");
  gradient.addColorStop(1, "rgba(85,165,255,0)");

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
}

function renderStats() {
  const stats = [
    { label: "NIFTY 50", value: "22,540.40" },
    { label: "Day Change", value: "+1.02%" },
    { label: "Advance/Decline", value: "34 / 16" },
    { label: "VIX", value: "12.80" }
  ];

  document.getElementById("keyStats").innerHTML = stats
    .map((s) => `<div class="stat-card"><p>${s.label}</p><strong>${s.value}</strong></div>`)
    .join("");
}

function randomizeStocks() {
  const refreshed = stocks.map((stock) => {
    const swing = (Math.random() * 2 - 1) * 0.8;
    const newChange = Number((stock.change + swing).toFixed(2));
    const newPrice = Number((stock.price * (1 + swing / 100)).toFixed(2));
    return { ...stock, change: newChange, price: newPrice };
  });

  renderWatchlist(refreshed);
}

function calculatePositionSize() {
  const capital = Number(document.getElementById("capital").value);
  const risk = Number(document.getElementById("risk").value);
  const stopLoss = Number(document.getElementById("stopLoss").value);

  if (!capital || !risk || !stopLoss) {
    document.getElementById("calcOutput").textContent = "Please enter valid values.";
    return;
  }

  const riskAmount = (capital * risk) / 100;
  const quantity = Math.floor(riskAmount / stopLoss);
  document.getElementById("calcOutput").textContent = `Risk amount: ₹${riskAmount.toFixed(2)} · Suggested quantity: ${quantity} shares`;
}

document.getElementById("refreshBtn").addEventListener("click", randomizeStocks);
document.getElementById("calcBtn").addEventListener("click", calculatePositionSize);

renderWatchlist(stocks);
renderStats();
drawChart();
