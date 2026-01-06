document.addEventListener("DOMContentLoaded", function (event) {
  let os = "";
  let so = "";

  const images = document.querySelectorAll("img[data-size]");
  images.forEach((img) => {
    const size = img.getAttribute("data-size").trim();

    images.forEach((img) => {
      const size = img.dataset.size;

      if (!size.endsWith("%")) return;

      const scale = parseFloat(size) / 100;

      const originalSrc = img.src;
      const image = new Image();
      image.crossOrigin = "anonymous"; // tránh lỗi CORS nếu có
      image.src = originalSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const newWidth = image.naturalWidth * scale;
        const newHeight = image.naturalHeight * scale;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // đổi src của img thành ảnh đã resize
        img.src = canvas.toDataURL("image/jpeg", 0.9);
      };
    });
  });

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
