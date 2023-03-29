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
      // console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);

      const macroResults = data;

      const displayDiv = document.querySelector("#display");
      displayDiv.innerHTML = "";

      macroResults.forEach((macro) => {
        const recipeId = macro.id;

        const recipeDiv = document.createElement("div");
        const imgElem = document.createElement("img");
        imgElem.src = macro.image;
        const titleElem = document.createElement("p");
        titleElem.innerText = macro.title;
        const infoElem = document.createElement("p");
        infoElem.innerText = `Calories: ${macro.calories}, Carbs: ${macro.carbs}, Fat: ${macro.fat}, Protein: ${macro.protein}`;

        recipeDiv.appendChild(imgElem);
        recipeDiv.appendChild(titleElem);
        recipeDiv.appendChild(infoElem);
        displayDiv.appendChild(recipeDiv);
        const url2 = `/api/recipes/${recipeId}/summary?apiKey=${apiKey}`;
        fetch(url2)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            const recipeSummary = data.summary;
            const recipeSummaryElem = document.createElement("p");
            recipeSummaryElem.innerHTML = recipeSummary;
            displayDiv.appendChild(recipeSummaryElem);
          })
          .catch((err) => {
            console.log("Error fetching recipe summary");
          });
      });
    });
}
