const GS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvHFutFktjUdVPFqtIC5ELZ14dgRzuoroY3DK-SuO6W5t1UUJK0udhhIeOJ6bcbbpe0g/exec";

const dataPromise = fetch(GS_SCRIPT_URL, { method: "GET" })
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .catch((err) => {
    console.error(err);
    return null;
  });

const domReady = new Promise((res) => {
  if (document.readyState !== "loading") return res();
  document.addEventListener("DOMContentLoaded", res, { once: true });
});

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

Promise.all([dataPromise, domReady]).then(([data]) => {
  document.getElementById("loadingOverlay").classList.add("hidden");
  document.getElementById("open").addEventListener("click", openClick);

  if (!data) return;

  const select = document.getElementById("times");
  data.forEach((row) => {
    const opt = document.createElement("option");
    opt.value = row.Songs;
    opt.textContent = row.Date;
    select.appendChild(opt);
  });
  select.addEventListener("change", (e) => {
    document.getElementById("songs").value = e.target.value;
  });
});
