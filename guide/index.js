document.addEventListener("DOMContentLoaded", function (event) {
  let os = "";
  let so = "";

  GLightbox({
    onOpen: () => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    },
  });

  const hideElement = (element) => {
    if (!element) return;
    if (element.classList.contains("hidden")) return;

    element.classList.add("hidden");
  };

  const showElement = (element) => {
    if (!element) return;

    element.classList.remove("hidden");
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const hideGuide = () => {
    hideElement(document.getElementById(os + "_" + so));
  };

  const showGuide = () => {
    showElement(document.getElementById(os + "_" + so));
  };

  document.querySelectorAll('input[name="os"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      hideGuide();
      os = this.value;
      document
        .querySelectorAll('input[type="radio"][name="so"]')
        .forEach((radio) => (radio.checked = false));
      showElement(document.getElementById("step2"));
    });
  });

  document.querySelectorAll('input[name="so"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      hideGuide();
      so = this.value;
      showGuide();
    });
  });
});
