// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Intro animation control
  setTimeout(function () {
    document.body.classList.add('loaded');

    setTimeout(function () {
      const introElement = document.getElementById('introAnimation');
      if (introElement) {
        introElement.style.display = 'none';
      }
    }, 1000);
  }, 4000);


  
  // 2. Get references to the HTML elements
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const resultsContainer = document.getElementById('results-container');

  // 3. Add an event listener to the search button
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      fetchBooks(query);
    } else {
      showError("Please enter a book title or author name!");
    }
  });

  // Add an event listener to the search input to listen for the "Enter" key
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        fetchBooks(query);
      } else {
        showError("Please enter a book title or author name!");
      }
    }
  });

  
  function fetchBooks(query) {

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;

    // Show a loading message
    resultsContainer.innerHTML = '<p class="loading">Loading books...</p>';

    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        displayResults(data);
      })
      .catch(error => {
        showError(`Error: ${error.message}. Please try again later.`);
        console.error('Error:', error);
      });
  }

  // 5. Function to display the book results
  function displayResults(data) {
    resultsContainer.innerHTML = '';

    if (!data.items || data.items.length === 0) {
      showError('No books found. Try a different search!');
      return;
    }

    data.items.forEach(book => {
      const volumeInfo = book.volumeInfo;
      const title = volumeInfo.title || 'No title available';
      const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
      const thumbnail = volumeInfo.imageLinks ?
        volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') :
        'https://via.placeholder.com/150x200?text=No+Image';
      const infoLink = volumeInfo.infoLink || '#';

      const bookElement = document.createElement('div');
      bookElement.classList.add('book-card');
      bookElement.innerHTML = `
                        <img src="${thumbnail}" alt="Cover of ${title}">
                        <h3>${title}</h3>
                        <p><strong>Author:</strong> ${authors}</p>
                        <a href="${infoLink}" target="_blank">View Book</a>
                    `;

      resultsContainer.appendChild(bookElement);
    });
  }

  // Helper function to show errors
  function showError(message) {
    resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
});