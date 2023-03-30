findButton = document.querySelector("#search");
const clearButton = document.querySelector("#clear");
const errorMessage = document.querySelector("#errorMessage");

const displayInput = document.querySelector("#display");
const displayDiv = displayInput;

const caloriesInput = document.querySelector("#calories");
const carbsInput = document.querySelector("#carbs");
const fatInput = document.querySelector("#fat");
const proteinInput = document.querySelector("#protein");

findButton.addEventListener("click", function () {
  const maxCalories = caloriesInput.value;
  const maxCarbs = carbsInput.value;
  const maxFat = fatInput.value;
  const minProtein = proteinInput.value;

  if (
    maxCalories === "" ||
    maxCarbs === "" ||
    maxFat === "" ||
    minProtein === ""
  ) {
    errorMessage.textContent = "Please enter search criteria";
  } else {
    errorMessage.textContent = "";
    getMacros(maxCalories, maxCarbs, maxFat, minProtein);
  }
});

clearButton.addEventListener("click", function () {
  errorMessage.textContent = "";
  caloriesInput.value = "";
  carbsInput.value = "";
  fatInput.value = "";
  proteinInput.value = "";

  displayDiv.innerHTML = "";
});

function getMacros(maxCalories, maxCarbs, maxFat, minProtein) {
  const url = `/api/search?apiKey=${apiKey}&maxCarbs=${maxCarbs}&number=6&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      displayDiv.innerHTML = "";

      data.forEach((macro) => {
        const macroContainer = document.createElement("div");
        macroContainer.classList.add("macro-container");

        const macroImageElem = document.createElement("img");
        macroImageElem.classList.add("macro-image");
        macroImageElem.setAttribute("src", macro.image);

        const macroTitleElem = document.createElement("h2");
        macroTitleElem.classList.add("macro-title");
        macroTitleElem.innerText = `Macros - Calories: ${macro.calories}, Carbs: ${macro.carbs}, Fat: ${macro.fat}, Protein: ${macro.protein}`;

        macroContainer.appendChild(macroImageElem);
        macroContainer.appendChild(macroTitleElem);

        displayDiv.appendChild(macroContainer);

        const recipeId = macro.id;
        getRecipe(recipeId, macroContainer);
      });
    });
}

function getRecipe(recipeId, macroDiv) {
  const url2 = `/api/recipes/${recipeId}/summary?apiKey=${apiKey}`;
  fetch(url2)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const recipeSummary = data.summary;

      const recipeSummaryElem = document.createElement("p");
      recipeSummaryElem.classList.add("recipe-container");

      recipeSummaryElem.innerHTML = recipeSummary.replace(
        /<a\b[^>]*>(.*?)<\/a>/gi,
        "$1"
      );

      macroDiv.appendChild(recipeSummaryElem);
    })
    .catch((err) => {
      console.log("Error fetching recipe summary");
    });
}
