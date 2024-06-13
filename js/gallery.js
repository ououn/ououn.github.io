/*
Include this element below in your HTML
<div id="gallery-box"></div>

*/

//
var galleryFilterHeight;

var galleryWidth;// width of the gallery container
var galleryColumns;// amount of entry columns should have based on css/screen size
var galleryEntries;// amount of entries
var entryWidth;// width of entry image, height is handle by css aspect-ratio 1.5 / 1

////////////////////////////////////// on load
$(window).on( "load", galleryLoad );

function galleryLoad() {
    if ( !$("#gallery-box").length ) {return;}
    if ( entriesAll == null ) {
        setTimeout( galleryLoad, 50 );
        return;
    }

    createGalleryFrame();
    createFilterBtn();

    entriesFiltered = entriesAll;
    loadFilterEntry();
    loadSeriesEntry();
    createLightbox();

    //// adjust entries size when load/resize
    galleryWidth = $("#gallery-box").width();
    galleryColumns = $(":root").css("--gallery-columns");
    if ( galleryMode == 1 ) { resizeGalleryEntries(); }
}

////////////////////////////////////// on resize
$(window).on( "resize", galleryResize );

function galleryResize() {
    if ( entriesAll == null ) {
        setTimeout( galleryResize, 50 );
        return;
    }


    if ( $("#gallery-box") ) {
        //// adjust entries size when load/resize
        galleryWidth = $("#gallery-box").width();
        galleryColumns = $(":root").css("--gallery-columns");
        if ( galleryMode == 1 ) { resizeGalleryEntries(); }
    }

    if ( $("#galleryLightbox") ) {
        lbUpdateFrameHeight();
    }

}



////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                                  ///////////////////////////
///////////////////////////          GALLERY FRAME           ///////////////////////////
///////////////////////////                                  ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function createGalleryFrame() {
    newElement( "div", ["id.append", "gallery-box"], "gallery-bar" );
        newElement( "div", ["id.append", "gallery-bar"], "view-mode" );
            newElement( "div", ["id.append", "view-mode"], "toggle" );
                newElement( "div", ["id.append", "toggle"] );
        newElement( "div", ["id.append", "gallery-bar"], "gallery-filter" );
    newElement( "div", ["id.append", "gallery-box"], "galleryEntry" );
    newElement( "div", ["id.append", "gallery-box"], "gallerySeries" );
    $("#gallerySeries").hide();
}

function createFilterBtn() {
    for ( let i = 0; i < categoriesAll.length; i++ ) {

        let thisFilter = thisName = categoriesAll[i][0];
        if ( categoriesAll[i][1] !== undefined ) {
            thisName = categoriesAll[i][1];
        }

        // create button & deactive empty categories
        if ( i == 0 || entriesAll.filter( eachEntry=>eachEntry.categories == thisFilter ).length > 0 ) { 
            newElement( "button", ["id.append", "gallery-filter"], 0, ["btn"], [ ["click", filterGallery] ], [ ["data-filter", categoriesAll[i][0] ] ], thisName )
        } else {
            newElement( "button", ["id.append", "gallery-filter"], 0, ["btn", "empty"], [ ["click", filterGallery] ], [ ["data-filter", categoriesAll[i][0] ] ], thisName )
        }
    }
    document.querySelector("#gallery-filter>button.btn:first-of-type").classList.add("active");

    // view-choice
    newElement( "button", ["id.append", "view-mode"], "view-series", ["view-choice"], [ ["click", galleryViewToggle] ], [ ["data-mode", "0" ] ] );
    newElement( "img", ["id.append", "view-series"], 0, 0, 0, [ ["src", "./images/google_font/collections_bookmark_FILL0_wght400_GRAD0_opsz48.svg"] ] );
    //
    newElement( "button", ["id.append", "view-mode"], "view-category", ["view-choice", "active"], [ ["click", galleryViewToggle] ], [ ["data-mode", "1" ] ] );
    newElement( "img", ["id.append", "view-category"], 0, 0, 0, [ ["src", "./images/google_font/grid_view_FILL0_wght400_GRAD0_opsz48.svg"] ] );
}

////////////////////////////////////// request filtered entry from button pressed
function filterGallery() {
    if ( $(this).hasClass("active") || $(this).hasClass("empty") ) {return;}

    $(this).siblings().removeClass("active");
    $(this).addClass("active");

    let getFilter = this.getAttribute("data-filter");
    if ( getFilter !== "all" ) {
        entriesFiltered = entriesAll.filter( eachEntry=>eachEntry.categories == getFilter );
    } else {
        entriesFiltered = entriesAll;
    }
    
    // clear current entries before inserting new
    let that = document.getElementById("galleryEntry");
    while ( that.firstChild ) {
        that.removeChild( that.firstChild );
    };
    loadFilterEntry();
}

////////////////////////////////////// insert entry image to galleryEntry
function loadFilterEntry() {
    for ( let i = 0; i < entriesFiltered.length; i++ ) {

        let objUrl = "";
        let objPos = "";
        //
        if ( entriesFiltered[i].url.startsWith("https://lh") || entriesFiltered[i].url.startsWith("lh") ) {
            objUrl = entriesFiltered[i].url + "=w380";// If image source is google image direct link "https://lh", request a smaller image resolution.
        } else {
            objUrl = entriesFiltered[i].url;
        }
        if ( typeof entriesFiltered[i].objPos !== "undefined" ) {
            objPos = entriesFiltered[i].objPos;// Apply custom object-position.
        }

        // Insert image to HTML. Wrap so that scale on hover inside container
        $("<img/>", {
            class: "entry",
            css: {
                "width": "100%", "height": "100%",
                "content": "url(" + objUrl + ")",
                "object-position": objPos,
                "object-fit": "cover"
            },
            "loading": "lazy",
            "data-url": entriesFiltered[i].url,
            "data-filtered-index": i
        }).wrap( "<div class='entryWrapper' style='width: " + entryWidth + "px;'>" ).parent().prependTo("#galleryEntry")
    }
    Array.from( document.querySelectorAll("#galleryEntry>.entryWrapper") ).forEach( function(element) {
        element.addEventListener("click", showLightbox );//call lightbox to display
    })
}


////////////////////////////////////// create gallery series

var seriesEntryHeight;
function loadSeriesEntry() {
    for ( let i = 0; i < seriesAll.length; i++ ) {
        newElement( "div", ["id.append", "gallerySeries"], 0, ["seriesEntry"], 0, [ ["data-series", seriesAll[i].title ] ] );// generate box for each series
        console.log(entriesAll);
        console.log(seriesAll);
        entriesFilteredTemp = entriesAll.filter( eachEntry=>eachEntry.series == seriesAll[i].title );// filter from entriesAll
        console.log(entriesFilteredTemp);

        for ( let i2 = entriesFilteredTemp.length - 1; i2 >= 0 & i2 >= entriesFilteredTemp.length - 5; i2-- ) {// generate upto 5 newest series preview
            let objUrl = "";
            let objPos = "";
            //
            if ( entriesFilteredTemp[i2].url.startsWith("https://lh") || entriesFilteredTemp[i2].url.startsWith("lh") ) {
                objUrl = entriesFilteredTemp[i2].url + "=w380";// If image source is google image direct link "https://lh", request a smaller image resolution.
            } else {
                objUrl = entriesFilteredTemp[i2].url;
            }
            if ( typeof entriesFilteredTemp[i2].objPos !== "undefined" ) {
                objPos = entriesFilteredTemp[i2].objPos;// Apply custom object-position.
            }
            newElement( "div", ["querySelector.append", "#gallerySeries>.seriesEntry:last-of-type"], 0, ["seriesEachDiv"], [ ["mouseenter", seriesBIG], ["click", showLightbox] ], [ ["data-series-index", i2] ]);
            newElement( "img", ["querySelector.append", "#gallerySeries>.seriesEntry:last-of-type>.seriesEachDiv:last-of-type"], 0, ["seriesEachEntry"], 0, [ ["src", objUrl] ] );
        }
        let pickBig = getRandomInt( 0, Math.min(5, entriesFilteredTemp.length) );
        if ( $("#gallerySeries>.seriesEntry:last-of-type").children().length > 1 ) {
            $("#gallerySeries>.seriesEntry:last-of-type>.seriesEachDiv:nth-of-type(" + (pickBig + 1) + ")").addClass("active");
        } else {
            $("#gallerySeries>.seriesEntry:last-of-type>.seriesEachDiv:last-of-type").addClass("active");
        }
        let seriesInfoTitle = $("#gallerySeries>.seriesEntry:last-of-type>.seriesEachDiv.active").parent().data("series");
        console.log(seriesInfoTitle);
        console.log(seriesAll);
        let seriesInfoDesc = seriesAll.filter( eachEntry=>eachEntry.title == seriesInfoTitle )[0].desc;
        console.log(seriesInfoDesc);
        $("#gallerySeries>.seriesEntry:last-of-type>.seriesEachDiv.active").append("<div class='seriesInfo'><p class='seriesTitle'>" + seriesInfoTitle + "</p><p class='seriesDesc'>" + seriesInfoDesc + "</p></div>");
    }
}

function seriesBIG() {
    $(this).siblings(".active").children(".seriesInfo").remove();
    $(this).siblings().removeClass("active");
    //
    if ( $(this).hasClass("active") ) {return;}
    let seriesInfoTitle = $(this).parent().data("series");
    let seriesInfoDesc = seriesAll.filter( eachEntry=>eachEntry.title == seriesInfoTitle )[0].desc;
    $(this).append("<div class='seriesInfo'><p class='seriesTitle'>" + seriesInfoTitle + "</p><p class='seriesDesc'>" + seriesInfoDesc + "</p></div>");
    $(this).addClass("active");
}

////////////////////////////////////// apply filter max height when out from view-category
var galleryMode = 1;//0 = series, 1 = category
function galleryViewToggle() {
    let switchTo = Number( this.getAttribute("data-mode") );
    if ( $(this).hasClass("active") ) {
        return;
    }

    $(".view-choice.active").removeClass("active");
    $(this).addClass("active");
    galleryMode = switchTo;

    let fixed = switchTo == 0 ? -1 : 0;
    let output = (switchTo * 48.5) + fixed;
    $("#toggle>div").css("margin-left", output);

    switch(switchTo) {
        case 0:
            $("#gallery-filter").hide("slide", {direction: "left"} ,600);
            $("#galleryEntry").slideUp(600);
            $("#view-category").attr( "data-filter-store", $("#gallery-filter>button.btn.active").attr("data-filter") );
            //
            $("#gallerySeries").slideDown(600);
            break;
        case 1:
            $("#gallery-filter").show("slide", {direction: "left"} ,600);
            $("#galleryEntry").slideDown(600);
            resizeGalleryEntries();
            //
            $("#gallerySeries").slideUp(600);
            //
            let restoreFilter = $("#view-category").attr("data-filter-store");
            if ( restoreFilter == "all" ) {
                entriesFiltered = entriesAll
            } else {
                entriesFiltered = entriesAll.filter( eachEntry=>eachEntry.categories == $("#view-category").attr("data-filter-store") );
            }
            let that = document.getElementById("galleryEntry");
            while ( that.firstChild ) {
                that.removeChild( that.firstChild );
            };
            loadFilterEntry();
            //$("#view-category").attr( "data-filter-store", $("#gallery-filter>button.btn.active").attr("data-filter") );
            break;
    }
}

////////////////////////////////////// adjust entries size when load/resize
function resizeGalleryEntries() {
    galleryEntries = document.querySelectorAll("#galleryEntry .entryWrapper");
    entryWidth = (galleryWidth - 13 * (galleryColumns - 1) ) / galleryColumns;// 3 column has 2 gap = 2 * 13 = 26
    $("#galleryEntry .entryWrapper").css("width", entryWidth);
}


////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                                  ///////////////////////////
///////////////////////////            LIGHTBOX              ///////////////////////////
///////////////////////////                                  ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function createLightbox() {
    document.body.addEventListener( "keydown", lbKeyDown );
    document.body.setAttribute( "tabindex", "0" );
    newElement( "div", ["body.append"], "galleryLightbox", ["lb_background"], [ ["click", hideLightbox] ] );//background
    //
    newElement( "div", ["id.append", "galleryLightbox"], "lb_text", 0, 0, [ ["oncontextmenu", "return false"], ["draggable", "false"] ] );
        newElement( "p", ["id.append", "lb_text"], "lb_title", 0, 0, [ ["oncontextmenu", "return false"], ["draggable", "false"] ], "Title" );
        newElement( "p", ["id.append", "lb_text"], "lb_desc", 0, 0, [ ["oncontextmenu", "return false"], ["draggable", "false"] ], "Description" );
    newElement( "img", ["id.append", "galleryLightbox"], "lb_frame", ["clickstionable"], 0, [ ["oncontextmenu", "return false"], ["draggable", "false"] ] );//frame
    //
    newElement( "div", ["id.append", "galleryLightbox"], "lb_thumbList" );//thumbnail box
        newElement( "div", ["id.append", "lb_thumbList"], "lb_thumbScroll", 0, [ ["wheel", whenLightboxScroll] ] );//thumbnail box scrollable
    //
    newElement( "p", ["id.append", "galleryLightbox"], "lb_count" );// current/count
    newElement( "img", ["id.append", "galleryLightbox"], 0, ["lb_pre", "lb_next", "lb_btn"], [ ["click", lbPrepostBtn] ] );//pre button
    newElement( "img", ["id.append", "galleryLightbox"], 0, ["lb_post", "lb_next", "lb_btn"], [ ["click", lbPrepostBtn] ] );//post button
    newElement( "img", ["id.append", "galleryLightbox"], 0, ["lb_x", "lb_btn"], [ ["click", hideLightbox] ] );//exit button

    hideLightbox(event, 1);
};

let lightboxCurrent;
let lightboxSeriesCheck;
function showLightbox() {

    lightboxSeriesCheck = 0;
    if ( $(this).hasClass("seriesEachDiv") ) {
        lightboxSeriesCheck = 1;
        entriesFiltered = entriesAll.filter( eachEntry=>eachEntry.series == $(this).parent().data("series") );
    }
    // thumb start & end, create entries
    for (let i = 0; i < entriesFiltered.length; i++) {
        newElement( "img", ["id.prepend", "lb_thumbScroll"], 0, ["eachLight"], [ ["click", updateFrame] ], [ ["draggable", "false"] ] );

        let sizeSrc;
        if ( entriesFiltered[i].url.startsWith("https://lh") || entriesFiltered[i].url.startsWith("lh") ) {
            sizeSrc = entriesFiltered[i].url + "=w100";
        } else {
            sizeSrc = entriesFiltered[i].url;
        }

        document.querySelector("img.eachLight:first-of-type").src = sizeSrc;
    };
    newElement( "div", ["id.prepend", "lb_thumbScroll"], 0, ["lightSpacer"] );
    newElement( "div", ["id.append", "lb_thumbScroll"], 0, ["lightSpacer"] );

    $("#galleryLightbox").fadeTo(300, 1);
    $("#galleryLightbox").show();

    // scroll to current selected entry
    let getUrl;
    if ( lightboxSeriesCheck == 0 ) {
        lightboxCurrent = Number( this.childNodes[0].getAttribute("data-filtered-index") );
        getUrl = this.childNodes[0].getAttribute("data-url");
    } else if ( lightboxSeriesCheck == 1 ) {
        lightboxCurrent = Number( this.getAttribute("data-series-index") );
        getUrl = entriesFiltered[lightboxCurrent].url;
    }
    lbCurrentUpdated(getUrl);

    document.body.style.overflow = "hidden";
    document.body.style.userSelect = "none";
}
//
function lbCurrentUpdated(thisUrl) {
    $("#lb_frame").attr("src", "");
    document.getElementById("lb_frame").src =  thisUrl;

    scrollToEntry(lightboxCurrent, 95);// 80 thumb + 15 gap

    // add class to current .eachLight
    let tmpLength = entriesFiltered.length;
    $(".eachLight").removeClass("current");
    $(".eachLight").eq( tmpLength - 1 - lightboxCurrent ).addClass("current");

    // update image count
    $("#lb_count").text( ( tmpLength - lightboxCurrent ) + "/" + tmpLength );

    // update lightbox button availability
    lbPrepostCheck();

    // vertical align img frame
    $("#lb_frame").css({
        "margin-top": "30px",
        "width": "600px",
        "height": "400px"
    });
    lbUpdateFrameHeight();
}
//
function lbPrepostCheck() {
    let tmpLength = entriesFiltered.length;
    if ( lightboxCurrent == tmpLength - 1 ) {
        $(".lb_pre").addClass("disable");
        if ( tmpLength > 1 ) { $(".lb_post").removeClass("disable") }
    }
    if ( lightboxCurrent == 0 ) {
        $(".lb_post").addClass("disable");
        if ( tmpLength > 1 ) { $(".lb_pre").removeClass("disable") }
    }
    if ( lightboxCurrent > 0 && lightboxCurrent < tmpLength -1 ) {
        $(".lb_pre, .lb_post").removeClass("disable")
    }
}
//
function lbUpdateFrameHeight() {
    let isLoaded = document.getElementById("lb_frame").complete && document.getElementById("lb_frame").naturalHeight !==0;
    
    if ( isLoaded == true) {
        $("#lb_frame").css({
            "width": "",
            "height": "",
            "background-image": ""
        });

        let adjustHeight = $("#lb_frame").height();
        adjustHeight = ( window.innerHeight - adjustHeight - 90 - 2*20) / 2;//120 for bottom, 2*20 for margins
        $("#lb_frame").css("margin-top", 20 + adjustHeight + "px");
        //
        $("#lb_text").css({
            "bottom": 110 + adjustHeight - 2 + "px",
            "width": $("#lb_frame").width() + 3 + "px"
        });
        let frameContent = 0;
        let frameTitle = "";
        let frameDesc = "";
        if ( entriesFiltered[lightboxCurrent].title != undefined ) {
            frameTitle = entriesFiltered[lightboxCurrent].title;
            frameContent += 1;
        }
        if ( entriesFiltered[lightboxCurrent].desc != undefined ) {
            frameDesc = entriesFiltered[lightboxCurrent].desc;
            frameContent += 1;
        }
        if ( frameContent == 0 ) {
            $("#lb_text").hide();
        } else {
            $("#lb_text").show();
            $("#lb_title").text( frameTitle );
            $("#lb_desc").text( frameDesc );
        }
        
    } else {
        let tmpFrameSize = [];
        tmpFrameSize[0] = document.getElementById("lb_frame").naturalWidth;
        tmpFrameSize[1] = document.getElementById("lb_frame").naturalHeight;
        if ( tmpFrameSize[0] > 0 && isLoaded == false && $("#lb_frame").css("background-image") == "url('../images/tmp/loader.gif')" ) {
            let vw = window.innerWidth;
            let vh = window.innerHeight;
            $("#lb_frame").css({
                "width": Math.min( vw - 2 * 80, tmpFrameSize[0] ) + "px",
                "height": Math.min( vh - 2 * 20 - 90, tmpFrameSize[1] ) + "px"
            });
        }
        //
        $("#lb_frame").css("background-image", "url('../images/tmp/loader.gif')");

        setTimeout("lbUpdateFrameHeight()", 10 );
    }
}

////////////////////////////////////// hide lightbox
function hideLightbox(e, a = 0) {
    // revoke event triggered from child
    // allow .lightSpacer trigger event
    if ( a == 0 && e.currentTarget !== e.target && e.target.className != "lightSpacer" ) {return;}

    $("#galleryLightbox").fadeTo(300, 0.0);
    if ( a == 1 ) {// 1st time hiding
        delayHideLb()
    } else {// skip check when a = 0 or 2
        setTimeout("delayHideLb()",300)
    }
}

function delayHideLb() {
    let currentScrollL = $("#lb_thumbScroll").scrollLeft();
    document.getElementById("lb_thumbScroll").scrollBy( -1 * currentScrollL, 0 );

    $("#galleryLightbox").hide();
    $("#lb_frame").css("margin-top", "20px");
    document.getElementById("lb_frame").src = "";
    
    document.getElementById("lb_thumbScroll").replaceChildren();

    document.body.style.overflow = "";
    document.body.style.userSelect = "";
}

////////////////////////////////////// etc.
function scrollToEntry(index, unitLength) {
    toThis = entriesFiltered.length - 1 - index;
    document.getElementById("lb_thumbScroll").scrollTo({
        top: 0,
        left: toThis * unitLength,//80 thumb + 15 gap
        behavior: "smooth"
    })
}

function lbKeyDown(e) {
    if ( !$("#galleryLightbox") || $("#galleryLightbox").css("display") == "none" ) {return;}

    let moveDir = 0;
    if ( e.key == "ArrowLeft" ) { moveDir = 1; };
    if ( e.key == "ArrowRight") { moveDir = -1; };

    if ( moveDir >= -1 && moveDir <= 1 ) {
        if ( entriesFiltered.length - 1 == lightboxCurrent && moveDir == 1 ) { return; }
        if ( lightboxCurrent == 0 && moveDir == -1 ) { return; }

        lightboxCurrent = lightboxCurrent + moveDir;
        lbCurrentUpdated( entriesFiltered[lightboxCurrent].url );
    }

    if ( e.key == "Escape" ) { hideLightbox(2);}
}

function lbPrepostBtn() {
    if ( $(this).hasClass("disable") ) { return; }

    let moveDir = 0;
    if ( $(this).hasClass("lb_pre") ) {
        moveDir = 1;
    } else if ( $(this).hasClass("lb_post") ) {
        moveDir = -1;
    };

    lightboxCurrent = lightboxCurrent + moveDir;
    lbCurrentUpdated( entriesFiltered[lightboxCurrent].url );
}

// apply lb_frame image
function updateFrame() {
    if ( $(this).hasClass("current") ) {return;}

    lightboxCurrent = entriesFiltered.length - $(this).index();
    lbCurrentUpdated( entriesFiltered[lightboxCurrent].url );
}

// scrolling in lightbox eachLight
function whenLightboxScroll(e) {
    $(this).stop().animate({
        scrollLeft: "+=" + ( e.deltaY * 3) + "px"
        //scrollLeft: "+=" + ( Math.sign(e.deltaY) * 4 * 95 ) + "px"
    }, 200 )
    e.preventDefault();
}