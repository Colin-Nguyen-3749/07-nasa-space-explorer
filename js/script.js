// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// NASA APOD API key (demo key allows 30 requests per hour)
const NASA_API_KEY = 'jh5WYQXLMNkrNftDJ4fSzkKTaeQAdyNLpcwofk82';
const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Add click event listener to the "Get Space Images" button
getImagesBtn.addEventListener('click', function() {
  // Get the selected dates from the input fields
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Call function to fetch images from NASA API
  fetchNASAImages(startDate, endDate);
});

// Function to fetch images from NASA APOD API
async function fetchNASAImages(startDate, endDate) {
  try {
    // Show loading message while fetching data
    gallery.innerHTML = '<div class="loading">🚀 Loading space images...</div>';
    
    // Build the API URL with date range and API key
    const apiUrl = `${NASA_API_BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    
    // Make the API request
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Convert response to JSON
    const data = await response.json();
    
    // Display the images in the gallery
    displayImages(data);
    
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error('Error fetching NASA images:', error);
    gallery.innerHTML = `
      <div class="error">
        <div class="error-icon">❌</div>
        <p>Sorry, there was an error loading the space images. Please try again.</p>
      </div>
    `;
  }
}

// Function to display the fetched images in the gallery
function displayImages(images) {
  // Clear the gallery first (removes the placeholder)
  gallery.innerHTML = '';
  
  // Check if we received any images
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <p>No images found for the selected date range.</p>
      </div>
    `;
    return;
  }
  
  // Loop through each image from NASA API
  images.forEach(function(item) {
    // Create a new div element for each gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Only show actual images (skip videos for simplicity)
    if (item.media_type === 'image') {
      // Use template literal to create the HTML for each gallery item
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <div class="item-info">
          <h3>${item.title}</h3>
          <p class="date">${item.date}</p>
        </div>
      `;
      
      // Add the gallery item to the gallery container
      gallery.appendChild(galleryItem);
    }
  });
  
  // If no images were found (only videos), show a message
  if (gallery.children.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <p>No images found for this date range (only videos available).</p>
      </div>
    `;
  }
};

