//////////////////////////////////////basic functions

//for testing purpose
function testLog() {
    console.log("testLog");
}

//return expect value if input is within range
function expectFloat(input, expect, range) {
    let expectLow = expect - range;
    let expectHigh = expect + range;
    let output = input > expectLow && input < expectHigh ? expect: input;
    return output;
}

//return value contain defined amount of decimal
function keepDecimal(input, digits) {
    let output = Math.trunc(input * 10^digits) / 10^digits;
    return output;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);// The maximum is exclusive and the minimum is inclusive
}

function getTime() {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //let dateTime = date+' '+time;

    let output = time;
    return output;
}

function newElement(ele, methodTarget = [], eleId = 0, eleClasses = [], eventFunction = [], setAttrubutes = [], setInnerHTML = "//invalid" ) {
    let newEle = document.createElement(ele);

    if ( eleId !== 0 ) { newEle.id = eleId }
    if ( eleClasses.length > 0 ) { newEle.classList.add(...eleClasses) }
    if ( eventFunction.length > 0 ) {
        for (let i = 0; i < eventFunction.length; i++) {
            newEle.addEventListener( eventFunction[i][0], eventFunction[i][1] );
        }
    }
    if ( setAttrubutes.length > 0 ) {
        for (let i = 0; i < setAttrubutes.length; i++) {
            newEle.setAttribute( setAttrubutes[i][0], setAttrubutes[i][1] );
        }
    }
    if ( setInnerHTML !== "//invalid") {
        newEle.innerHTML = setInnerHTML;
    }

    switch(methodTarget[0]) {
        case "body.append":
            document.body.append(newEle);
            break;
        case "id.append":
            document.getElementById(methodTarget[1]).append(newEle);
            break;
        case "id.prepend":
            document.getElementById(methodTarget[1]).prepend(newEle);
            break;
        case "querySelector.append":
            document.querySelector(methodTarget[1]).append(newEle);
            break;
        case "querySelector.prepend":
            document.querySelector(methodTarget[1]).prepend(newEle);
    }
}

//////////////////////////////////////loop

$(document).ready(function () {

    //$.getScript("./js/exampleArticle.js");


	$("#scroll-drag").draggable({
        axis: "y",
        containment: "#scroll"
    });

    //loop();
    //setInterval("loop()",10);
});

function loop() {
    //console.log( getTime() );
}

//////////////////////////////////////custom thumb & scrollable relates

$(document).ready(function () {
    const resizeObserver = new ResizeObserver( entries => 
        updateWhenLRS()
        //console.log("Height of this element changed: ", entries[0].target.clientHeight )
    );
    //
    resizeObserver.observe( document.body );

    let observerOptions = {
        rootMargin: '0px',
        threshold: 0.5
    }
    var observer = new IntersectionObserver(observerCallback, observerOptions);
    function observerCallback(entries, observer) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
              console.log( testLog );
            }
        });
    };
    let target = '.entryWrapper';
    document.querySelectorAll(target).forEach((i) => {
        if (i) {
            observer.observe(i);
        }
    });

    //galleryEntryObserver.observe( document.querySelectorAll(".galleryEntry>div.entryWrapper") );
});

$(window).on( "load", function() {
    let isPostPage = document.getElementsByClassName("post-title");
    if (isPostPage.length > 0) {
        newPageTitle = document.getElementsByClassName("post-title")[0]["innerText"];
        document.title = newPageTitle + "- NUOUO";
    };
});

//$(document).ready(function () {
//    function changePageTitle() {
//        newPageTitle = "f";
//        document.title = newPageTitle;
//    };
//});

var thumb_height = $(":root").css("--height-thumb").replace("px", "");
var header_height = $(":root").css("--height-header").replace("px", "");
//
var scroll_top;//how much in pixel its scrolled. 0 when at top.
var win_height;//height of the user window viewport.
var page_height;//height of the full page content.
var scroll_percent;//how much it scrolled in %.
var scroll_length;//height of the scroll bar. vh - #main_page_header h
//
$(window).on("load scroll", updateWhenLRS);
//
function updateWhenLRS() {
    scroll_top = document.documentElement.scrollTop;
    win_height = window.innerHeight;
    page_height = document.documentElement.scrollHeight;
    scroll_percent = expectFloat(scroll_top / (page_height - win_height), 1, 0.005);
    scroll_length = win_height - header_height + 50;//raise 50px
    $("#scroll").css("height", scroll_length + "px");

    //set thumb height from result
    //let output = document.getElementById("scroll-thumb").style.marginTop = (scroll_length - thumb_height) * scroll_percent;
    let output = (scroll_length - thumb_height) * scroll_percent;
    if ( isNaN(output) ) {
        output = 0;//lock thumb at top when scroll is unavailable
        $("#scroll-drag").draggable({disabled:true});
    } else {
        $("#scroll-drag").draggable({disabled:false});
    };

    //scroll viewport when drag box is dragging
    $("#scroll-drag").draggable({ 
        drag: function() {
            let whenDrag = ($("#scroll-drag").css("top")).replace("px","") * (page_height - win_height) / (scroll_length - thumb_height);
            window.scrollTo(0, whenDrag);
        },
        stop: function() {
            $("#scroll-drag").css({ "left": 0});//horizontal align drag box to thumb
        }
    });

    //set final thumb height
    //document.getElementById("scroll-thumb").style.marginTop = output + "px";
    $("#scroll-thumb").css({ "margin-top": output + "px"});

    //vertical align drag box to thumb
    $("#scroll-thumbparts").on("mouseenter", function () {
        $("#scroll-drag:not(.ui-draggable-dragging)").css({ "top": output + "px"});
    });

    //set me body height
    var mebody_height;
    var remain_height = page_height - (win_height + scroll_top);
    var end = win_height - output;
    if ( remain_height < 71 ) {
        mebody_height = win_height - 350 - output - 70 + remain_height + 12 + 1;
        if ( mebody_height < 21 ) {mebody_height = 20};
    } else {
        //mebody_height = remain_height + 83;
        mebody_height = end;//50px footer, 20px raised?

        //if ( remain_height < 50) { mebody_height = 0};
    };
    $(":root").css("--height-mebody", mebody_height + "px");

    //contact-icon pop
    var contact_icon_bottom;
    if (remain_height < 50) {
        contact_icon_bottom = 50 - remain_height;
    } else {
        contact_icon_bottom = 0;
    };
    $("#contact-icon").css("bottom", contact_icon_bottom + "px");

    //console.log( getTime());
    //console.log( "[end]" + Math.trunc(end) + " [remain_height]" + Math.trunc(remain_height) + " [neck]" + Math.trunc(mebody_height) + " [win_height]" + win_height + " [output]" + Math.trunc(output) )
};

//////////////////////////////////////temporary turn off scroll smooth when dragging me
function offScrollSmooth() {
    document.documentElement.style.scrollBehavior = "auto";
    console.log("0");
}
function onScrollSmooth() {
    document.documentElement.style.scrollBehavior = "smooth";
    console.log("1");
}


/*
var curXPos = 0, curYPos = 0, curDown = false;
$(window).mousemove( function(m) {
    curDown = true;
    curYPos = m.pageY;
    curXPos = m.pageX;
});
$("#lb_thumbScroll").mouseup( function() {
    curDown = false;
});
$("#lb_thumbScroll").mousemove( function(m) {
    if (curDown === true) {
        $("#lb_thumbScroll").scrollTop( $("#lb_thumbScroll").scrollTop() + (curYPos - m.pageY) );
        $("#lb_thumbScroll").scrollLeft( $("#lb_thumbScroll").scrollLeft() + (curXPos - m.pageX) );
    }
});

$(window).mousemove( function() {
    console.log("[0]" + curDown + "  [1]" + curXPos + "  [2]" + curYPos);
});
*/



//////////////////////////////////////

$(window).on( "load", function() {
    document.getElementById("testBtn").addEventListener( "click", testThis );
});

function testThis() {
    //console.log( document.getElementById("lb_frame").naturalWidth + "    " + document.getElementById("lb_frame").naturalHeight );
    //console.log(entriesAll);
    //console.log(seriesAll);
    console.log( document.getElementsByClassName("post-title") );
}