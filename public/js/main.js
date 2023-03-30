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
    errorMessage.textContent = "Please enter search criteria";
  } else {
    errorMessage.textContent = "";
    getMacros(maxCalories, maxCarbs, maxFat, minProtein);
  }
});

function getMacros(maxCalories, maxCarbs, maxFat, minProtein) {
  const url = `/api/search?apiKey=${apiKey}&maxCarbs=${maxCarbs}&number=5&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      const displayDiv = document.querySelector("#display");
      displayDiv.innerHTML = "";

      data.forEach((macro) => {
        const macroDiv = document.createElement("div");
        const macroImageElem = document.createElement("img");
        const macroTitleElem = document.createElement("h2");

        macroImageElem.setAttribute("src", macro.image);
        macroTitleElem.innerText = `Macros - Calories: ${macro.calories}, Carbs: ${macro.carbs}, Fat: ${macro.fat}, Protein: ${macro.protein}`;

        macroDiv.appendChild(macroImageElem);
        macroDiv.appendChild(macroTitleElem);
        displayDiv.appendChild(macroDiv);

        const recipeId = macro.id;
        getRecipe(recipeId, macroDiv);
      });
    })
    .catch((err) => {
      console.log("error on fetch");
    });
}

function getRecipe(recipeId, macroDiv) {
  const url2 = `/api/recipes/${recipeId}/summary?apiKey=${apiKey}`;
  fetch(url2)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const recipeSummary = data.summary;

      // Create a new HTML element to display the recipe summary
      const recipeSummaryElem = document.createElement("p");

      // Replace anchor tags with text content
      recipeSummaryElem.innerHTML = recipeSummary.replace(
        /<a\b[^>]*>(.*?)<\/a>/gi,
        "$1"
      );

      // Add the recipe summary element to the macro div
      macroDiv.appendChild(recipeSummaryElem);
    })
    .catch((err) => {
      console.log("Error fetching recipe summary");
    });
}
