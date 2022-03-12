import "./module";
import "regenerator-runtime/runtime";
const listImages = document.querySelector(".wrapper");

async function getImages() {
  try {
    const images = await fetch("http://localhost:5000/api/");
    let response = await images.json();
    return response;
  } catch (e) {
    console.log(e.message);
    listImages.insertAdjacentHTML("afterbegin", `<h1 class='Error'>${e.message}</h1>`);
  }
}

export async function showImages() {
  const wrapper = document.querySelector(".wrapper");
  const images = await getImages();
  images.forEach((i) => {
    wrapper.insertAdjacentHTML(
      `afterbegin`,
      `<div class='blockPicture'>
          <img  src='http://localhost:5000/image/${i.name}'>
          <span>${i.name}</span>
      </div>`
    );
  });
}

function largeImage(src) {
  listImages.insertAdjacentHTML(
    "afterend",
    `<div class='largeImage'>
    <span>+</span>
    <img src='${src}'></div>`
  );
}

showImages();

listImages.addEventListener("click", (e) => {
  let target = e.target;
  if (target.parentElement.className === "blockPicture") {
    largeImage(target.getAttribute("src"));
  }
});

document.querySelector(".body").addEventListener("click", (e) => {
  let target = e.target;
  if (
    target.parentElement.className === "largeImage" &&
    target === target.parentElement.firstElementChild
  ) {
    target.parentElement.remove();
  }
});
