document.addEventListener('DOMContentLoaded', () => {
    
    const hotspots = document.querySelectorAll('.hotspot');
    const testimonialModal = document.getElementById('testimonialModal');
    //const introModal = document.getElementById('introModal');
    const videoModals = document.querySelectorAll('.video-modal');

    // --- 1. AUTO-PLAY e PAUSA DE VÍDEOS ---
    videoModals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            const videoPlayer = modal.querySelector('.modal-video-player');
            if (videoPlayer) {
                videoPlayer.play().catch(error => {
                    console.log("Autoplay bloqueado pelo navegador:", error);
                });
            }
        });

        modal.addEventListener('hidden.bs.modal', () => {
            const videoPlayer = modal.querySelector('.modal-video-player');
            if (videoPlayer) {
                videoPlayer.pause();
            }
        });
    });

    // --- 2. ANIMAÇÃO DOS BOTÕES (GSAP) ---
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (event) => {
            event.preventDefault();
            gsap.to(hotspot, { 
                scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut"
            });
        });
    });

// --- 3. POPULAR O MODAL DE DEPOIMENTO ---
    if (testimonialModal) {
        const videoSource = document.getElementById('video-source');
        const modalTitle = document.getElementById('testimonialModalLabel');
        const depoVideoPlayer = document.getElementById('video-player');

        testimonialModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            
            if (button && button.classList.contains('hotspot')) {
                const personName = button.getAttribute('data-person-name');
                const videoSrc = button.getAttribute('data-video-src');
                const alumniInfo = button.getAttribute('data-alumni-info');
                button.classList.add('watched'); 
                               
                const isVertical = button.getAttribute('data-is-vertical') === 'true';

                modalTitle.textContent = `${personName} | ${alumniInfo}`;
                videoSource.setAttribute('src', videoSrc);
                
                if (depoVideoPlayer) {
                    if (isVertical) {
                        depoVideoPlayer.classList.add('vertical-mode');
                    } else {
                        depoVideoPlayer.classList.remove('vertical-mode');
                    }

                    depoVideoPlayer.load();
                }
            }
        });
    }

    // --- 4. LIGHTBOX DA GALERIA COM NAVEGAÇÃO ---
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const photoModalElement = document.getElementById('photoModal');

    if (photoModalElement && galleryImages.length > 0) {
        const photoModalImg = document.getElementById('photo-modal-img');
        const photoModalCaption = document.getElementById('photo-modal-caption');
        const prevBtn = document.getElementById('prev-photo-btn');
        const nextBtn = document.getElementById('next-photo-btn');
        const photoModal = new bootstrap.Modal(photoModalElement);
        let currentIndex = 0;

        function updateModalImage(index) {
            const img = galleryImages[index];
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt');
            const caption = img.nextElementSibling ? img.nextElementSibling.innerText : '';

            photoModalImg.style.opacity = 0;
            photoModalCaption.style.opacity = 0;

            setTimeout(() => {
                photoModalImg.setAttribute('src', src);
                photoModalImg.setAttribute('alt', alt);
                if (photoModalCaption) photoModalCaption.innerText = caption;
                
                photoModalImg.style.opacity = 1;
                photoModalCaption.style.opacity = 1;
            }, 200);
        }

        galleryImages.forEach((img, index) => {
            img.parentElement.addEventListener('click', () => {
                currentIndex = index; 
                updateModalImage(currentIndex); 
                photoModal.show(); 
            });
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            currentIndex--;
            if (currentIndex < 0) currentIndex = galleryImages.length - 1;
            updateModalImage(currentIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex++;
            if (currentIndex >= galleryImages.length) currentIndex = 0; 
            updateModalImage(currentIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (photoModalElement.classList.contains('show')) {
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- 5. POSICIONAMENTO INTELIGENTE DO TOOLTIP ---
    
    hotspots.forEach(hotspot => {
        
        const topStyle = hotspot.style.top;
        
        
        if (topStyle && topStyle.includes('%')) {
            const topValue = parseFloat(topStyle);

            if (topValue < 50) {
                hotspot.classList.add('tooltip-down');
            }
        }
    });

});