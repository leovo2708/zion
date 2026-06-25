window.onerror = function (msg, url, line, col, error) {
  alert("Error: " + msg + "\nLine: " + line + "\nCol: " + col);
  return false;
};

window.addEventListener("unhandledrejection", function (e) {
  alert("Promise Error: " + e.reason);
});

var GS_SCRIPT_URL = "https://zion.leovo2708.workers.dev";

function fetch(action) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.status);
      }
    };

    xhr.open("GET", GS_SCRIPT_URL + "?action=" + action, true);
    xhr.send();
  });
}

function fetchData() {
  return fetch("data");
}

function clearCache() {
  return fetch("clear");
}

function padLeft(value) {
  value = String(value);
  return value.length < 2 ? "0" + value : value;
}

function updateClock() {
  var now = new Date();

  var hh = padLeft(now.getHours());
  var mm = padLeft(now.getMinutes());
  var ss = padLeft(now.getSeconds());

  var year = now.getFullYear();
  var month = padLeft(now.getMonth() + 1);
  var day = padLeft(now.getDate());

  document.getElementById("clock").textContent =
    hh + ":" + mm + ":" + ss + " ngày " + day + "/" + month + "/" + year;
}

function clearData() {
  var select = document.getElementById("times");
  select.selectedIndex = 0;
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", true, false);
  select.dispatchEvent(evt);
  while (select.options.length > 1) {
    select.remove(1);
  }
}

function fillData(data) {
  if (!data) return;

  var select = document.getElementById("times");
  data.forEach(function (row) {
    var opt = document.createElement("option");
    opt.value = row.Songs;
    opt.textContent = row.Date;
    select.appendChild(opt);
  });
}

function openUrl(url) {
  var win = window.open(url, "_blank");
  if (win) {
    //Browser has allowed it to be opened
    win.focus();
  } else {
    //Browser has blocked it
    alert("Please allow popups for this website");
    return false;
  }

  return true;
}

function isInteger(value) {
  return (
    typeof value === "number" && isFinite(value) && Math.floor(value) === value
  );
}

function openClick() {
  var appxMapping = {
    1: 5,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
  };
  var songUrl = "https://bookvn.net/newsong/newsong";
  var songIds = document
    .getElementById("songs")
    .value.replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/);
  for (var i = 0; i < songIds.length; i++) {
    var id = songIds[i];
    var url = "";
    if (id.indexOf("PL") === 0) {
      var s = parseInt(id.substring(2), 10);
      if (isInteger(s)) {
        url = songUrl + "-appx00" + appxMapping[s] + "/";
      }
    } else {
      var s = parseInt(id, 10);
      if (isInteger(s)) {
        url = songUrl + s + "/";
      }
    }

    if (url === "") continue;

    var result = openUrl(url);
    if (!result) return;
  }
}

function refreshClick() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  clearData();
  clearCache()
    .then(function () {
      return fetchData();
    })
    .then(function (data) {
      fillData(data);
      document.getElementById("loadingOverlay").classList.add("hidden");
    })
    .catch(function (err) {
      console.error(err);
      document.getElementById("loadingOverlay").classList.add("hidden");
    });
}

fetchData().then(function (data) {
  document.getElementById("loadingOverlay").classList.add("hidden");
  document.getElementById("open").addEventListener("click", openClick);
  document.getElementById("times").addEventListener("change", function (e) {
    document.getElementById("songs").value = e.target.value;
  });

  updateClock();
  setInterval(updateClock, 1000);

  if (window.location.search.indexOf("admin") !== -1) {
    document.getElementById("refresh").removeAttribute("hidden");
    document.getElementById("refresh").addEventListener("click", refreshClick);
  }

  fillData(data);
});
