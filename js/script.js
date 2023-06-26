const URL_REPO = new URL("https://api.github.com/search/repositories");

const inputSearch = document.querySelector(".search-repo");
const listSearchRepo = document.querySelector(".auto-com__list");
const listRepo = document.querySelector(".added-repo");
let searchRepoArr;

//Предотвращает слишком частое отправление заросов
const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

//Запрос на получение репозиториев
const getRepo = async (url, pageLimit, nameRepo) => {
  url.searchParams.set("q", nameRepo);
  url.searchParams.set("per_page", `${pageLimit}`);

  const response = await fetch(url);
  const data = await response.json();
  return data.items;
};

//Создаёт список найденых репозиториев
const createItemListSearch = (repo) => {
  const li = document.createElement("li");
  li.textContent = repo.name;
  li.classList.add("auto-com__item");
  li.dataset.repoId = repo.id;
  listSearchRepo.appendChild(li);
};

//Создаёт список найденых репозиториев по ключ словам
const createListSearch = (repos) => {
  if (!repos) listSearchRepo.innerHTML = "";
  repos.forEach((el) => {
    createItemListSearch(el);
  });
};

//Добавление найденого репозитория в список
const addRepo = (e) => {
  if (e.target.classList.value === "auto-com__item") {
    let repo = searchRepoArr.find((el) => el.id == e.target.dataset.repoId);
    console.log(repo);
    console.log(e.target.dataset.repoId);
    createElementInListRepo(repo);
  }
};

//Создание карточики репозитория
const createElementInListRepo = (repo) => {
  const repoCard = `
		<div class="added-repo__item">
			<div class="added-repo__item-info">
				<p>Name: ${repo.name}</p>
				<p>Owner: ${repo.owner.login}</p>
				<p>Stars: ${repo.stargazers_count}</p>
			</div>
			<button class="delete-repo">
				<span
					class="delete-repo__span-left"
				></span>
				<span
				class="delete-repo__span-right"
				></span>
			</button>
		</div>
	`;
  listRepo.insertAdjacentHTML('afterbegin', repoCard);
};

//Удаление добавленного репозитория
const deleteRepo = (e) => {
  e.target.closest("div").remove();
}

//Поиск репозитория
function search(e) {
  if (e.target.value.trim()) {
    getRepo(URL_REPO, 5, e.target.value).then((response) => {
      searchRepoArr = response;
      createListSearch(response);
    });
    listSearchRepo.innerHTML = "";
  } else {
    listSearchRepo.innerHTML = "";
  }
}

search = debounce(search, 500);

inputSearch.addEventListener("keyup", search);
listSearchRepo.addEventListener("click", addRepo);
listRepo.addEventListener("click", deleteRepo);
