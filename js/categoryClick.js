document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners to category and tag links
    const categoryAndTagLinks = document.querySelectorAll(".cat a[data-category], .tags a[data-category]");
    categoryAndTagLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const category = link.getAttribute("data-category"); // Get the category or tag name
        updateURLWithCategory(category);
        event.preventDefault(); // Prevent the default behavior of anchor tags
      });
    });
  
    function updateURLWithCategory(category) {
        const pathToSearch = "../../search.html"; // Adjust the relative path as needed
        const searchParams = new URLSearchParams();
        searchParams.set("cat", category);
      
        const newURL = new URL(pathToSearch, window.location.origin);
        newURL.search = searchParams.toString();
        window.location.href = newURL.href; // Navigate to the new URL
      }
    
});
    
