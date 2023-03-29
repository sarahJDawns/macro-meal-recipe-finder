document.querySelector("#search").addEventListener("click", getRecipe);

function getRecipe() {
  const maxCalories = document.querySelector("#calories").value;
  const maxCarbs = document.querySelector("#carbs").value;
  const maxFat = document.querySelector("#fat").value;
  const minProtein = document.querySelector("#protein").value;

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

        fetch(
          `https://api.spoonacular.com/recipes/${id}/summary?apiKey=${apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            const recipeSummary = data.summary;

            // Create a new HTML element to display the recipe summary
            const recipeSummaryElem = document.createElement("p");
            recipeSummaryElem.innerText = recipeSummary;

            // Add the recipe summary element to the display div
            const displayDiv = document.querySelector("#display");

            displayDiv.appendChild(recipeSummaryElem);
          })
          .catch((err) => {
            console.log("Error fetching recipe summary:", err);
          });
      });
    })
    .catch((err) => {
      console.log("error on fetch");
    });
}
