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
    const url = `https://api.spoonacular.com/recipes/complexSearch?number=2&addRecipeInformation=true&instructionsRequired=true&apiKey=${apiKey}&maxCarbs=${maxCarbs}&minProtein=${minProtein}&maxCalories=${maxCalories}&maxFat=${maxFat}`;
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
        <div class="md:w-1/2 w-3/4 p-4 flex flex-col justify-center items-center">
          <div class="border border-text2 p-2 ">
          <h2 class="text-2xl font-bold mt-4 mb-2 font-body text-text text-center">${title}</h2>
          <img src="${image}" alt="${title}" class="mx-auto">
          <div class="flex flex-row flex-wrap gap-4 mt-2 mx-auto p-2">
            <p class="font-body text-sm text-text2 flex-grow"><strong>Calories:</strong> ${calories} kcal</p>
            <p class="font-body text-sm text-text2 flex-grow"><strong>Carbs:</strong> ${carbs} g</p>
            <p class="font-body text-sm text-text2 flex-grow"><strong>Fat:</strong> ${fat} g</p>
            <p class="font-body text-sm text-text2 flex-grow"><strong>Protein:</strong> ${protein} g</p>
          </div>
          <p class="font-body text-text2 mt-4 mb-2 text-center p-2">${analyzedInstructions[0].steps
            .map((step) => step.step)
            .join(" ")}</p>
          </div>
        </div>
      `;
      displayDiv.innerHTML += html;
    }
  } catch (error) {
    console.error(error);
  }
}
