const auth = "API_KEY";
const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector("form");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".submit-btn");
let searchVal;
const moreButton = document.querySelector(".more");
let pageCounterSearching = 1;

// Event Listner
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchVal = searchInput.value;
  searchPhoto(searchVal, 13);

  searchInput.blur(); // remove focus upon submission of the form
});

moreButton.addEventListener("click", loadMore);

// Functions

// Display Photos
const curatedPhotos = async () => {
  const url = `https://api.pexels.com/v1/curated?per_page=13&page=1`;
  const data = await fetchPhotos(url);

  appendPhotos(data);
};

// Searching a photo
const searchPhoto = async (searchTerm) => {
  const url = `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=13&page=1`;
  const data = await fetchPhotos(url);

  clearGallery();

  appendPhotos(data);
};

// General functionality to fetch photos
const fetchPhotos = async (url) => {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });

  const data = await dataFetch.json();

  return data;
};

// General functionality to append the photos to the DOM
const appendPhotos = (data) => {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
                        <a href=${photo.src.original} target="_blank">
                            <div class="image-link">
                                <img src=${photo.src.portrait} alt="${photo.alt}"/> 
                            </div>
                        </a>
                        <div class="gallery-info">
                            <a href=${photo.photographer_url} target="_blank">By ${photo.photographer}</a> 
                            <a href=${photo.src.original} target="_blank">Download Photo</a> 
                        </div>
                        `;
    gallery.appendChild(galleryImg);
  });
};

// clear gallery for searching purposes
const clearGallery = () => {
  gallery.innerHTML = ""; // clearing the gallery
};

// Load More
async function loadMore() {
  pageCounterSearching++;
  let fetchUrl;

  if (!searchVal) {
    // if searchVal is empty, then it means we are on the curated photos page
    fetchUrl = `https://api.pexels.com/v1/curated?per_page=13&page=${pageCounterSearching}`;
  } else {
    fetchUrl = `https://api.pexels.com/v1/search?query=${searchVal}&per_page=13&page=${pageCounterSearching}`;
  }

  const data = await fetchPhotos(fetchUrl);
  appendPhotos(data);
}

curatedPhotos();
