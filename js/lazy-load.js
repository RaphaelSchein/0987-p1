var images = document.querySelectorAll('.js-lazy-image');
console.log(images.length);
var config = {
    rootMargin: '50px 0px',
    threshold: 0.01
};

var imageCount = images.length;
var observer;

var fetchImage = function(url) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.src = url;
        image.onload = resolve;
        image.onerror = reject;
    });
}

var preloadImage = function(image) {
    var src = image.dataset.src;
    if (!src) {
        return;
    }

    return fetchImage(src).then(function(){ applyImage(image, src); });
}

var loadImagesImmediately = function(images) {
    for (image in images) {
        preloadImage(image);
    }
}

var onIntersection = function(entries) {
    if (imageCount === 0) {
        observer.disconnect();
    }

    for (entry in entries) {
        if (entry.intersectionRatio > 0) {
            imageCount--;

            observer.unobserve(entry.target);
            preloadImage(entry.target);
        }
    }
}

var applyImage = function(img, src) {
    img.classList.add('js-lazy-image--handled');
    img.src = src;
}

if (!('IntersectionObserver' in window)) {
    loadImagesImmediately(images);
} else {
    observer = new IntersectionObserver(onIntersection, config);

    for (var image in images) {
        if (image.classList.contains('js-lazy-image--handled')) {
            continue;
        }

        observer.observe(image);
    }
}