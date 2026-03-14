const GS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvHFutFktjUdVPFqtIC5ELZ14dgRzuoroY3DK-SuO6W5t1UUJK0udhhIeOJ6bcbbpe0g/exec";

async function fetchData() {
  const r = await fetch(GS_SCRIPT_URL);
  if (!r.ok) throw new Error(r.status);
  return await r.json();
}

async function clearCache() {
  return await fetch(GS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
  });
}

async function domReady() {
  if (document.readyState !== "loading") return;
  await new Promise((resolve) =>
    document.addEventListener("DOMContentLoaded", resolve, { once: true })
  );
}

Promise.all([fetchData(), domReady()]).then(([data]) => {
  document.getElementById("loadingOverlay").classList.add("hidden");
  document.getElementById("open").addEventListener("click", openClick);
  document.getElementById("times").addEventListener("change", (e) => {
    document.getElementById("songs").value = e.target.value;
  });

  updateClock();
  setInterval(updateClock, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("admin")) {
    document.getElementById("refresh").removeAttribute("hidden");
    document.getElementById("refresh").addEventListener("click", refreshClick);
  }

  fillData(data);
});

const updateClock = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  document.getElementById(
    "clock"
  ).textContent = `${hh}:${mm}:${ss} ngày ${day}/${month}/${year}`;
};

const clearData = () => {
  const select = document.getElementById("times");
  select.selectedIndex = 0;
  select.dispatchEvent(new Event("change"));
  while (select.options.length > 1) {
    select.remove(1);
  }
};

const fillData = (data) => {
  if (!data) return;

  const select = document.getElementById("times");
  data.forEach((row) => {
    const opt = document.createElement("option");
    opt.value = row.Songs;
    opt.textContent = row.Date;
    select.appendChild(opt);
  });
};

const openUrl = (url) => {
  const win = window.open(url, "_blank");
  if (win) {
    //Browser has allowed it to be opened
    win.focus();
  } else {
    //Browser has blocked it
    alert("Please allow popups for this website");
    return false;
  }

  return true;
};

const appxMapping = {
  1: 5,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
}

const openClick = () => {
  const songUrl = "https://bookvn.net/newsong/newsong";
  const songIds = document
    .getElementById("songs")
    .value.replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/);
  for (const id of songIds) {
    let url = "";
    if (id.startsWith("PL")) {
      const s = parseInt(id.substring(2));
      if (Number.isInteger(s)) {
        url = songUrl + "-appx00" + appxMapping[s] + "/";
      }
    } else {
      const s = parseInt(id);
      if (Number.isInteger(s)) {
        url = songUrl + s + "/";
      }
    }

    if (url === "") continue;

    const result = openUrl(url);
    if (!result) return;
  }
};

const refreshClick = async () => {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  clearData();
  await clearCache();
  const data = await fetchData();
  fillData(data);
  document.getElementById("loadingOverlay").classList.add("hidden");
};
