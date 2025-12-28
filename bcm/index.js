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

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("admin")) {
    document.getElementById("refresh").removeAttribute("hidden");
    document.getElementById("refresh").addEventListener("click", refreshClick);
  }

  fillData(data);
});

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

const openClick = () => {
  const songIds = document
    .getElementById("songs")
    .value.replaceAll(" ", ",")
    .replaceAll(";", ",")
    .split(",")
    .filter((item) => item !== "");
  for (const id of songIds) {
    var url;
    if (id.startsWith("PL")) {
      const s = parseInt(id.substring(2));
      if (Number.isInteger(s)) {
        url = "https://book.watv.org/newsong/newsong" + "-appx00" + s + "/";
      }
    } else {
      const s = parseInt(id);
      if (Number.isInteger(s)) {
        url = "https://book.watv.org/newsong/newsong" + s + "/";
      }
    }

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
