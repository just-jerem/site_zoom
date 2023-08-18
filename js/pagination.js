document.addEventListener('DOMContentLoaded', function() {
  const articlesPerPage = 8;
  const masonryContainer = document.querySelector('.bricks-wrapper');
  const articles = [...document.querySelectorAll('.brick')];
  const searchInput = document.querySelector('.search-field');
  const searchError = document.querySelector('.search-error');
  const articlesContainer = document.querySelector('.articles-container'); // Container for articles

  let filteredArticles = articles.slice();
  let currentPage = 1;
  let masonry;

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

    articles.forEach(article => {
      article.style.display = 'none';
    });

    visibleArticles.forEach(article => {
      article.style.display = 'block';
    });

    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

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

    const previousPageButton = document.getElementById('previous-page-button');
    const nextPageButton = document.getElementById('next-page-button');

    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

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
    filteredArticles = articles.filter(article => article.textContent.toLowerCase().includes(lowerCaseQuery));

    searchError.style.display = filteredArticles.length > 0 ? 'none' : 'block';

    updatePagination();
  }

  const searchForm = document.querySelector('.search-form');
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    filterArticles(query);

    // Update the URL to include the search query as a parameter
    const newURL = new URL(window.location.href);
    newURL.searchParams.set('s', query);
    history.replaceState(null, '', newURL);
  });

  const nextPageButton = document.getElementById('next-page-button');
  nextPageButton.addEventListener('click', () => {
    if (currentPage < getTotalPages(filteredArticles)) {
      currentPage++;
      updatePagination();
    }
  });

  const previousPageButton = document.getElementById('previous-page-button');
  previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  // Check if there's a search query parameter in the URL on page load
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('s');
  if (searchQuery) {
    searchInput.value = searchQuery;
    filterArticles(searchQuery);
  } else {
    updatePagination(); // Show initial pagination
  }
});
