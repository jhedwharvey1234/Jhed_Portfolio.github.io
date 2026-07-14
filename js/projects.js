(function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-panel[data-group]');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filter = button.getAttribute('data-filter') || 'all';

            filterButtons.forEach(function (btn) {
                btn.classList.toggle('active', btn === button);
            });

            projectCards.forEach(function (card) {
                const group = card.getAttribute('data-group');
                const shouldShow = filter === 'all' || filter === group;
                card.style.display = shouldShow ? '' : 'none';
            });
        });
    });

    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalIndex = document.getElementById('modalImageIndex');
    const modalTotal = document.getElementById('modalImageTotal');
    const modalThumbs = document.getElementById('modalThumbs');
    const modalGallery = document.getElementById('modalGallery');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    const closeBtn = document.getElementById('modalCloseBtn');

    let currentImages = [];
    let currentIndex = 0;
    let suppressClickUntil = 0;

    function updateModal() {
        if (!currentImages.length) return;
        modalImage.src = currentImages[currentIndex];
        modalImage.alt = modalTitle.textContent + ' screenshot ' + String(currentIndex + 1);
        modalIndex.textContent = String(currentIndex + 1);
        modalTotal.textContent = String(currentImages.length);

        const thumbs = modalThumbs.querySelectorAll('.modal-thumb');
        thumbs.forEach(function (thumb, idx) {
            thumb.classList.toggle('active', idx === currentIndex);
        });
    }

    function buildThumbnails() {
        modalThumbs.innerHTML = '';
        currentImages.forEach(function (src, idx) {
            const thumb = document.createElement('button');
            thumb.type = 'button';
            thumb.className = 'modal-thumb' + (idx === currentIndex ? ' active' : '');
            thumb.innerHTML = '<img src="' + src + '" alt="Thumbnail ' + String(idx + 1) + '">';
            thumb.addEventListener('click', function () {
                currentIndex = idx;
                updateModal();
            });
            modalThumbs.appendChild(thumb);
        });
    }

    function openModal(title, images) {
        currentImages = images;
        currentIndex = 0;
        modalTitle.textContent = title;
        buildThumbnails();
        updateModal();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-modal-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const title = button.getAttribute('data-title') || 'Project';
            const images = JSON.parse(button.getAttribute('data-images') || '[]');
            openModal(title, images);
        });
    });

    prevBtn.addEventListener('click', function () {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModal();
    });

    nextBtn.addEventListener('click', function () {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModal();
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (!modal.classList.contains('open')) return;
        if (event.key === 'Escape') closeModal();
        if (event.key === 'ArrowLeft') prevBtn.click();
        if (event.key === 'ArrowRight') nextBtn.click();
    });

    function handleMobileTap(clientX) {
        if (!modal.classList.contains('open')) return;
        if (window.innerWidth > 760) return;

        const isRightSide = clientX > window.innerWidth / 2;
        if (isRightSide) {
            nextBtn.click();
        } else {
            prevBtn.click();
        }
    }

    if (modalGallery) {
        modalGallery.addEventListener('touchend', function (event) {
            if (event.changedTouches.length !== 1) return;
            if (event.target === closeBtn || closeBtn.contains(event.target)) return;

            const clientX = event.changedTouches[0].clientX;
            suppressClickUntil = Date.now() + 400;
            handleMobileTap(clientX);
        }, { passive: true });

        modalGallery.addEventListener('click', function (event) {
            if (Date.now() < suppressClickUntil) return;
            if (event.target === closeBtn || closeBtn.contains(event.target)) return;

            handleMobileTap(event.clientX);
        });
    }
})();
