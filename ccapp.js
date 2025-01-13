const selectCurrency = document.querySelector("#currency");
const selectCryptocurrency = document.querySelector("#cryptocurrency");
const dataContainer = document.querySelector("#data-container");
const form = document.querySelector("#form");

async function fetchCryptocurrencies() {
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    // Make the GET request to the API
    const response = await fetch(url);

    // If the response is successful
    if (response.ok) {
      // Convert the response into a JavaScript object
      const data = await response.json();

      if (data.Data.length > 0) {
        UserInterface.addCryptocurrenciesToSelect(data.Data);
      } else {
        console.log("Error: Empty cryptocurrency array");
      }
    } else {
      // If the response is not successful, throw an error
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

const selectionsObject = {
  currency: "",
  cryptocurrency: "",
};

function getSelection(e) {
  selectionsObject[e.target.name] = e.target.value;
}

function validateSelections(e) {
  e.preventDefault();

  if (selectionsObject.currency === "" || selectionsObject.cryptocurrency === "") {
    UserInterface.showErrorAlert("Both fields are required");
    return;
  }

  // If both fields are selected
  fetchAllTheCurrentTradingInfo();
}

async function fetchAllTheCurrentTradingInfo() {
  const { cryptocurrency, currency } = selectionsObject;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

  UserInterface.showLoader();

  try {
    // Make the GET request to the API
    const response = await fetch(url);

    // If the response is successful
    if (response.ok) {
      // Convert the response into a JavaScript object
      const data = await response.json();

      UserInterface.showAllTheCurrentTradingInfo(data.DISPLAY[cryptocurrency][currency]);
    } else {
      // If the response is not successful, throw an error
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(error);
  }
}

class UserInterface {
  static addCryptocurrenciesToSelect(cryptocurrencies) {
    cryptocurrencies.forEach((crypto) => {
      const {
        CoinInfo: { FullName, Name },
      } = crypto;

      // Create the <option></option>
      const option = document.createElement("option");
      option.value = Name;
      option.textContent = FullName;

      selectCryptocurrency.appendChild(option);
    });
  }

  static showErrorAlert(message) {
    const exist = document.querySelector(".error-alert");

    if (exist) return;

    // Create the alert
    const errorAlert = document.createElement("div");
    errorAlert.textContent = message;
    errorAlert.classList.add("error-alert");

    // Add the alert to the container
    form.appendChild(errorAlert);

    // Remove the alert after 2 seconds
    setTimeout(() => {
      errorAlert.remove();
    }, 2000);
  }

  static showAllTheCurrentTradingInfo(data) {
    const { PRICE, CHANGE24HOUR, HIGHDAY, LOWDAY, LASTUPDATE } = data;

    // Clear HTML
    UserInterface.clearHTML();

    // Price card

    const cardPrice = document.createElement("article");
    cardPrice.classList.add("card");

    const titlePrice = document.createElement("p");
    titlePrice.classList.add("card__title");
    titlePrice.textContent = "The price is";

    const dataPrice = document.createElement("h3");
    dataPrice.classList.add("card__data");
    dataPrice.textContent = PRICE;

    cardPrice.appendChild(titlePrice);
    cardPrice.appendChild(dataPrice);

    dataContainer.appendChild(cardPrice);

    // Change 24 Hour card

    const cardChange24Hour = document.createElement("article");
    cardChange24Hour.classList.add("card");

    const titleChange24Hour = document.createElement("p");
    titleChange24Hour.classList.add("card__title");
    titleChange24Hour.textContent = "24 Hour Change";

    const dataChange24Hour = document.createElement("h3");
    dataChange24Hour.classList.add("card__data");
    dataChange24Hour.textContent = CHANGE24HOUR;

    cardChange24Hour.appendChild(titleChange24Hour);
    cardChange24Hour.appendChild(dataChange24Hour);

    dataContainer.appendChild(cardChange24Hour);

    // High Day card
    const cardHighDay = document.createElement("article");
    cardHighDay.classList.add("card");

    const titleHighDay = document.createElement("p");
    titleHighDay.classList.add("card__title");
    titleHighDay.textContent = "Highest Price of the Day";

    const dataHighDay = document.createElement("h3");
    dataHighDay.classList.add("card__data");
    dataHighDay.textContent = HIGHDAY;

    cardHighDay.appendChild(titleHighDay);
    cardHighDay.appendChild(dataHighDay);

    dataContainer.appendChild(cardHighDay);

    // Low Day card
    const cardLowDay = document.createElement("article");
    cardLowDay.classList.add("card");

    const titleLowDay = document.createElement("p");
    titleLowDay.classList.add("card__title");
    titleLowDay.textContent = "Lowest Price of the Day";

    const dataLowDay = document.createElement("h3");
    dataLowDay.classList.add("card__data");
    dataLowDay.textContent = LOWDAY;

    cardLowDay.appendChild(titleLowDay);
    cardLowDay.appendChild(dataLowDay);

    dataContainer.appendChild(cardLowDay);

    // Last Update card

    const cardLastUpdate = document.createElement("article");
    cardLastUpdate.classList.add("card");

    const titleLastUpdate = document.createElement("p");
    titleLastUpdate.classList.add("card__title");
    titleLastUpdate.textContent = "Last Update";

    const dataLastUpdate = document.createElement("h3");
    dataLastUpdate.classList.add("card__data");
    dataLastUpdate.textContent = LASTUPDATE;

    cardLastUpdate.appendChild(titleLastUpdate);
    cardLastUpdate.appendChild(dataLastUpdate);

    dataContainer.appendChild(cardLastUpdate);
  }

  static clearHTML() {
    // While dataContainer has a first child
    while (dataContainer.firstChild) {
      // Remove the first child of dataContainer
      dataContainer.removeChild(dataContainer.firstChild);
    }
  }

  static showLoader() {
    UserInterface.clearHTML();

    const loaderContainer = document.createElement("div");
    loaderContainer.classList.add("loader-container");

    dataContainer.appendChild(loaderContainer);

    const loader = document.createElement("span");
    loader.classList.add("loader");

    loaderContainer.appendChild(loader);
  }
}

class App {
  constructor() {
    this.initApp();
  }

  initApp() {
    // Fetch the 10 most popular cryptocurrencies and add them to the <select> 'Choose your cryptocurrency'
    fetchCryptocurrencies();

    // "change" is triggered every time the user selects a different option in the <select> element
    selectCurrency.addEventListener("change", getSelection);
    selectCryptocurrency.addEventListener("change", getSelection);

    // On clicking 'Get Quote', validate the selections
    form.addEventListener("submit", validateSelections);
  }
}

window.addEventListener("load", () => {
  const app = new App();
});