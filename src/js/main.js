"use strict";
(function () {
    AOS.init();

    $('.sidebar-btn').on("click", function () {
        $('.main-nav').addClass('show-menu');
    });

    $('.menu-close-btn').on("click", function () {
        $('.main-nav').removeClass('show-menu');
    });

    const dashSidebarBtn = document.getElementById('dash-sidebar-btn');
    const dashSidebar = document.getElementById('user-sidebar');
    const overlay = document.getElementById('overlay');
    const menuClose = document.getElementById('menu-close-btn');

    if(dashSidebarBtn){
        dashSidebarBtn.addEventListener('click', function(){
            dashSidebar.classList.toggle('show-user-sidebar');
            overlay.style.opacity = '1';
            overlay.style.left = '0';
        });
    }

    if(overlay){
        overlay.addEventListener('click',function(){
            dashSidebar.classList.toggle('show-user-sidebar');
            this.style.opacity = '0';
            this.style.left = '-100%';
        });
    }

    if(menuClose){
        menuClose.addEventListener('click',function(){
            dashSidebar.classList.toggle('show-user-sidebar');
            overlay.style.opacity = '0';
            overlay.style.left = '-100%';
        });
    }

    if (document.querySelectorAll(".sidebar-menu .collapse")) {
        var collapses = document.querySelectorAll(".sidebar-menu .collapse");
        Array.from(collapses).forEach(function (collapse) {
            var collapseInstance = new bootstrap.Collapse(collapse, {
                toggle: false,
            });
            // Hide sibling collapses on `show.bs.collapse`
            collapse.addEventListener("show.bs.collapse", function (e) {
                e.stopPropagation();
                var closestCollapse = collapse.parentElement.closest(".collapse");
                if (closestCollapse) {
                    var siblingCollapses = closestCollapse.querySelectorAll(".collapse");
                    Array.from(siblingCollapses).forEach(function (siblingCollapse) {
                        var siblingCollapseInstance =
                            bootstrap.Collapse.getInstance(siblingCollapse);
                        if (siblingCollapseInstance === collapseInstance) {
                            return;
                        }
                        siblingCollapseInstance.hide();
                    });
                } else {
                    var getSiblings = function (elem) {
                        var siblings = [];
                        var sibling = elem.parentNode.firstChild;
                        while (sibling) {
                            if (sibling.nodeType === 1 && sibling !== elem) {
                                siblings.push(sibling);
                            }
                            sibling = sibling.nextSibling;
                        }
                        return siblings;
                    };
                    var siblings = getSiblings(collapse.parentElement);
                    Array.from(siblings).forEach(function (item) {
                        if (item.childNodes.length > 2)
                            item.firstElementChild.setAttribute("aria-expanded", "false");
                        var ids = item.querySelectorAll("*[id]");
                        Array.from(ids).forEach(function (item1) {
                            item1.classList.remove("show");
                            if (item1.childNodes.length > 2) {
                                var val = item1.querySelectorAll("ul li a");
                                Array.from(val).forEach(function (subitem) {
                                    if (subitem.hasAttribute("aria-expanded"))
                                        subitem.setAttribute("aria-expanded", "false");
                                });
                            }
                        });
                    });
                }
            });

            collapse.addEventListener("hide.bs.collapse", function (e) {
                e.stopPropagation();
                var childCollapses = collapse.querySelectorAll(".collapse");
                Array.from(childCollapses).forEach(function (childCollapse) {
                    let childCollapseInstance;
                    childCollapseInstance = bootstrap.Collapse.getInstance(childCollapse);
                    childCollapseInstance.hide();
                });
            });
        });
    }


    function emptyInputFiled(id, selector = 'id', html = true) {
        var identifier = selector === 'id' ? `#${id}` : `.${id}`;
        $(identifier)[html ? 'html' : 'val']('');
    }

    $('.select2-js').select2();

    $(document).on('click', '#toggle-password', function (e) {
        const passwordInput = $("#password-input");
        const passwordFieldType = passwordInput.attr('type');
        if (passwordFieldType === 'password') {
            passwordInput.attr('type', 'text');
            $("#toggle-password").removeClass('fa-duotone fa-eye eye').addClass('fa-duotone fa-eye-slash eye');
        } else {
            passwordInput.attr('type', 'password');
            $("#toggle-password").removeClass('fa-duotone fa-eye-slash eye').addClass('fa-duotone fa-eye eye');
        }
    });

    var swiper = new Swiper(".testimonial-slider", {
        slidesPerView: 1,
        speed: 1200,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: '.testi-next',
            prevEl: '.testi-prev',
        },
        autoplay: {
            delay: 3500,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },

        breakpoints: {
            280: {     
                slidesPerView: 1,
            },
            386: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
            992: {
                slidesPerView: 1,
            },
            1200: {
                slidesPerView: 1,
            },
            1400: {
                slidesPerView: 1,
            },
        }
    });

    var swiper = new Swiper(".advertise-slider", {
        effect: "cards",
        grabCursor: true,
        autoplay: true,
        slidesPerView: 'auto',
        pagination: {
            el: '.card-pagination',
            clickable: true
        },
    });

    var swiper = new Swiper(".provider-slider", {
        slidesPerView: 3,
        speed: 2500,
        spaceBetween: 15,
        loop: true,
        navigation: {
            nextEl: '.testi-next',
            prevEl: '.testi-prev',
        },
        autoplay: {
            delay: 0,
        },
        breakpoints: {
            280: {
                slidesPerView: 3,
            },
            386: {
                slidesPerView: 4,
            },
            576: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 5,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
            1400: {
                slidesPerView: 5,
            },
        }
    });

    var swiper = new Swiper(".blog-slider", {
        slidesPerView: 1,
        speed: 1200,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.testi-next',
            prevEl: '.testi-prev',
        },
        pagination: {
            el: '.card-pagination',
            clickable: true
        },
        breakpoints: {
            280: {
                slidesPerView: 1,
            },
            386: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
            1400: {
                slidesPerView: 3,
            },
        }
    });

    var swiper = new Swiper(".market-nav-slider", {
        slidesPerView: 6,
        spaceBetween: 3,
        loop: true,
        centeredSlides: false,
        navigation: {
            nextEl: ".market-next",
            prevEl: ".market-prev",
        },
        breakpoints: {
            280: {
                slidesPerView: 4,
            },
            386: {
                slidesPerView: 5,
            },
            576: {
                slidesPerView: 6,
            },
            768: {
                slidesPerView: 6,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            }
        }
    });

    var swiper = new Swiper(".market-nav-slider-2", {
        slidesPerView: 6,
        spaceBetween: 3,
        loop: true,
        centeredSlides: false,
        navigation: {
            nextEl: ".market-next-2",
            prevEl: ".market-prev-2",
        },
        breakpoints: {
            280: {
                slidesPerView: 3,
            },
            386: {
                slidesPerView: 5,
            },
            576: {
                slidesPerView: 6,
            },
            768: {
                slidesPerView: 6,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
            1400: {
                slidesPerView: 4,
            },
            1600: {
                slidesPerView: 5,
            }
        }
    });

    $(".counter-single").each(function () {
        $(this).isInViewport(function (status) {
            if (status === "entered") {
                for (var i = 0; i < document.querySelectorAll(".odometer").length; i++) {
                    var el = document.querySelectorAll('.odometer')[i];
                    el.innerHTML = el.getAttribute("data-odometer-final");
                }
            }
        });
    });

    document.querySelectorAll('#myTab a').forEach(function(everyitem){
        var tabTrigger = new bootstrap.Tab(everyitem)
        everyitem.addEventListener('mouseenter', function(){
            tabTrigger.show();
        });
    });

    $("[data-fancybox]").fancybox({});

    $('.marquee').marquee({
        duration: 30000,
        gap: 50,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true
    });
}())