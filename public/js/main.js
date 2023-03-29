const findButton = document.querySelector("#search");
const errorMessage = document.querySelector("#errorMessage");

findButton.addEventListener("click", function () {
  const maxCalories = document.querySelector("#calories").value;
  const maxCarbs = document.querySelector("#carbs").value;
  const maxFat = document.querySelector("#fat").value;
  const minProtein = document.querySelector("#protein").value;
  if (
    maxCalories === "" &&
    maxCarbs === "" &&
    maxFat === "" &&
    minProtein === ""
  ) {
    errorMessage.textContent = "Please enter search criteria.";
  } else {
    getMacros(maxCalories, maxCarbs, maxFat, minProtein);
  }
});

function getMacros(maxCalories, maxCarbs, maxFat, minProtein) {
  const url = `/api/search?apiKey=${apiKey}&maxCarbs=${maxCarbs}&number=1&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;

  fetch(url)
    .then((res) => {
      // console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);

      const recipeId = data[0].id;

      const displayDiv = document.querySelector("#display");
      displayDiv.innerHTML = "";

      data.forEach((recipe) => {
        const recipeDiv = document.createElement("div");
        const imgElem = document.createElement("img");
        imgElem.src = recipe.image;
        const titleElem = document.createElement("p");
        titleElem.innerText = recipe.title;
        const infoElem = document.createElement("p");
        infoElem.innerText = `Calories: ${recipe.calories}, Carbs: ${recipe.carbs}, Fat: ${recipe.fat}, Protein: ${recipe.protein}`;

        recipeDiv.appendChild(imgElem);
        recipeDiv.appendChild(titleElem);
        recipeDiv.appendChild(infoElem);
        displayDiv.appendChild(recipeDiv);
      });
      getRecipe(recipeId);
    })
    .catch((err) => {
      console.log("error on fetch");
    });
}

function getRecipeById() {
  const recipeId = document.querySelector("#recipeId").value;
  getRecipe(recipeId);
}

function getRecipe(recipeId) {
  const url2 = `/api/recipes/${recipeId}/summary?apiKey=${apiKey}`;
  fetch(url2)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const recipeSummary = data.summary;

      // Create a new HTML element to display the recipe summary
      const recipeSummaryElem = document.createElement("p");
      recipeSummaryElem.innerHTML = recipeSummary;

      // Add the recipe summary element to the display div
      const displayDiv = document.querySelector("#recipe");

      displayDiv.appendChild(recipeSummaryElem);
    })
    .catch((err) => {
      console.log("Error fetching recipe summary");
    });
}
