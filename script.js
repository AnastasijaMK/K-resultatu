$(document).ready(function () {

    // Маски
    $("input[type='tel']").mask("+7 (999) 999-99-99");
    // Перенос курсора в начало поля
    $.fn.setCursorPosition = function(pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };
    $('input[type="tel"]').click(function(){
        if ($(this).val() == "+7 (___) ___-__-__") {
            $(this).setCursorPosition(4);
        }
    });


    // Просмотр фото
    Fancybox.bind("[data-fancybox]", {});


    // Слайдеры -->
    $(".promotion__inner").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        dots: true,
        arrows: true,
        prevArrow: $(".promotion__arrow--prev"),
        nextArrow: $(".promotion__arrow--next"),
        fade: true,
        infinite: true,
        responsive: [
            {
                breakpoint: 1299,
                settings: {
                    arrows: false,
                },
            }
        ],
    });

    $(".about__inner").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: true,
        prevArrow: $(".about__arrow--prev"),
        nextArrow: $(".about__arrow--next"),
        fade: true,
        infinite: true,
        pauseOnFocus: false,
        responsive: [
            {
                breakpoint: 1299,
                settings: {
                    arrows: false,
                },
            },
        ],
    });

    if($(window).width() < 768) {
        $('.directions').on('init', (slick)=>{
            const subject = document.querySelectorAll('.direction.slick-cloned');
            for(let i=0; i<subject.length; i++) {
                initDirection(subject[i]);
            };
        });
        $(".directions").slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            swipeToSlide: true,
            variableWidth: true,
            infinite: true
        });

    }
    // Слайдеры <--
});


// Корректировка отображения всплывающих окон в мобильных браузерах
function calcVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}
calcVH();
window.addEventListener('resize', function(event) {
    calcVH();
}, true);


// Настройка карты
if(document.getElementById('map__wrap')) {
    ymaps.ready(function () {
        var myMap = new ymaps.Map(
            "map__wrap",
            {
                center: [56.251517, 43.868059],
                zoom: 14,
                controls: [
                    "zoomControl",
                    "rulerControl",
                    "routeButtonControl",
                    "trafficControl",
                    "typeSelector",
                    "fullscreenControl",
                ],
            },
            {
                searchControlProvider: "yandex#search",
            }
        );

        //Создание геометки
        placemark = new ymaps.Placemark(
            [56.251517, 43.868059],
            {
                iconCaption: "Комсомольская улица, 1Б",
            },
            {
                preset: "islands#redDotIconWithCaption",
            }
        );
        // Запрет масштабирования карты колесиком мыши
        myMap.behaviors.disable("scrollZoom");
        if ($(window).width() < 768) {
            myMap.behaviors.disable("drag");
        }

        myMap.geoObjects.add(placemark);
    });
}


// Выпадающие списки -->
const dropdownButton = document.querySelectorAll(".field--select");
for (let i = 0; i < dropdownButton.length; i++) {
    dropdownButton[i].addEventListener("click", () => {
        if (dropdownButton[i].classList.contains("active")) {
            closeDropdown();
        } else {
            if(document.querySelectorAll(".field--select.active").length > 0) {
                closeDropdown();
            }
            dropdownButton[i].classList.add("active");
            
            // Добавить дымку, если список длинный
            let dropdownHeight = dropdownButton[i].querySelector(".field__list_inner").offsetHeight;
            let dropdownMaxHeight = +(getComputedStyle(dropdownButton[i].querySelector(".field__list_wrap")).maxHeight).replace('px','');
            dropdownHeight += +(getComputedStyle(dropdownButton[i].querySelector(".field__list_wrap")).paddingTop).replace('px','');
            dropdownHeight += +(getComputedStyle(dropdownButton[i].querySelector(".field__list_wrap")).paddingBottom).replace('px','');
            dropdownButton[i].querySelector(".field__list_wrap").style.height = dropdownHeight + 'px';
            if(dropdownHeight > dropdownMaxHeight) {
                dropdownButton[i].classList.add('field--hidden');
            }

            // Прокрутить окно, если список не помещается на экране
            let dropdownBottomPosition = dropdownButton[i].querySelector('.field__list_wrap').getBoundingClientRect().top + window.pageYOffset + Math.min(dropdownHeight, dropdownMaxHeight);
            let windowBottom = window.pageYOffset + document.documentElement.clientHeight;
            if(dropdownBottomPosition > windowBottom) {
                window.scrollBy(0, dropdownBottomPosition-windowBottom + 10);
            }
        }
    });

    const dropdownItem = dropdownButton[i].querySelectorAll('.field__checkbox input');
    for(let l=0; l<dropdownItem.length; l++) {
        dropdownItem[l].addEventListener('change',()=>{
            let dropdownItemValue = dropdownItem[l].value;
            let dropdownField = dropdownItem[l].closest('.field--select').querySelector('.field__input');
            if(dropdownItem[l].getAttribute('type') == 'checkbox') {
                if(dropdownItem[l].getAttribute('name') === 'CLASS_GRADE') {
                    // Выбор класса/курса
                    if(dropdownItem[l].checked) {
                        for(let p=0; p<dropdownItem.length; p++) {
                            dropdownItem[p].checked = false;
                        }
                        dropdownItem[l].checked = true;
                        dropdownField.value = dropdownItemValue;
                    } else {
                        dropdownField.value = '';
                    }
                } else {
                    if(dropdownItem[l].checked) {
                        dropdownField.value = (dropdownField.value == '') ? dropdownItemValue : (dropdownField.value + ', ' + dropdownItemValue);
                    } else {
                        if(dropdownField.value == dropdownItemValue) {
                            dropdownField.value = '';
                        } else {
                            if((dropdownField.value.split(','))[0] == dropdownItemValue) {
                                dropdownField.value = dropdownField.value.replace(dropdownItemValue + ', ', '');
                            } else {
                                dropdownField.value = dropdownField.value.replace(', ' + dropdownItemValue, '');
                            }
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('click',(e)=>{
    if (document.querySelector('.field--select.active') && !document.querySelector('.field--select.active').contains(e.target)) {
        closeDropdown();
    }
},{passive: true});

function closeDropdown() {
    const dropdownActive =  document.querySelector('.field--select.active');
    dropdownActive.classList.remove("active");
    dropdownActive.classList.remove("field--hidden");
    dropdownActive.querySelector(".field__list_wrap").style.height = '';
}
// Выпадающие списки <--


// Отправить форму
const formButtonSent = document.querySelectorAll('.button-send-form');
for(let i=0; i<formButtonSent.length; i++) {
    formButtonSent[i].addEventListener('click',(e)=>{
        e.preventDefault();
        if(!formButtonSent[i].classList.contains('active')) {
            const form = formButtonSent[i].closest('form');
            const formFields = form.querySelectorAll('.field__input');
            const formTextareas = form.querySelectorAll('textarea');
            let buttonActive = true;
            let readyToFillFormTimer;
            for(let l=0; l<formFields.length; l++) {
                formFields[l].closest('.form__field').classList.remove('warning');
                if(formFields[l].hasAttribute('required') &&
                    formFields[l].getAttribute('type') === 'tel' &&
                    formFields[l].value.indexOf('_') > -1) {
                    formFields[l].closest('.form__field').classList.add('warning');
                    formFields[l].closest('.form__field').querySelector('.field__error').innerText = 'Неверный формат';
                    buttonActive = false;
                } else if(formFields[l].hasAttribute('required') &&
                    formFields[l].getAttribute('name') === 'NAME' &&
                    formFields[l].value.trim().length > 0) {
                    const regexForNameFigure = new RegExp("\\d", "g");
                    const regexForNameSign = new RegExp(/[.,:;!?_(){}\[\]\/|+=*&^%$#@"'№]/);
                    if(regexForNameFigure.test(formFields[l].value) ||
                        regexForNameSign.test(formFields[l].value)) {
                        formFields[l].closest('.form__field').classList.add('warning');
                        formFields[l].closest('.form__field').querySelector('.field__error').innerText = 'Не должно быть цифр и знаков препинания';
                        buttonActive = false;
                    }
                } else if(formFields[l].hasAttribute('required') && formFields[l].value.trim() == '') {
                    formFields[l].closest('.form__field').classList.add('warning');
                    formFields[l].closest('.form__field').querySelector('.field__error').innerText = formFields[l].closest('.form__field').querySelector('.field__error').getAttribute('data-field-text');
                    buttonActive = false;
                }
                formFields[l].addEventListener('click',()=>{
                    formFields[l].closest('.form__field').classList.remove('warning');
                    clearTimeout(readyToFillFormTimer);
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                });
                formFields[l].addEventListener('change',()=>{
                    formFields[l].closest('.form__field').classList.remove('warning');
                    clearTimeout(readyToFillFormTimer);
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                });
            }
            for(let l=0; l<formTextareas.length; l++) {
                formTextareas[l].addEventListener('click',()=>{
                    clearTimeout(readyToFillFormTimer);
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                });
                formTextareas[l].addEventListener('change',()=>{
                    clearTimeout(readyToFillFormTimer);
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                });
            }
            if(buttonActive) {
                for(let l=0; l<formFields?.length; l++) {
                    formFields[l].closest('.form__field').classList.remove('warning');
                    formFields[l].value = '';
                }
                for(let l=0; l<formTextareas?.length; l++) {
                    formTextareas[l].value = '';
                }
                formButtonSent[i].querySelector('.button__text').innerText = 'Заявка отправлена';
                formButtonSent[i].classList.add('active');
                readyToFillFormTimer = setTimeout(()=>{
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                }, 5000);
            }
        }
    });
}


// Всплывающее окно формы
const openFormButton = document.querySelectorAll('.button-open-form');
const shadow = document.querySelector('.wrapper--shadow');
const popupForm = document.querySelector('.popup--form');
for(let i=0; i<openFormButton.length; i++) {
    openFormButton[i].addEventListener('click',()=>{
        shadow.classList.add('active');
        popupForm.classList.add('active');
        if(openFormButton[i].hasAttribute('data-promotion')) {
            popupForm.setAttribute('data-promotion', openFormButton[i].getAttribute('data-promotion'));
        }
        if(openFormButton[i].hasAttribute('data-format')) {
            popupForm.setAttribute('data-format', openFormButton[i].getAttribute('data-format'));
        }

        if(window.screen.availWidth < 768) {
            setTimeout(()=>{
                bodyFixed();
                calcVH();
            }, 400);
        }
    });
}

const subject = document.querySelectorAll('.direction');
for(let i=0; i<subject.length; i++) {
    initDirection(subject[i]);
};
function initDirection(subject) {
    subject.addEventListener('click',()=>{
        shadow.classList.add('active');
        popupForm.classList.add('active');

        const subjectName = subject.querySelector('.direction__title').innerText;
        const subjectsInPopup = popupForm.querySelectorAll('input[name="SUBJECT_TYPE"]');
        for(let l=0; l<subjectsInPopup.length; l++) {
            if(subjectsInPopup[l].value == subjectName) {
                subjectsInPopup[l].click();
            }
        }

        if(window.screen.availWidth < 768) {
            setTimeout(()=>{
                bodyFixed();
                calcVH();
            }, 400);
        }
    });
}


// Закрытие всплывающего окна формы
function popupClose() {
    shadow.style.opacity = '0';
    setTimeout(()=>{
        shadow.classList.remove('active');
        shadow.style.opacity = '';
    }, 400);

    // Очищаем поля ввода формы с заявкой
    if(popupForm.classList.contains('active')) {
        const popupField = popupForm.querySelectorAll('.field');
        for(let i=0; i<popupField.length; i++) {
            if(popupField[i].classList.contains('field--select')) {
                const popupFieldListItem = popupField[i].querySelectorAll('.field__list input');
                for(let l=0; l<popupFieldListItem.length; l++) {
                    if(popupFieldListItem[l].checked) {
                        popupFieldListItem[l].click();
                    }
                }
            }
            if(popupField[i].querySelector('.field__input')) popupField[i].querySelector('.field__input').value = '';
            if(popupField[i].querySelector('textarea')) popupField[i].querySelector('textarea').value = '';
            popupField[i].classList.remove('warning');
        }
        popupForm.querySelector('.button-send-form').classList.remove('active');
        popupForm.querySelector('.button-send-form .button__text').innerText = 'Отправить заявку';
    }

    if(window.screen.availWidth < 768) {
        bodyUnfixed();
    }

    popupForm.classList.remove('active');
    popupForm.removeAttribute('data-promotion');
    popupForm.removeAttribute('data-format');
}

const popupCloseButton = document.querySelectorAll('.popup__close');
for(let i=0; i<popupCloseButton.length; i++) {
    popupCloseButton[i].addEventListener('click',()=>{
        popupClose();
    });
}

shadow.addEventListener('click',()=>{
    popupClose();
});


// Смена фона под шапкой при прокрутке страницы
function headerBgChange() {
    let windowScrollTo = document.documentElement.scrollTop;
    if (windowScrollTo > 10) {
        document.querySelector('.header').classList.add('header--scrolling');
    } else {
        document.querySelector('.header').classList.remove('header--scrolling');
    }
}
if(document.documentElement.scrollTop > 20) {
    headerBgChange();
}
window.addEventListener('scroll',()=>{
    headerBgChange();
}, {passive: true});
window.addEventListener('resize',()=>{
    headerBgChange();
}, {passive: true});


// Открытие/закрытие меню
const buttonMenuOpen = document.querySelector('.button-open-menu');
const popupMenu = document.querySelector('.popup--menu');
buttonMenuOpen.addEventListener('click',()=>{
if(buttonMenuOpen.classList.contains('active')) {
    bodyUnfixed();
    buttonMenuOpen.classList.remove('active');
    popupMenu.classList.remove('active');
} else {
    buttonMenuOpen.classList.add('active');
    popupMenu.classList.add('active');
    setTimeout(()=>{
        bodyFixed();
        calcVH();
    }, 400);
}
});

 
 // Запретить прокрутку страницы при открытии всплывающих окон
function bodyFixed() {
document.body.setAttribute('data-scroll',window.pageYOffset);
document.body.style.position = 'fixed';
}

// Разрешить прокрутку страницы при закрытии всплывающих окон
function bodyUnfixed(scrollToValue = document.body.getAttribute('data-scroll')) {
document.body.style.position = '';
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, scrollToValue);
document.documentElement.style.scrollBehavior = '';
document.body.removeAttribute('data-scroll');
}


 // Плавная прокрутка к якорю
const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute('href');
        let scrollToValue = document.querySelector(id).getBoundingClientRect().top;
        scrollToValue = scrollToValue + window.pageYOffset;
        scrollToValue -= document.querySelector('header').offsetHeight;
        scrollToValue -= 20;
        if(popupMenu.classList.contains('active')) {
            bodyUnfixed(scrollToValue);
            buttonMenuOpen.classList.remove('active');
            popupMenu.classList.remove('active');
        } else {
            let scrollBlock = window;
            scrollBlock.scrollTo(0, scrollToValue);
        }
    });
}


// Контроль за положением иконок соц сетей на десктопе при прокрутке
function controlSocial() {
    if(document.documentElement.clientWidth > 1199) {
        const socialBlock = document.querySelector('.wrapper > .social');
        if(!socialBlock) return;
        if(document.querySelector('.footer').getBoundingClientRect().top <= document.documentElement.clientHeight) {
            socialBlock.classList.add('social--hidden');
        } else {
            socialBlock.classList.remove('social--hidden');
        }
    }
}
controlSocial();
window.addEventListener('scroll',()=>{
   controlSocial();
}, {passive: true});


// Предупреждение о cookie
function checkCookie() {
    const cookie = document.querySelector('.popup__cookies');
    if(!cookie) return;
    if (document.cookie.indexOf("warning") == -1) {
        cookie.classList.add("popup__cookies--active");
    }

    const cookieButton = cookie.querySelector('.cookies__button');
    cookieButton?.addEventListener('click',()=>{
        cookie.classList.remove("popup__cookies--active");
        document.cookie = "warning=true; max-age=2592000; path=/";
    });
}
setTimeout(()=>{
    checkCookie();
}, 3000);