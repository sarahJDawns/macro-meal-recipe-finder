const inputs = document.querySelectorAll("input");
const searchButton = document.querySelector("button.searchButton");
const clearButton = document.querySelector("button.clearButton");
const errorMessage = document.querySelector(".errorMessage");
const displayDiv = document.querySelector(".display");

searchButton.addEventListener("click", function () {
  const isEmpty = Array.from(inputs).some((input) => input.value === "");

  if (isEmpty) {
    errorMessage.textContent = "Please enter search criteria.";
  } else {
    errorMessage.textContent = "";
    const [maxCalories, maxCarbs, maxFat, minProtein] = Array.from(inputs).map(
      (input) => input.value
    );
    getRecipesWithMacros(maxCalories, maxCarbs, maxFat, minProtein);
  }
});

clearButton.addEventListener("click", () => {
  inputs.forEach((input) => (input.value = ""));
  displayDiv.innerHTML = "";
  errorMessage.textContent = "";
});

async function getRecipesWithMacros(maxCalories, maxCarbs, maxFat, minProtein) {
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?number=4&addRecipeInformation=true&instructionsRequired=true&apiKey=${apiKey}&maxCarbs=${maxCarbs}&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;
    const response = await fetch(url);
    const data = await response.json();

    const { results } = data;

    displayDiv.innerHTML = "";

    for (const recipe of results) {
      const { image, nutrition, title, analyzedInstructions } = recipe;

      const calories = nutrition.nutrients[0].amount;
      const protein = nutrition.nutrients[1].amount;
      const fat = nutrition.nutrients[2].amount;
      const carbs = nutrition.nutrients[3].amount;

      const html = `
          <h2>${title}</h2>
          <img src="${image}" alt="${title}" ">
          <div>
            <span><strong>Calories:</strong> ${calories} kcal</span>
            <span><strong>Carbs:</strong> ${carbs} g</span>
            <span><strong>Fat:</strong> ${fat} g</span>
            <span><strong>Protein:</strong> ${protein} g</span>
          </div>
          <p >${analyzedInstructions[0].steps
            .map((step) => step.step)
            .join(" ")}</p>
      `;
      displayDiv.innerHTML += html;
    }
  } catch (error) {
    console.error(error);
  }
}
