// @todo: напишите здесь код парсера

function parsePage() {

    // Функция для выбора символа валюты
    function selectCurrencySymbol(text) {
        const currencySymbol = text[0];

        if (currencySymbol === '₽') {
            return 'RUB'
        } else if (currencySymbol === '$') {
            return 'USD'
        } else {
            return 'EUR'
        };
    }

    // данные для meta
    const language = document.querySelector('html').getAttribute('lang');

    const title = document.querySelector('title').textContent.split('—')[0].trim();

    const keywords = [];
    document.querySelector('meta[name="keywords"]').getAttribute('content').split(',').forEach(item => keywords.push(item.trim()));

    const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');

    const opengraph = {};
    document.querySelectorAll('meta[property]').forEach(item => {
        const kay = item.getAttribute('property').split(':')[1].trim();
        let value = item.getAttribute('content');

        if (kay == 'title') {
            value = value.split('—')[0].trim()
        }

        opengraph[kay] = value
    });

    // данные для product
    const id = document.querySelector('.product').dataset.id;

    const name = document.querySelector('h1').textContent;

    const isLiked = document.querySelector('.like.active') ? true : false;

    const tags = {};
    tags['category'] = Array.from(document.querySelectorAll('.tags .green')).map(item => item.textContent);
    tags['discount'] = Array.from(document.querySelectorAll('.tags .red')).map(item => item.textContent);
    tags['label'] = Array.from(document.querySelectorAll('.tags .blue')).map(item => item.textContent);

    const price = parseInt(document.querySelector('.price').firstChild.textContent.match(/\d+/));

    const oldPrice = parseInt(document.querySelector('.price').lastElementChild.textContent.match(/\d+/));

    const discount = oldPrice - price;

    const discountPercent = `${(discount / oldPrice * 100).toFixed(2)}%`;
    
    const currency = selectCurrencySymbol(document.querySelector('.price').firstChild.textContent.trim());

    const properties = {};
    document.querySelectorAll('.properties li').forEach(item => {
        const kay = item.firstElementChild.textContent.trim();
        const value = item.lastElementChild.textContent.trim();

        properties[kay] = value
    });

    let productDescription = '';
    const cloneProductDescription = document.querySelector('.description').cloneNode(true);
    cloneProductDescription.querySelectorAll('*').forEach(tag => {
        const attrs = [...tag.attributes];

        attrs.forEach(attr => {
            tag.removeAttribute(attr.name)
        })
    });

    productDescription = cloneProductDescription.innerHTML.trim();

    const images = [];
    document.querySelectorAll('.preview nav img').forEach(item => {
        const image = {
            preview: item.getAttribute('src'),
            full: item.dataset.src,
            alt: item.getAttribute('alt')
        };

        images.push(image);
    });

    // данные для suggested
    const suggested = [];
    const suggestedItems = document.querySelectorAll('.suggested .items article');

    suggestedItems.forEach(item => {
        const suggestedItem = {
            name: item.querySelector('h3').textContent.trim(),
            description: item.querySelector('p').textContent.trim(),
            image: item.querySelector('img').getAttribute('src'),
            price: item.querySelector('b').textContent.match(/\d+/).join(),
            currency: selectCurrencySymbol(item.querySelector('b').textContent[0])
        };

        suggested.push(suggestedItem)
    });

    // данные для reviews
    const reviews = [];
    const reviewsItems = document.querySelectorAll('.reviews .items article');

    reviewsItems.forEach(item => {
        const reviewsItem = {
            rating: item.querySelectorAll('.rating .filled').length,
            author: {
                avatar: item.querySelector('.author img').getAttribute('src'),
                name: item.querySelector('.author span').textContent.trim()
            },
            title: item.querySelector('h3').textContent.trim(),
            description: item.querySelector('p').textContent.trim(),
            date: item.querySelector('.author i').textContent.replaceAll('/', '.').trim()
        }

        reviews.push(reviewsItem)
    });
    
    return {
        meta: {
            language,
            title,
            keywords,
            description: metaDescription,
            opengraph
        },
        product: {
            id,
            name,
            isLiked,
            tags,
            price,
            oldPrice,
            discount,
            discountPercent,
            currency,
            properties,
            description: productDescription,
            images
        },
        suggested: [
            ...suggested
        ],
        reviews: [
            ...reviews
        ]
    };
}

window.parsePage = parsePage;