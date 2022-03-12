import { showImages } from "./app";

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export const createElement = (
  element,
  classes = [],
  content = "",
  innerElement
) => {
  const node = document.createElement(element);
  node.className = [classes.join(" ")];
  node.textContent = content;
  if (innerElement) {
    innerElement.forEach((item) => {
      if (item.position === "prepend") node.prepend(item.elem);
      if (item.position === "after") node.after(item.elem);
      if (item.position === "append") node.append(item.elem);
      if (item.position === "before") node.before(item.elem);
    });
  }
  return node;
};

const moduleUpload = (
  selector,
  className,
  text,
  options = {},
  sendToServer
) => {
  let files = [];
  const notFoundPicture = createElement("h2", ["notPicture"], "Нету файлов");
  const closeModal = createElement("span", ["closeModal"], "+");
  const listFiles = createElement("div", ["listFiles"]);
  const upload = createElement("button", [className, "upload"], "Загрузить");
  const modal = createElement("div", ["modalFiles"], "", [
    { elem: upload, position: "prepend" },
    { elem: listFiles, position: "prepend" },
    { elem: closeModal, position: "append" },
  ]);
  const download = createElement("button", [className], text);

  document.querySelector(".wrapper").after(modal);
  const file = document.querySelector(`.${selector}`);
  file.after(download);

  modal.addEventListener("click", (e) => {
    let target = e.target;
    if (target.className == "remove-card") {
      files = files.filter((i) => i.name !== target.dataset.name);
      const removedItem = target.parentElement;
      removedItem.classList.add("activeRemoved");
      setTimeout(() => {
        removedItem.remove();
        if (files.length === 0) {
          listFiles.prepend(notFoundPicture);
        }
      }, 350);
    }
  });
  upload.addEventListener("click", handleUpload);
  download.addEventListener("click", () => file.click());
  file.addEventListener("change", handleOnChange);
  closeModal.addEventListener("click", handleCloseModal);
  if (options) {
    if (options.accept) file.setAttribute("accept", options.accept.join());
    if (options.multiply) file.setAttribute("multiple", true);
  }

  function readFiles(newFiles) {

    if (newFiles.length > 0) {
      modal.classList.add("active");
    } else {
      return;
    }

    if (modal.childElementCount > 0) {
      modal.firstElementChild.innerHTML = "";
    }
    
    files = Array.from(newFiles);

    files.forEach((itemFiles) => {
      if (!itemFiles.type.match("image")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        modal.firstElementChild.insertAdjacentHTML(
          "beforeend",
          `
       <div class='block-picture'>
       <span data-name='${itemFiles.name}' class='remove-card'>&times</span>
       <img class='image-card' src='${e.target.result}'/>
       <span class='name-picture'>${itemFiles.name} (${bytesToSize(
            itemFiles.size
          )})</span>
       </div> `
        );
      };
      reader.readAsDataURL(itemFiles);
    });
  }

  function handleCloseModal() {
    modal.classList.remove("active");
  }

  function handleUpload(e) {
    if (e) {
      e.preventDefault();
    }
    if (files.length === 0) {
      notFoundPicture.textContent = "Сначало выберите файлы";
      return;
    }
    sendToServer(files, handleCloseModal);
  }

  function handleOnChange(e) {
    readFiles(e.target.files);
  }
};

function submit(data, handleCloseModal) {
  const form = new FormData();
  data.forEach((file) => {
    form.append("files", file, file.name);
  });
  form.append("files", data);
  fetch("http://localhost:5000/api", {
    method: "POST",
    body: form,
  })
    .catch((err) => {
      if (err) {
        document.querySelector(".modalFiles").insertAdjacentHTML(
          "afterbegin",
          `
     <h1 class='Error-modal'>${err.message}</h1>`
        );
      }
    })
    .then(async (res) => {
      let count = await res.json();
      document.querySelector(".modalFiles").insertAdjacentHTML(
        "afterbegin",
        `
   <h1 class='Succes-modal'>Успешно загружено ${count} файлов</h1>`
      );
    });
}

moduleUpload(
  "file",
  "download",
  "Download",
  {
    multiply: true,
    accept: [".jpg", ".png", ".gif", ".jfif"],
  },
  submit
);
