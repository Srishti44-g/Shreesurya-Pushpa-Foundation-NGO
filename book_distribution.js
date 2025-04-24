const GOOGLE_DRIVE_CONFIG = {
    API_KEY: 'AIzaSyA6DG9xsDJ4TbKzFfCnAjnQ_s60X482KIY',
    CLIENT_ID: '281854010145-j12c5ojtsciuso0ugqakft82d58ko826.apps.googleusercontent.com',
    FOLDER_ID: '161qI71WQgOOI5XXlkIAfxpsRqKt2nGgH'
};

class GalleryManager {
    constructor() {
        this.gallery = document.getElementById('dynamicGallery');
        this.initialize();
    }

    async initialize() {
        try {
            await this.loadGoogleDriveAPI();
            await this.loadImages();
        } catch (error) {
            console.error('Gallery initialization failed:', error);
            this.showError('Failed to load gallery images');
        }
    }

    async loadGoogleDriveAPI() {
        return new Promise((resolve, reject) => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async loadImages() {
        try {
            const response = await gapi.client.drive.files.list({
                q: `'${GOOGLE_DRIVE_CONFIG.FOLDER_ID}' in parents and mimeType contains 'image/'`,
                fields: 'files(id, name, webContentLink, thumbnailLink)',
                orderBy: 'createdTime desc'
            });

            const files = response.result.files;
            this.renderImages(files);
        } catch (error) {
            throw new Error('Failed to fetch images from Google Drive');
        }
    }

    renderImages(files) {
        this.gallery.innerHTML = '';

        files.forEach(file => {
            const fullImageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
            const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
            
            const imageElement = `
                <div class="gallery-item">
                    <a href="${fullImageUrl}" data-lightbox="gallery" data-title="${file.name}">
                        <img 
                            src="${thumbnailUrl}" 
                            alt="${file.name}" 
                            loading="lazy"
                            onload="this.classList.add('loaded')"
                            onerror="this.onerror=null; this.src='${file.thumbnailLink}'; this.classList.add('error')"
                            data-full="${fullImageUrl}"
                        >
                    </a>
                </div>
            `;
            this.gallery.innerHTML += imageElement;
        });

        // Add click handlers to load high quality images
        this.gallery.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', function() {
                const fullRes = this.getAttribute('data-full');
                this.src = fullRes;
            });
        });
    }
    
    showError(message) {
        this.gallery.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});