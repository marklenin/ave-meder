let API = "https://www.omdbapi.com/?apikey=b6003d8a&s=All";
let json = "http://localhost:9000/person";
let body = document.querySelector(".body");
let search = document.querySelector("#header-input");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let currentPage = 1;
let pageLength = 1;
let categoryBtns = document.querySelectorAll(".category-btns button");
let filterValue = "all";
let imgInfo = document.querySelector(".body img");
let modal = document.querySelector(".modal");

async function fromApiToJson() {
  let res = await fetch(API);
  let data = await res.json();
  for (let i of data.Search) {
    await fetch(json, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(i),
    });
  }
}
// fromApiToJson()

async function takefromjson(value = "") {
  let res =
    filterValue !== "all"
      ? await fetch(
          `${json}?q=${value}&_page=${currentPage}&_limit=5&Type=${filterValue}`
        )
      : await fetch(`${json}?q=${value}&_page=${currentPage}&_limit=5`);
  let data = await res.json();
  body.innerHTML = "";

  // console.log(data);
  data.forEach((a, i) => {
    body.innerHTML += `
    
    <div>
      <p>${i + 1}</p>
      <p>
        <img onclick="dopInfo(${a.id})"
          src="${a.Poster}"
          alt=""
          width="35"
        />
      </p>
      <p>${a.Title}</p>
      <p>${a.Year}</p>
      <p>${a.Type}</p>
      <button >edit</button>
      <button onclick="deleteFunc(${a.id})">delete</button>
    </div>
    
    `;
  });
  checkpages();
}

async function checkpages() {
  let res = await fetch(json);
  let data = await res.json();
  pageLength = Math.ceil(data.length / 5);
}

previous.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  takefromjson();
});

next.addEventListener("click", () => {
  if (currentPage >= pageLength) return;
  currentPage++;
  takefromjson();
});

//!delete

async function deleteFunc(id) {
  await fetch(`${json}/${id}`, {
    method: "DELETE",
  });
  takefromjson();
}

//!start filter

categoryBtns.forEach((a) => {
  a.addEventListener("click", () => {
    filterValue = a.innerText;
    takefromjson();
  });
});

//!dopInfo

async function dopInfo(id) {
  let res = await fetch(`${json}/${id}`);
  let data = await res.json();
  modal.innerHTML = `
  <img src="${data.Poster} alt="#" width=250">
  <div>
  <h1>${data.Title}</h1>
  <h2>${data.Year}</h2>
  <h3>${data.Type}</h3>
  </div>
  <button onclick="closeModal()">x</button>`;
}

function closeModal() {
  modal.style.display = "none";
}

let adminBtn = document.getElementById("adminBtn");
let askPass = document.getElementById("askPass");

askPass.style.display = "none";

adminBtn.addEventListener("click", () => {
  askPass.style.display = "block";
  askPass.style.cssText = "border: 2px solid green";
});

async function simpleUser(value = "") {
  let res = null;
  if (search.value.length != 0) {
    res =
      filterValue !== "all"
        ? await fetch(`${json}?q=${value}&Type=${filterValue}`)
        : await fetch(`${json}?q=${value}`);
  } else {
    res =
      filterValue !== "all"
        ? await fetch(
            `${json}_page=${currentPage}&_limit=5&Type=${filterValue}&?q=${value}`
          )
        : await fetch(`${json}?q=${value}&_page=${currentPage}&_limit=5`);
  }
  let data = await res.json();
  body.innerHTML = "";

  // console.log(data);
  data.forEach((a, i) => {
    body.innerHTML += `
    
    <div>
      <p>${i + 1}</p>
      <p>
        <img onclick="dopInfo(${a.id})"
          src="${a.Poster}"
          alt=""
          width="35"
        />
      </p>
      <p>${a.Title}</p>
      <p>${a.Year}</p>
      <p>${a.Type}</p>
    </div>
    
    `;
  });
  checkpages();
}
simpleUser();

async function searchFunc(value = "") {
  let res = await fetch(`${json}?q=${value}`);
  let data = await res.json();
  body.innerHTML = "";
  console.log(data);
  // console.log(data);
  data.forEach((a, i) => {
    body.innerHTML += `
    
    <div>
      <p>${i + 1}</p>
      <p>
        <img onclick="dopInfo(${a.id})"
          src="${a.Poster}"
          alt=""
          width="35"
        />
      </p>
      <p>${a.Title}</p>
      <p>${a.Year}</p>
      <p>${a.Type}</p>
    </div>
    
    `;
  });
}

search.addEventListener("input", (e) => {
  searchFunc(e.target.value);
  // console.log(e.target.value);
});

async function checkPassword() {
  let res = await fetch("http://localhost:9000/admin");
  let data = await res.json();
  console.log(data[0].password);
  if (askPass.value == data[0].password) {
    takefromjson();
  }
}

askPass.addEventListener("change", checkPassword);
console.log(askPass);
