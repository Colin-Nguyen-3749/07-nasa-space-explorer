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

// Find modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeButton = document.querySelector('.close-button');

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
  
  // Loop through each item from NASA API (can be image or video)
  images.forEach(function(item) {
    // Create a new div element for each gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Handle different media types
    if (item.media_type === 'image') {
      // Create gallery item for images
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <div class="item-info">
          <h3>${item.title}</h3>
          <p class="date">${item.date}</p>
        </div>
      `;
      
      // Add click event listener to open modal when gallery item is clicked
      galleryItem.addEventListener('click', function() {
        openModal(item);
      });
      
    } else if (item.media_type === 'video') {
      // Create gallery item for videos with a placeholder and link
      galleryItem.innerHTML = `
        <div class="video-placeholder">
          <div class="video-icon">🎬</div>
          <div class="video-text">
            <p>Video Content</p>
            <a href="${item.url}" target="_blank" class="video-link">Watch Video</a>
          </div>
        </div>
        <div class="item-info">
          <h3>${item.title}</h3>
          <p class="date">${item.date}</p>
        </div>
      `;
      
      // Add click event listener to open modal for video content too
      galleryItem.addEventListener('click', function(event) {
        // Don't open modal if user clicked the video link
        if (event.target.classList.contains('video-link')) {
          return;
        }
        openModal(item);
      });
    }
    
    // Add the gallery item to the gallery container
    gallery.appendChild(galleryItem);
  });
  
  // Show message if no items were processed
  if (gallery.children.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <p>No content found for this date range.</p>
      </div>
    `;
  }
}

// Function to open the modal with image or video details
function openModal(itemData) {
  // Set the modal text content (works for both images and videos)
  modalTitle.textContent = itemData.title;
  modalDate.textContent = itemData.date;
  modalExplanation.textContent = itemData.explanation;
  
  // Handle different media types in the modal
  if (itemData.media_type === 'image') {
    // For images, show the image
    modalImage.src = itemData.url;
    modalImage.alt = itemData.title;
    modalImage.style.display = 'block';
    
  } else if (itemData.media_type === 'video') {
    // For videos, hide the image and show a video placeholder
    modalImage.style.display = 'none';
    
    // Create a video placeholder in the modal if it doesn't exist
    let videoPlaceholder = document.getElementById('modalVideoPlaceholder');
    if (!videoPlaceholder) {
      videoPlaceholder = document.createElement('div');
      videoPlaceholder.id = 'modalVideoPlaceholder';
      videoPlaceholder.className = 'modal-video-placeholder';
      // Insert before the modal-info div
      const modalInfo = document.querySelector('.modal-info');
      modalInfo.parentNode.insertBefore(videoPlaceholder, modalInfo);
    }
    
    // Set the video placeholder content
    videoPlaceholder.innerHTML = `
      <div class="modal-video-icon">🎬</div>
      <p>This is a video from NASA's archives</p>
      <a href="${itemData.url}" target="_blank" class="modal-video-link">Watch Video</a>
    `;
    videoPlaceholder.style.display = 'block';
  }
  
  // Show the modal by adding the 'show' class
  modal.classList.add('show');
}

// Function to close the modal
function closeModal() {
  // Hide the modal by removing the 'show' class
  modal.classList.remove('show');
}

// Add event listener to close button
closeButton.addEventListener('click', closeModal);

// Add event listener to close modal when clicking outside the modal content
modal.addEventListener('click', function(event) {
  // Check if the click was on the modal background (not the content)
  if (event.target === modal) {
    closeModal();
  }
});

// Add event listener to close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
  // Check if Escape key was pressed and modal is open
  if (event.key === 'Escape' && modal.classList.contains('show')) {
    closeModal();
  }
});

