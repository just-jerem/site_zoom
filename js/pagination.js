document.addEventListener('DOMContentLoaded', function() {
  const articlesPerPage = 6; // Maximum number of articles per page
  const masonryContainer = document.querySelector('.bricks-wrapper');
  const articles = [...document.querySelectorAll('.brick')]; // Array of <article> elements

  let currentPage = 1;
  let masonry; // Masonry instance

  function updatePagination() {
    const totalPages = getTotalPages();

    // Validate and adjust current page if necessary
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = currentPage * articlesPerPage;
    const visibleArticles = articles.slice(startIndex, endIndex);

    // Hide all articles
    articles.forEach((article) => {
      article.style.display = 'none';
    });

    // Show visible articles
    visibleArticles.forEach((article) => {
      article.style.display = 'block';
    });

    // Update pagination UI (e.g., active page indicator, disable/enable buttons)
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i.toString();
      button.addEventListener('click', () => {
        goToPage(i);
      });

      if (i === currentPage) {
        button.classList.add('active');
      }

      paginationContainer.appendChild(button);
    }

    // Update previous and next buttons
    const previousPageButton = document.getElementById('previous-page-button');
    const nextPageButton = document.getElementById('next-page-button');

    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    // Initialize or reload the Masonry layout
    if (masonry) {
      masonry.reloadItems();
      masonry.layout();
    } else {
      masonry = new Masonry(masonryContainer, {
        itemSelector: '.brick',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        transitionDuration: 0,
      });
    }
  }

  function goToPage(page) {
    currentPage = page;
    updatePagination();
    onPageChange(currentPage); // Call the callback function on page change
  }

  function getTotalPages() {
    return Math.ceil(articles.length / articlesPerPage);
  }

  // Event listener for "Next Page" button click
  const nextPageButton = document.getElementById('next-page-button');
  nextPageButton.addEventListener('click', () => {
    if (currentPage < getTotalPages()) {
      currentPage++;
      updatePagination();
    }
  });

  // Event listener for "Previous Page" button click
  const previousPageButton = document.getElementById('previous-page-button');
  previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  // Callback function for page change
  function onPageChange(page) {
    // Access the newly created page here
    console.log(`Accessing page ${page}`);
  }

  // Usage example
  updatePagination();
});