'use strict'

/*
 * LazyLoad медиафайлов
 * Антиспам
 * Получить GET параметры
 * Получить COOKIE по имени
 * Функция анимации скрытия окна
 * Функция анимации появления окна
 * Ссылка на блок
 * PopUp
 * Определение региона пользователя
 * Настройка меню
 * [CF7] Валидация
 * Маска для полей телефонов и ИНН
 * Калькулятор квиз - опрос
 * Слайдеры
 * [bootstrap] Включаем всплывашки
 * Цели Яндекс.Метрики
 * Клики по кнопкам, для заполнения форм
 * Ajax обработчик форм комментариев
 * Таймер акций
 * Плавный скрол к маяку (Beacon) по клику
 * Скрыть Получить расчет в footer
 * Дата в footer
 * Собираем данные сквозной аналитики Битрикс
 */
import swal from 'sweetalert'
// core version + navigation, pagination modules:
import Swiper, { Navigation, Pagination } from 'swiper';
// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

/**
 * LazyLoad медиафайлов
 */
// Установите параметры глобально
// чтобы заставить LazyLoad самоинициализироваться
window.lazyLoadOptions = {
    // Ваши пользовательские настройки находятся здесь

};
// Прослушайте событие инициализации
// и получите экземпляр отложенной загрузки
window.addEventListener(
    "LazyLoad::Initialized",
    function (event) {
        window.lazyLoadInstance = event.detail.instance;
    },
    false
);

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    /**
     * Антиспам
     */
    let antispam = document.querySelectorAll('input[name="agree"]');
    antispam.forEach(function (checkbox) {
        checkbox.checked = false;
        const btn = checkbox.closest('form').querySelector('.wpcf7-form-control.wpcf7-submit');
        btn.disabled = false;
    });

    let antispamSoglasie = document.querySelectorAll('.items_soglasie .item_soglasie div');
    antispamSoglasie.forEach(function (clickBtn) {
        clickBtn.onclick = function () {
            clickBtn.classList.toggle('active');
            clickBtn.closest('.items_soglasie').querySelector('input[type="checkbox"]').click();
        };
    });

    /**
     * Получить GET параметры
     */
    const gets = (function() {
        const url = window.location.search.substring(1).split("&");
        const gets = {};
        for (let i = 0; i < url.length; i++) {
            gets[url[i].split("=")[0]] = url[i].split("=")[1];
        }
        return gets;
    })();

    /**
     * Получить COOKIE по имени
     */
    function getCookie(name) {
        const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    /**
     * Функция анимации скрытия окна
     * @param el
     * @param displayClass
     */
    function fadeOut(el, displayClass = 'd-none') {
        if (el) {
            if (!el.classList.contains(displayClass)) {
                let op = 1;
                let timer = setInterval(function () {
                    if (op <= 0.1) {
                        clearInterval(timer);
                        el.classList.remove('d-block');
                        el.classList.add(displayClass);
                    }
                    el.style.opacity = op;
                    el.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 10);
            }
        }
    }

    /**
     * Функция анимации появления окна
     * @param el
     * @param displayClass
     */
    function fadeIn(el, displayClass = 'd-block') {
        if (el) {
            if (!el.classList.contains(displayClass)) {
                let op = 0.1;
                el.classList.remove('d-none');
                let timer = setInterval(function () {
                    if (op >= 1) {
                        clearInterval(timer);
                        el.classList.add(displayClass);
                    }
                    el.style.opacity = op;
                    el.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op += op * 0.1;
                }, 10);
            }
        }
    }

    /**
     * Ссылка на блок
     */
    const btnLinkJS = document.querySelectorAll('.link-js');
    btnLinkJS.forEach(function (clickBtn) {
        clickBtn.onclick = function () {
            const link = clickBtn.getAttribute('data-link');
            if (link) {
                if (link.indexOf('http') >= 0) {
                    window.location.href = link;
                } else {
                    window.location.href = 'https://' + document.location.host + link;
                }
            }
        };
    });

    /**
     * PopUp
     */
    class PopUp {
        constructor(btnGetPopup) {
            this.btnGetPopup = btnGetPopup;
            if (this.btnGetPopup) {
                this.openPopUpsCounter('open-popups');
                // Убираем скрол у body
                document.querySelector('html').style.cssText = 'overflow: hidden;margin-right: 15px;background: #e9e9e9;';
                // Окно
                let popup = document.getElementById(this.btnGetPopup.getAttribute("data-pop"));
                // Кастомный заголовок
                let popupTitle = this.btnGetPopup.getAttribute("data-title");
                if (popup) {
                    // У последующего открытого окна z-index будет > предыдущего
                    popup.style.zIndex = this.popUpCounter <= 0 ? 50 : this.popUpCounter;
                    // Блок .pop с контентом
                    const popupContent = popup.querySelector('.pop');
                    // Создаем и добавляем контейнер окна, для дальнейшей реализации прокрутки длинных окон
                    let popupContainer;
                    if (!popup.querySelector('.popup-container')){
                        popupContainer = document.createElement('div');
                        popupContainer.setAttribute('class', 'popup-container');
                        popupContent.parentNode.insertBefore(popupContainer, popupContent);
                        popupContainer.appendChild(popupContent);
                    }else {
                        popupContainer = popup.querySelector('.popup-container')
                    }

                    // Блок .pop.img c картинкой
                    const popupContentImg = popup.querySelector('.pop.img');
                    // Атрибут с ссылкой на картинку полного размера
                    const popupFullImg = this.btnGetPopup.getAttribute("data-full-img");
                    // Блок .pop.video c iframe в котором будет видео
                    const popupContentVideo = popup.querySelector('.pop.video');
                    // Атрибут с ссылкой на видео
                    const popupFullVideo = this.btnGetPopup.getAttribute("data-full-video");
                    // Устанавливаем максимальную ширину окна
                    let popupMaxWidth = popup.getAttribute('data-max-width');
                    if (!popupMaxWidth) popupMaxWidth = (window.innerWidth - 100);
                    popupContent.style.maxWidth = popupMaxWidth + 'px';

                    // Создаем кнопку закрытия окна и вставляем в popupContent
                    this.closeBtnCreate(popup, popupContent);
                    // Проверка на существование окон с картинками или видео
                    if (popupContentImg) {
                        // Если пусто и картинки нет
                        let imgToPop = popupContentImg.querySelector('img');
                        if (!imgToPop) {
                            // Создаем и вставляем в popupContentImg картинку
                            const createImg = document.createElement('img');
                            createImg.style.width = '100%';
                            popupContentImg.prepend(createImg);
                            imgToPop = createImg;
                        }
                        imgToPop.src = popupFullImg
                    } else if (popupContentVideo) {
                        // Если пусто и видео нет
                        let videoToPop = popupContentVideo.querySelector('iframe');
                        let widthVideo = this.btnGetPopup.getAttribute('data-width-video') ? this.btnGetPopup.getAttribute('data-width-video') : 560;
                        if (widthVideo >= window.innerWidth) {
                            widthVideo = (window.innerWidth - 100) + 'px';
                        }
                        let heightVideo = this.btnGetPopup.getAttribute('data-height-video') ? this.btnGetPopup.getAttribute('data-height-video') : 315;
                        if (heightVideo >= window.innerHeight) {
                            heightVideo = (window.innerHeight - 100) + 'px';
                        }
                        popupContent.style.maxWidth = widthVideo + 'px';
                        if (!videoToPop) {
                            // Создаем и вставляем в popupContentVideo видео
                            const createVideo = document.createElement('iframe');
                            createVideo.style.width = widthVideo;
                            createVideo.style.height = heightVideo;
                            createVideo.setAttribute('allow', 'autoplay;');
                            createVideo.setAttribute('frameborder', '0');
                            popupContentVideo.prepend(createVideo);
                            videoToPop = createVideo;
                        }
                        videoToPop.src = popupFullVideo + '?autoplay=1';
                    }
                    //Создаем лоадер если у нас идет вызов картинок или видео
                    let imgLoader = document.querySelector('img.loader-popup');
                    if (popupContentImg || popupContentVideo) {
                        if (!imgLoader) {
                            const createLoader = document.createElement('div');
                            createLoader.className = 'cssload-container';
                            document.querySelector('body').prepend(createLoader);
                            let createLoaderChildren;
                            for (let i=0; i<=12; i++){
                                createLoaderChildren = document.createElement('div');
                                createLoaderChildren.className = 'cssload-thing';
                                document.querySelector('.cssload-container').prepend(createLoaderChildren);
                            }
                            imgLoader = createLoader;
                        }
                    }

                    // Показываем окно
                    if (popupContentImg) {
                        popupContentImg.querySelector('img').onload = (ev) => {
                            if (ev.path[0].src) {
                                this.fadeOut(imgLoader);
                                this.fadeIn(popup, 'block');
                                // Центруем окно
                                this.alignmentPopUps(popupContent, popupContainer);
                            }
                        }
                    } else if (popupContentVideo) {
                        popupContentVideo.querySelector('iframe').onload = (ev) => {
                            if (ev.path[0].src) {
                                this.fadeOut(imgLoader);
                                this.fadeIn(popup, 'block');
                                // Центруем окно
                                this.alignmentPopUps(popupContent, popupContainer);
                            }
                        }
                    } else {
                        this.fadeIn(popup, 'block');
                        // Центруем окно
                        this.alignmentPopUps(popupContent, popupContainer);
                    }

                    // По клику чистим src и закрываем окно
                    this.closeBtn.onclick = () => {
                        if (popupContentImg) {
                            popupContentImg.querySelector('img').removeAttribute('src');
                        } else if (popupContentVideo) {
                            popupContentVideo.querySelector('iframe').removeAttribute('src');
                        }
                        this.fadeOut(popup);
                        // Возвращаем скрол у body
                        document.querySelector('html').style.cssText = 'overflow: auto;margin: auto;';
                    }
                    //Обновляем заголовок если имеется
                    if (popupTitle) {
                        popup.querySelector('.title').innerText = popupTitle;
                    } else {
                        let defaultTitle = popup.querySelector('.title');
                        if (defaultTitle)
                            defaultTitle = defaultTitle.getAttribute('data-default-title');
                        if (defaultTitle)
                            popup.querySelector('.title').innerText = defaultTitle;
                    }
                } else {
                    alert('Окно вызываемое по данной «кнопке» не найдено!');
                }
            }
        }

        /**
         * Записываем в localStorage открытие каждого окна.
         * Для того чтобы последующие открытые окна внутри окон были выше уже открытых.
         * @param name
         */
        openPopUpsCounter(name) {
            this.popUpCounter = Number(localStorage.getItem(name));
            if (!this.popUpCounter) localStorage.setItem(name, 100);
            else localStorage.setItem(name, ++this.popUpCounter);
        }

        /**
         * Создаем кнопку закрытия окна и вставляем в popupContainer
         * @param popup - Где ищем
         * @param popupContent - куда вставляем
         */
        closeBtnCreate(popup, popupContent) {
            this.closeBtn = popup.querySelector('.close');
            if (!this.closeBtn) {
                const createCloseBtn = document.createElement('span');
                createCloseBtn.className = 'close';
                popupContent.prepend(createCloseBtn);
                this.closeBtn = createCloseBtn;
            }
        }

        /**
         * Функция для установки popUp по центру экрана
         * @param popupContent
         * @param popupContainer
         */
        alignmentPopUps(popupContent, popupContainer) {
            // Получаем высоту popupContent, для включения прокрутки, если оно слишком длинное и для отцентровки
            const popupContentHeight = popupContent.clientHeight;
            // Устанавливаем минимальную высоту окна, зависит от размера popupContent
            popupContainer.style.minHeight = (popupContentHeight + 100) + 'px';
            // Выщитываем размер окна для отцентровки
            const userWindow = window.outerWidth;
            const mobileMenu = document.getElementById('mobile-menu').clientHeight;
            const screenUserHeight = Number(window.innerHeight);
            const marginTop = (screenUserHeight - popupContentHeight) / 2;
            if (marginTop > 0 && popupContentHeight !== 0) {
                popupContent.style.marginTop = marginTop + 'px';
            } else {
                popupContent.style.margin = userWindow <= 991 ? '20px auto' : '50px auto';
            }
            //console.log('Высчитываем центровку окна: (' + screenUserHeight + ' - ' + popupContentHeight + ') / 2 = ' + marginTop);
        }

        /**
         * Функция анимации появления окна
         * @param el
         * @param displayClass
         */
        fadeIn(el, displayClass) {
            el.style.opacity = '0';
            el.style.display = displayClass || 'block';
            (function fade() {
                let val = Number(el.style.opacity);
                if (!((val += .1) > 1)) {
                    el.style.opacity = `${val}`;
                    requestAnimationFrame(fade);
                }
            })();
        }

        /**
         * Функция анимации скрытия окна
         * @param el
         */
        fadeOut(el) {
            el.style.opacity = '1';
            (function fade() {
                if ((el.style.opacity -= '.1') < 0) {
                    el.style.display = 'none';
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        }
    }

    document.addEventListener('click', ({target}) => {
        new PopUp(target.closest('.popClick'));
    });

    /**
     * Определение региона пользователя
     */
    //Получаем поле для ввода города
    const inputUserAddress = document.getElementById('userRegion_1');
    if (inputUserAddress){
        inputUserAddress.addEventListener('keyup', ({target}) => {
            const el = target;
            if (el){
                const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
                const token = "ed19a93b3dff1c7f59af9cd2a8b3862679f61854";
                const query = el.value;
                //Если больше 3х символов, отправляем запрос
                if (query.length >= 3){
                    const options = {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Token " + token
                        },
                        body: JSON.stringify({
                            count: 5, //количество в ответе
                            query: query, //то что ввёл пользователь
                            from_bound: {value: "city"},
                            to_bound: {value: "city"},
                            locations: [{country: "Россия"},],
                        })
                    }
                    fetch(url, options)
                        .then(response => response.text())
                        .then(result => {
                            userAddressGo(result);
                        })
                        .catch(error => console.log("error", error));
                }

            }

        });
        //Функция в которой происходит разбор результата и вывода в DOM
        function userAddressGo(res){
            const json = JSON.parse(res).suggestions;
            const list = document.getElementById('rgGetUserRegion').querySelector('.offers.dropdown ul');
            list.innerHTML = '';
            list.closest('div').classList.add('visible');
            if (json.length > 0){
                for (const key in json) {
                    const el = json[key];
                    let city = el.data.city;
                    let region = el.data.region_with_type;
                    switch (region){
                        case 'г Санкт-Петербург' :
                        case 'Санкт-Петербург' : region = 'Ленинградская обл'; break;
                        case 'г Москва' :
                        case 'Москва' : region = 'Московская обл'; break;
                    }
                    const newItem = document.createElement("li");
                    newItem.innerText = city + ', ' + region;
                    newItem.setAttribute('data-city', city);
                    newItem.setAttribute('data-region', region);
                    list.appendChild(newItem);
                }
            }else {
                const newItem = document.createElement("li");
                newItem.innerText = 'Вашего города не обнаружено..';
                newItem.setAttribute('data-city', 'Москва');
                newItem.setAttribute('data-region', 'Московская обл');
                list.appendChild(newItem);
            }
        }
        //Обработка клика по городу
        addEventListener('click', ({target}) => {
            const el = target;
            if (el.closest('li[data-region]')){
                let city = el.getAttribute('data-city');
                let region = el.getAttribute('data-region');
                let dropdown = el.closest('.offers.dropdown');
                let input = el.closest('.pop').querySelector('input[name="region"]');
                input.value = city + ', ' + region
                let btn = el.closest('.pop').querySelector('.setUserRegionInfo');
                btn.setAttribute('data-city', city);
                btn.setAttribute('data-region', region);
                if (dropdown){
                    dropdown.classList.remove('visible');
                }
            }
        });
        //Обработка клика по кнопке сохранить город
        const setUserRegionInfo = document.querySelector('.setUserRegionInfo');
        setUserRegionInfo.addEventListener("click", () =>{
            let city = setUserRegionInfo.getAttribute('data-city');
            let region = setUserRegionInfo.getAttribute('data-region');
            document.cookie = `cityUser=${city}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            document.cookie = `regionUser=${region}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            document.cookie = "popUpGetRegion=1; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            location.reload(true);
        });
        //Обновляем всю залупень в шапке
        let getCookieCity = getCookie('cityUser');
        let getCookieRegion = getCookie('regionUser');
        //console.log(getCookieCity + ' + ' + getCookieRegion);
        let getCookieStopPopupRegion = getCookie('popUpGetRegion');
        if (getCookieCity){
            document.querySelector('a[data-pop="rgGetUserRegion"]').innerText = getCookieCity;
        }
        if (getCookieCity && getCookieRegion){
            inputUserAddress.value = getCookieCity + ', ' + getCookieRegion;
        }
        let btnCloseMiniPopup = document.querySelector('.checkUserRegion');
        if (!getCookieStopPopupRegion){
            setTimeout(()=>{
                btnCloseMiniPopup.classList.remove('d-none');
            },3000);
        }
        const stopPopupGetRegion = document.querySelector('.stopPopupGetRegion');
        stopPopupGetRegion.addEventListener("click", () =>{
            btnCloseMiniPopup.classList.add('d-none');
            document.cookie = "popUpGetRegion=1; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        });
        //Очистить input
        const clearInputRegion = document.querySelector('.clearInputRegion');
        clearInputRegion.addEventListener("click", () =>{
            inputUserAddress.value = '';
        });
    }

    /**
     * Настройка меню
     */
    const headerMenuSite = document.querySelector('#top-menu > .logo_and_menu');
    if (headerMenuSite) {
        if (window.outerWidth >= 992) {
            window.addEventListener('scroll', function() {
                const top = window.pageYOffset;
                const haveClassFixed = headerMenuSite.classList.contains('fixed');
                if (top > 200 && top < 300) {
                    headerMenuSite.style.top = '-100%';
                }
                if (top < 200) {
                    headerMenuSite.style.top = 0;
                    headerMenuSite.classList.remove('fixed');
                }
                if (top > 300) {
                    if (!haveClassFixed) {
                        headerMenuSite.classList.add('fixed');
                        headerMenuSite.style.top = 0;
                    }
                }
                if (top < 300) {
                    if (haveClassFixed) {
                        headerMenuSite.style.top = '-100%';
                    }
                }
            });
        } else {
            //Мобильное меню
            const btnMobileMenu = document.getElementById('mobile-menu');
            btnMobileMenu.addEventListener("click", () => {
                if (!document.getElementById('menu-paste').innerText > 0) {
                    let copyMenu = headerMenuSite.querySelector('#menu-header-menu');
                    const mobMenuContainer = document.getElementById('menu-paste');
                    mobMenuContainer.appendChild(copyMenu);
                    const btnMobLi = mobMenuContainer.querySelectorAll('ul > li.nav-item');
                    btnMobLi.forEach(el => {
                        el.onclick = () => {
                            el.closest('.offcanvas').querySelector('.btn-close').click();
                        };
                    });
                }
            });
        }
        //Меняем на главной странице ссылки на маяки
        if (window.location.pathname === '/'){
            const listMenu = document.getElementById('menu-header-menu').querySelectorAll('li.tut');
            listMenu.forEach(el => {
                const a = el.querySelector('a');
                const href = a.getAttribute('href');
                let id = href.replace(/[^+\w]/g, '');
                if (!id.includes('httpsgovorov')){
                    a.setAttribute('href', 'javascript:;');
                    a.setAttribute('data-where', id);
                }
            });
        }
    }

    /**
     * [CF7] Валидация
     */
    const btnWpcf7 = document.querySelectorAll('.wpcf7-submit');
    btnWpcf7.forEach(el => {
        el.onclick = () => {
            const btnText = el.value;
            setTimeout(()=>{
                el.setAttribute('disabled', 'disabled');
            },1);
            let timer;
            let x = 5;
            function countdown(){
                x--;
                if (x<=0){
                    el.removeAttribute('disabled');
                    el.value = btnText;
                }
                else {
                    timer = setTimeout(countdown, 1000);
                    el.value = `${x} Проверяем данные..`;
                }
            }
            countdown();
        };
    });
    document.addEventListener( 'wpcf7submit', function( event ) {
        //console.log(event.detail);
        const form = document.getElementById(`${event.detail.unitTag}`);
        const formElements = form.querySelectorAll('.form-element');
        const btn = form.querySelector('.wpcf7-submit');
        const status = event.detail.status;
        if (status === "mail_sent") {
            const popUpClose = form.closest('.popup');
            if (popUpClose) {
                popUpClose.querySelector('span.close').click();
            }else {
                btn.value = 'Отправлено!';
                btn.setAttribute('disabled', 'disabled');
            }
            swal({
                title: "Отлично!",
                text: event.detail.apiResponse.message,
                icon: "success",
                timer: 5000,
                className: "success",
                button: {
                    text: "Закрыть",
                },
            });
            formElements.forEach()
            for (let key in formElements) {
                console.log(key);
             /*   el.classList.remove('is-invalid');
                el.classList.add('is-valid');*/
            }
        }else {
        /*    swal({
                title: "Ошибка!",
                text: event.detail.apiResponse.message,
                icon: "warning",
                timer: 5000,
                className: "error",
                button: {
                    text: "Исправлю..",
                },
            });*/
            const errors = event.detail.apiResponse.invalid_fields;
            for (let key in errors) {
                const id = errors[key].idref;
                const el = document.getElementById(id);
                el.classList.remove('is-valid');
                el.classList.add('is-invalid');
            }
            setTimeout(() => {
                const isValidEl = form.querySelectorAll('[aria-invalid="false"]');
                if (isValidEl){
                    isValidEl.forEach(el => {
                        el.classList.remove('is-invalid');
                        el.classList.add('is-valid');
                    });
                }
            }, 500);
        }
    }, false);

    /**
     * Маска для полей телефонов и ИНН
     */
    function maskPhone(selector, masked = '8 (___) ___-__-__') {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 5) {
                this.value = "";
            }

        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }
    }
    maskPhone('input[type="tel"]');

    /**
     * Калькулятор квиз - опрос
     */
    const briefChecklist = document.querySelector('.brief-checklist');
    if (briefChecklist) {
        briefChecklist.onmouseover = () => {
            fadeOut(document.querySelector('.brief_btn[data-pop="brief_popUp"]'));
        }
        const countListQuiz = briefChecklist.querySelector('.opros').childElementCount - 1;
        function pag(step, elem, countListQuiz) {
            const el = document.querySelector('.brief-checklist[data-elem="' + elem + '"]');
            if (el) {
                fadeIn(el.querySelector('.brief-pagination .prev'));
                if (step <= 1) {
                    fadeOut(el.querySelector('.brief-pagination .prev'));
                } else {
                    fadeIn(el.querySelector('.brief-pagination .prev'));
                }
                if (step > countListQuiz) {
                    el.querySelector('.brief-pagination').remove();
                    el.querySelector('.item.box_1 p').innerText = 'Почти готово!';
                    let text = '';
                    for (let item of el.querySelectorAll('.opros .item.active p.desc')) {
                        text += item.closest('.list').querySelector('.title').innerText;
                        console.log(text);
                        text += `\n ${item.innerText}; \n`;
                    }
                    el.querySelector(`.list[data-list="${++countListQuiz}"] input[name="tariff"]`).value = text;
                    el.querySelector('.item.box_2 > div p.h2').remove();
                    el.querySelector('.item.box_2 > div p.desc').remove();
                    el.querySelector('.item.box_2').classList.remove('justify-content-between');
                    el.querySelector('.item.box_2').classList.add('justify-content-around');
                }
            }
        }

        pag(1, null, countListQuiz);
        //По клюку на пункт отрубаем предыдущее значение
        const btnList = briefChecklist.querySelectorAll('.opros .list .item');
        btnList.forEach(el => {
            el.onclick = () => {
                el.closest('.list').querySelectorAll('.item.active').forEach(el => {
                    el.classList.remove('active');
                });
                el.classList.add('active');
            };
        });

        //Все input с которыми взаимодействуют вносим значение в поле
        briefChecklist.querySelectorAll('input').forEach(el => {
            el.onchange = () => {
                el.closest('.item').querySelector('p.desc').innerText = el.value;
            };
        });

        //Пагинация
        const btnPag = briefChecklist.querySelectorAll('.brief-pagination p');
        btnPag.forEach(el => {
            el.onclick = () => {
                const calc_num = briefChecklist.getAttribute('data-elem');
                const btn = el.getAttribute('data-step');
                const el_count = briefChecklist.querySelector('.item.box_1 .now');
                const el_list_active = briefChecklist.querySelector('.list.active');
                let step = Number(el_count.innerText);


                if (btn === 'next') {
                    const text = el_list_active.querySelector('.item.active p.desc').innerText;
                    const errorBox = briefChecklist.querySelector('.brief-pagination .message');
                    if (
                        text.length >= 2 || Number(text) >= 1
                    ) {
                        step++;
                        el_list_active.classList.remove('active');
                        briefChecklist.querySelector('.opros .list[data-list="' + step + '"]').classList.add('active');
                    } else {
                        fadeIn(errorBox);
                        setTimeout(()=>{
                            fadeOut(errorBox);
                        },1500);
                    }
                }

                if (btn === 'prev') {
                    step--;
                    el_list_active.classList.remove('active');
                    briefChecklist.querySelector('.opros .list[data-list="' + step + '"]').classList.add('active');
                }
                el_count.innerText = step;
                pag(step, calc_num, countListQuiz);
            };
        });
        const btnGoCookie = briefChecklist.querySelector('input.wpcf7-form-control.wpcf7-submit.btn');
        if (btnGoCookie){
            btnGoCookie.addEventListener("click", () => {
                document.querySelector('.brief_btn[data-pop="brief_popUp"]').classList.add('d-none');
                document.cookie = "briefChecklist=1; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            });
        }
    }

    /**
     * Слайдеры
     */
    new Swiper(".featuresCarousel", {
        autoHeight: true,
        centeredSlides: true,
        spaceBetween: 30,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    new Swiper(".testimonialsCarousel", {
        slidesPerView: 3,
        autoHeight: true,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0:{
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 3,
            },
        },
    });

    /**
     * [bootstrap] Включаем всплывашки
     */
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    /**
     * Цели Яндекс.Метрики
     */
    function yaMetrics(el, name, event) {
        const btn = document.querySelectorAll(el);
        btn.forEach(function (elem) {
            if (name === 'onclick') {
                elem.setAttribute(event, `ym(56657251,"reachGoal","${name}");return true;`);
            } else {
                elem.setAttribute(event, `ym(56657251,"reachGoal","${name} .wpcf7-form-control.wpcf7-submit");return true;`);
            }
        });
    }

    yaMetrics('#web-zvonok', 'click_popup_btn_web_zvonok', 'onclick');
    yaMetrics('#top-line .phone a', 'click_phone_header', 'onclick');
    yaMetrics('#top-line .email a', 'click_email_header', 'onclick');
    yaMetrics('#header_site a[data-pop="header_btn_click"]', 'click_popup_btn_web_zvonok_header', 'onclick');
    yaMetrics('#header_site a[data-pop="conversus_pop"]', 'click_popup_btn_conversus_header', 'onclick');
    yaMetrics('.conversus_pop[data-pop="conversus_pop"]', 'click_popup_btn_conversus', 'onclick');
    yaMetrics('#tariffs .popClick', 'click_popup_btn_tariffs', 'onclick');
    yaMetrics('#demo .popClick', 'click_popup_btn_demo', 'onclick');
    yaMetrics('#actions-page .popClick', 'click_popup_btn_action', 'onclick');

    const btnCF7YandexMetric = document.querySelectorAll('.wpcf7-form-control.wpcf7-submit');
    btnCF7YandexMetric.forEach(function (btn) {
        let yandexMetric = btn.getAttribute('onclick');
        if (yandexMetric === undefined) {
            btn.setAttribute('onsubmit', 'ym(56657251,"reachGoal","other_send");return true;');
        }
    });

    /**
     * Клики по кнопкам, для заполнения форм
     */
    // Блок с тарифами -> /tarify/
    document.querySelectorAll('#tariffs *[data-pop="tariff_by"]').forEach(el => {
        el.onclick = () => {
            const form = document.getElementById(el.getAttribute('data-pop'));
            const tariff = el.closest('.item').querySelector('p.title').innerText;
            const price = el.closest('.item').querySelector('p.price > span').innerText;

            form.querySelector('p.title > span.tariff').innerText = tariff;
            form.querySelector('input[name="tariff"]').value = `Подключение по тарифу: ${tariff}`;
            form.querySelector('input[name="price"]').value = price;
        };
    });

    /**
     * Плавный скрол к маяку (Beacon) по клику
     */
    const btnScrollBeacon = document.querySelectorAll('*[data-where]');
    if (btnScrollBeacon){
        btnScrollBeacon.forEach(el => {
            el.onclick = () => {
                let where = el.getAttribute('data-where');
                const block = document.getElementById(where);
                if (block){
                    const scrollTarget = block.getBoundingClientRect();
                    const elementPosition = scrollTarget.top - 95;
                    window.scrollBy({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }else {
                    console.error('Блок не найден')
                }

            };
        });
    }

    /**
     * Скрыть Получить расчет в footer
     */
    window.onscroll = () => {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        const scrollTop = window.pageYOffset;
        const indentBottom = scrollHeight - window.innerHeight - 50;
        const btn = document.querySelector('div[data-pop="brief_popUp"]');
        if (scrollTop > indentBottom){
            btn.style.cssText = 'opacity: 0;zIndex: -99;transition: .5s;';
        }else {
            btn.style.cssText = 'opacity: 1;zIndex: 1;transition: .5s;';
        }
    }

    /**
     * Дата в footer
     */
    document.getElementById('data-year-site').innerText = new Date().getFullYear();

    /**
     * Анимация подарка в строку
     */
    const giftAnimation = document.getElementById('action_line_banner');
    if (giftAnimation){
        let img = giftAnimation.querySelector('img');
        setInterval(()=>{
            if (img.classList.contains('animate')){
                img.classList.remove('animate');
            }else {
                img.classList.add('animate');
            }
        }, 2000);
    }

    /**
     * Собираем данные сквозной аналитики Битрикс
     */
    const btnCF7Bitrix24 = document.querySelectorAll('.wpcf7-form-control.wpcf7-submit');
    btnCF7Bitrix24.forEach(clickBtn => {
        clickBtn.onmouseover = function () {
            let traceInput = this.closest('form').querySelector('input[name="TRACE"]');
            if (b24Tracker) {
                if (traceInput) {
                    traceInput.value = b24Tracker.guest.getTrace();
                }
            }
        };
    });
}