// Declaration of variables
const navbar = document.getElementById("nav");
const brandName = document.getElementById("brand");
const searchKey = document.getElementById("searchKey");
const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const column1 = document.getElementById("col-1");
const column2 = document.getElementById("col-2");
const column3 = document.getElementById("col-3");
const errorGrid = document.getElementById("errorGrid");
const modalBody = document.getElementById("modalBody");
const imageViewLink = document.getElementById("imageViewLink");
const downloadButton = document.getElementById("downloadButton");

let orderByValue = '';

// APIs
const API_KEY = "Co4oCtK4VAc_Jy2gqLwFe3zGFQaxxp596iwX1hTqrB0";

// 04_hhE-siKE0-DuqaIZnf4MptVEXOl25-0OEYuCnR9A

// cQOwQMsDuYXoLwmsMMw9hv65dZo1iqShV5smJN9pnZQ

const apiUrl = `https://api.unsplash.com/photos/?client_id=${API_KEY}&per_page=300`;
const searchUrl = `https://api.unsplash.com/search/photos/?client_id=${API_KEY}&query=`;

let imageURLS = [];

window.onload = () => {
    fetchData();
    window.addEventListener('scroll', handleScroll);
}

const fetchData = async () => {
    try {
        imageURLS = []; // Clear the array before fetching new images

        let tempUrl = apiUrl;

        if (orderByValue !== '') {
            tempUrl += (`&order_by=${orderByValue}`);
        }

        const response = await fetch(tempUrl);
        const myJson = await response.json();

        const imageArrays = myJson;

        imageArrays.forEach(element => {
            imageURLS.push(element.urls.small);
        });

        displayImage();
    } catch (error) {
        handleError(error);
    }
}

const handleError = (err) => {
    console.warn(err);
    errorGrid.innerHTML = `<h4>Unable to fetch data ${err}</h5>`;
}

const displayImage = () => {
    errorGrid.innerHTML = '';
    if (imageURLS.length === 0) {
        errorGrid.innerHTML = '<h4>Unable to fetch data.</h5>';
        return;
    }

    column1.innerHTML = '';
    column2.innerHTML = '';
    column3.innerHTML = '';

    imageURLS.forEach((url, index) => {
        const image = document.createElement('img');
        image.src = url;
        image.className = 'pt-4';
        image.setAttribute('width', '100%');
        image.setAttribute('onclick', 'displayFullImage(this.src)');

        if ((index + 1) % 3 === 0) {
            column1.appendChild(image);
        }
        if ((index + 2) % 3 === 0) {
            column2.appendChild(image);
        }
        if ((index + 3) % 3 === 0) {
            column3.appendChild(image);
        }
    });
}

const displayFullImage = (src) => {
    const image = document.createElement('img');
    image.src = src;
    image.className = 'mt-3';
    image.setAttribute('width', '100%');

    modalBody.innerHTML = '';
    modalBody.appendChild(image);

    imageViewLink.href = src;

    const myModal = new bootstrap.Modal(document.getElementById('modal'), {});
    myModal.show();
}

searchBtn.addEventListener('click', () => {
    if (searchKey.value !== '') {
        fetchSearchData(searchKey.value);
    }
});

const fetchSearchData = async (key) => {
    try {
        imageURLS = []; // Clear the array before fetching new images

        let tempUrl = searchUrl + key;

        if (orderByValue !== '') {
            tempUrl += (`&order_by=${orderByValue}`);
        }

        searchQuery.innerHTML = key;

        let response = await fetch(tempUrl);
        let myJson = await response.json();

        const totalResults = myJson.total;

        // If totalResults is 0, display error message and return
        if (totalResults === 0) {
            errorGrid.innerHTML = "<h4>No results found.</h4>";
            return;
        }

        // Fetch all results in multiple requests if necessary
        let page = 1;
        const perPage = 30; // Adjust per page as needed
        let totalPages = Math.ceil(totalResults / perPage);

        while (page <= totalPages) {
            // Fetch images for current page
            let pageUrl = tempUrl + `&page=${page}`;
            response = await fetch(pageUrl);
            myJson = await response.json();

            const imageArrays = myJson.results;

            imageArrays.forEach(element => {
                imageURLS.push(element.urls.regular);
            });

            page++;
        }

        // Display images
        displayImage();
    } catch (error) {
        handleError(error);
    }
}

const orderBy = () => {
    orderByValue = document.getElementById("orderby").value;
    imageURLS = [];

    if (searchKey.value !== '') {
        fetchSearchData(searchKey.value);
    } else {
        fetchData();
    }
}

document.getElementById("pagination").addEventListener("select.uk.pagination", (e, page) => {
    alert(page);
});

// Function to handle scroll event
const handleScroll = () => {
    // Check if user has scrolled to the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        fetchMoreImages();
    }
};

// Function to fetch more images
const fetchMoreImages = async () => {
    try {
        // Fetch more images
        const response = await fetch(apiUrl); // Adjust apiUrl as needed
        const myJson = await response.json();

        // Append new image URLs to the existing imageURLS array
        myJson.forEach(element => {
            imageURLS.push(element.urls.small);
        });

        // Display images with updated imageURLS array
        displayImage();
    } catch (error) {
        handleError(error);
    }
};

// Attach scroll event listener to the window
window.addEventListener('scroll', handleScroll);

// Function to handle download button click
const handleDownloadButtonClick = () => {
    const imageUrl = modalBody.querySelector('img').src;
    const imageId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

    // Create an anchor element
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    // Fetch image as blob
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            // Create a blob URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Set attributes for the anchor element
            a.href = blobUrl;
            a.download = `${imageId}.jpg`;

            // Trigger a click event on the anchor element
            a.click();

            // Remove the anchor element
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
        });
};

// Add event listener to the download button in modal
downloadButton.addEventListener('click', handleDownloadButtonClick);

