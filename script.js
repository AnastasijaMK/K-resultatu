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


    // Слайдеры -->
    $(".promotion__inner").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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
            },
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
            if(dropdownItem[l].getAttribute('type') == 'radio') {
                if(dropdownItem[l].checked) {
                    dropdownField.value = dropdownItemValue + '  класс';
                } else {
                    dropdownField.value = '';
                }
            } else if(dropdownItem[l].getAttribute('type') == 'checkbox') {
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
        });
    }
}

document.addEventListener('click',(e)=>{
    if (document.querySelector('.field--select.active') && !document.querySelector('.field--select.active').contains(e.target)) {
        closeDropdown();
    }
});

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
            let buttonActive = true;
            let readyToFillFormTimer;
            for(let l=0; l<formFields.length; l++) {
                formFields[l].closest('.form__field').classList.remove('warning');
                if(formFields[l].getAttribute('required') == 'true' && formFields[l].value.trim() == '') {
                    formFields[l].closest('.form__field').classList.add('warning');
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
            if(buttonActive) {
                formButtonSent[i].classList.add('active');
                for(let l=0; l<formFields?.length; l++) {
                    formFields[l].closest('.form__field').classList.remove('warning');
                    formFields[l].value = '';
                }
                formButtonSent[i].querySelector('.button__text').innerText = 'Заявка отправлена';
                readyToFillFormTimer = setTimeout(()=>{
                    formButtonSent[i].querySelector('.button__text').innerText = 'Отправить заявку';
                    formButtonSent[i].classList.remove('active');
                }, 3000);
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

        if(window.screen.availWidth < 768) {
            setTimeout(()=>{
                bodyFixed();
            }, 400);
        }
    });
}

const subject = document.querySelectorAll('.direction');
for(let i=0; i<subject.length; i++) {
    subject[i].addEventListener('click',()=>{
        shadow.classList.add('active');
        popupForm.classList.add('active');

        const subjectName = subject[i].querySelector('.direction__title').innerText;
        const subjectsInPopup = popupForm.querySelectorAll('input[name="SUBJECT_TYPE"]');
        for(let l=0; l<subjectsInPopup.length; l++) {
            if(subjectsInPopup[l].value == subjectName) {
                subjectsInPopup[l].click();
            }
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
            popupField[i].querySelector('.field__input').value = '';
        }
        popupForm.querySelector('.button-send-form').classList.remove('active');
        popupForm.querySelector('.button-send-form .button__text').innerText = 'Отправить заявку';
    }

    if(window.screen.availWidth < 768) {
        bodyUnfixed();
    }

    popupForm.classList.remove('active');
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
    if ($(window).width() < 1200) {
        let windowScrollTo = $(window).scrollTop();
        if (windowScrollTo > 5) {
            $('header').addClass('scrolling');
        } else {
            $('header').removeClass('scrolling');
        }
    }
}
headerBgChange();
$(window).scroll(function(){
    headerBgChange();
});
$(window).resize(()=>{
    headerBgChange();
});


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
        scrollToValue = window.screen.availWidth > 1199 ? 
                        (scrollToValue + document.querySelector('main').scrollTop) : 
                        (scrollToValue + window.pageYOffset);
        if(window.screen.availWidth < 1200) {
            scrollToValue -= document.querySelector('header').offsetHeight;
            scrollToValue -= 20;
        }
        if(popupMenu.classList.contains('active')) {
            bodyUnfixed(scrollToValue);
            buttonMenuOpen.classList.remove('active');
            popupMenu.classList.remove('active');
        } else {
            let scrollBlock = window.screen.availWidth < 1200 ? window :  document.querySelector('main');
            scrollBlock.scrollTo(0, scrollToValue);
        }
    });
}
