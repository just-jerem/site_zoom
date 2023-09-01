document.addEventListener("DOMContentLoaded", function () {
  const articlesPerPage = 7;
  const masonryContainer = document.querySelector(".bricks-wrapper");
  const articles = [...document.querySelectorAll(".brick")];
  const searchInput = document.querySelector(".search-field");
  const searchError = document.querySelector(".search-error");
  const articlesContainer = document.querySelector(".articles-container");
  const categoryButtons = document.querySelectorAll(".category-button");

  let filteredArticles = articles.slice();
  let currentPage = 1;
  let masonry;
  let selectedCategories = [];

  const categoryAndTagLinks = document.querySelectorAll(".cat-links a[data-category]");
  categoryAndTagLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const category = link.getAttribute("data-category"); // Get the category or tag name
      updateURLWithCategory(category);
      event.preventDefault(); // Prevent the default behavior of anchor tags
    });
  });

  // Call updateCategoryButtons after updating selectedCategories
function toggleCategory(category) {
  const categoryIndex = selectedCategories.indexOf(category);
  if (categoryIndex === -1) {
    selectedCategories.push(category);
  } else {
    selectedCategories.splice(categoryIndex, 1);
  }
  filterByCategories(selectedCategories);
  updateURL(selectedCategories);

  // Call updateCategoryButtons after updating selectedCategories
  updateCategoryButtons();
}


  function updateCategoryButtons() {
    // Update the active state of category buttons based on selectedCategories
    categoryButtons.forEach((button) => {
      const selectedCategory = button.getAttribute("data-category");
      if (selectedCategories.includes(selectedCategory)) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Call updateCategoryButtons after initializing categoryButtons
updateCategoryButtons();

  function updateURLWithCategory(category) {
    const pathToSearch = "../../search.html"; // Adjust the relative path as needed
    const searchParams = new URLSearchParams();
    searchParams.set("cat", category);
  
    const newURL = new URL(pathToSearch, window.location.origin);
    newURL.search = searchParams.toString();
    window.location.href = newURL.href;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const categoryParam = urlSearchParams.get("cat");

  if (categoryParam) {
    const categoriesToFilter = categoryParam.split(",");
    selectedCategories = categoriesToFilter;
    filterByCategories(selectedCategories);
    updateCategoryButtons(); // Update the active state of category buttons
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      toggleCategory(category);
    });
  });

  

  function filterByCategories(selectedCategories) {
    filteredArticles = articles.filter((article) =>
      selectedCategories.every((category) =>
        article.querySelector(".cat-links").textContent.includes(category)
      ) &&
      article.textContent.toLowerCase().includes(searchInput.value.toLowerCase()) // Include this condition
    );
  
    currentPage = 1;
    updatePagination();
  
    if (filteredArticles.length === 0) {
      showNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }
  }

  function filterByCategoriesAndSearch(selectedCategories) {
    filteredArticles = articles.filter((article) =>
      selectedCategories.every((category) =>
        article.querySelector(".cat-links").textContent.includes(category)
      ) &&
      article.textContent.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  
    currentPage = 1;
    updatePagination();
  
    if (filteredArticles.length === 0) {
      showNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }
  }

  function filterArticles(query) {
    const lowerCaseQuery = query.toLowerCase();
    searchInput.value = query; // Set the search input value
    filterByCategoriesAndSearch(selectedCategories); // Trigger filtering by categories and search
    searchError.style.display = filteredArticles.length > 0 ? "none" : "block";
    updatePagination();
  }
  

  function showNoResultsMessage() {
    const noResultsMessage = document.getElementById("no-results-message");
    noResultsMessage.style.display = "block";
  }

  function hideNoResultsMessage() {
    const noResultsMessage = document.getElementById("no-results-message");
    noResultsMessage.style.display = "none";
  }

  function updateURL(categories) {
    const searchParams = new URLSearchParams(window.location.search);
    if (categories.length > 0) {
      searchParams.set("cat", categories.join(","));
    } else {
      searchParams.delete("cat");
    }

    const newURL = new URL(window.location.href);
    newURL.search = searchParams.toString();
    history.replaceState(null, "", newURL);
  }



  function updateURLWithCategory(category) {
    const pathToSearch = "../../search.html"; // Adjust the relative path as needed
    const searchParams = new URLSearchParams();
    searchParams.set("cat", category);
  
    const newURL = new URL(pathToSearch, window.location.origin);
    newURL.search = searchParams.toString();
    window.location.href = newURL.href;
  }

  // Select the reset button element
  const resetCategoriesButton = document.getElementById("reset-categories-button");

  // Add a click event listener to the reset button
  resetCategoriesButton.addEventListener("click", () => {
    resetCategories(); // Call the resetCategories function
  });

  function resetCategories() {
    selectedCategories = []; // Reset the selected categories array
    filterByCategories(selectedCategories); // Update the UI
    updateCategoryButtons(); // Update the active state of category buttons
    updateURL(selectedCategories); // Update the URL
  }

  function updatePagination() {
    const totalPages = getTotalPages(filteredArticles);

    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = currentPage * articlesPerPage;
    const visibleArticles = filteredArticles.slice(startIndex, endIndex);

    articles.forEach((article) => {
      article.style.display = "none";
    });

    visibleArticles.forEach((article) => {
      article.style.display = "block";
    });

    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i.toString();
      button.addEventListener("click", () => {
        goToPage(i);
      });

      if (i === currentPage) {
        button.classList.add("active");
      }

      paginationContainer.appendChild(button);
    }

    const previousPageButton = document.getElementById("previous-page-button");
    const nextPageButton = document.getElementById("next-page-button");

    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    if (masonry) {
      masonry.reloadItems();
      masonry.layout();
    } else {
      masonry = new Masonry(masonryContainer, {
        itemSelector: ".brick",
        columnWidth: ".grid-sizer",
        percentPosition: true,
        transitionDuration: 0,
      });
    }

      // Display selected categories as active
  categoryButtons.forEach((button) => {
    const selectedCategory = button.getAttribute("data-category");
    if (selectedCategories.includes(selectedCategory)) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  if (filteredArticles.length === 0) {
    showNoResultsMessage();
  } else {
    hideNoResultsMessage();
  }
  }

  function goToPage(page) {
    currentPage = page;
    updatePagination();
    onPageChange(currentPage);
  }

  function getTotalPages(filtered) {
    return Math.ceil(filtered.length / articlesPerPage);
  }

  function onPageChange(page) {
    console.log(`Accessing page ${page}`);
  }

  function filterArticles(query) {
    const lowerCaseQuery = query.toLowerCase();
    searchInput.value = query; // Set the search input value
    filterByCategories(selectedCategories); // Trigger filtering by categories
    filteredArticles = filteredArticles.filter((article) =>
      article.textContent.toLowerCase().includes(lowerCaseQuery)
    );
  
    searchError.style.display = filteredArticles.length > 0 ? "none" : "block";
  
    updatePagination();
  }

  const searchForm = document.querySelector(".search-form");
  searchForm.addEventListener("submit", function (event) {
    console.log("Form submitted"); // Add this line

    event.preventDefault();
    const query = searchInput.value.trim();
    filterArticles(query);

    // Update the URL to include the search query as a parameter
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("s", query);
    history.replaceState(null, "", newURL);
  });

  const nextPageButton = document.getElementById("next-page-button");
  nextPageButton.addEventListener("click", () => {
    if (currentPage < getTotalPages(filteredArticles)) {
      currentPage++;
      updatePagination();
    }
  });

  const previousPageButton = document.getElementById("previous-page-button");
  previousPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  // Check if there's a search query parameter in the URL on page load
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("s");
  if (searchQuery) {
    searchInput.value = searchQuery;
    filterArticles(searchQuery);
  } else {
    updatePagination(); // Show initial pagination
  }

});
