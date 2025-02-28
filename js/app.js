/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/
// NameSpace - glue all definitions to a long, unique object identifier
// this is only viable as long as no this for an instance related behaviour is needed - ES6 style arrow functions
// are not meant to be methods ( source MDN ) 

// Nobody wants to type that more than twice, shortcut: n

let liFragment = document.createDocumentFragment();
let currentActiveLink = "";
let prevActiveLink = "";
let scrollFlag = null;
let scrollFlagSlow = null;
let pageTop = document.getElementById("page_top");
let navTop = document.getElementById("nav_top");
let sectionParent = document.querySelector("main");
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

const getNavListParent = () => {
  return document.getElementById("navbar__list");
}

//debug 
const logData = (data) => { console.log(" Out: " + data); }

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/
// build the nav

const getSections = () => {
  let _sectionList = document.querySelectorAll("Section");
  let sectionElementList = [];
  for (let _liElement of _sectionList) {
    sectionElementList.push(_liElement);
  }
  return sectionElementList;
};


// this method works by appending the created nav elements to namespace wide defined liFragment 
// also: create collapsible control objects  arrowdown 25BC  arrowright 25BA

const mkNav = (sectionElement) => {
  // some scroll magic adhered to all sections 
  // https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type
  sectionElement.classList.add("snap__align");
  let _tempLi = document.createElement("li");
  let _tempName = document.createTextNode(" " + sectionElement.dataset.nav + " ");
  _tempLi.append(_tempName);
  _tempLi.id = "li__" + sectionElement.id;
  // let's store the reference to the originator for later use:
  _tempLi.dataset.ref = sectionElement.id;
  _tempLi.classList.add("menu__link", "unselectable");
  liFragment.appendChild(_tempLi);
  // let _tempSpan = document.createElement("span");
  // _tempSpan.id = "co__" + sectionElement.id;
  // _tempSpan.dataset.ref = sectionElement.id;
  // _tempSpan.append(document.createTextNode("\u25BA"));
  // _tempSpan.classList.add("arrows", "unselectable");
  // let _childElement = document.querySelector("#" + sectionElement.id + " .landing__container h2");
  // document.querySelector("#" + sectionElement.id + " .landing__container")
  //   .insertBefore(_tempSpan, document.querySelector("#" + sectionElement.id + " .landing__container>h2"));
}


// when most of the content we need is loaded start the menu build
window.addEventListener('DOMContentLoaded', (e) => {
  // getSections returns an array of DOM Elements - mkNav is called on all of them to produce html nodes
  getSections().forEach(mkNav);
  // move the fragment into the DOM
  getNavListParent().appendChild(liFragment);

  // using one handle to scroll to element.id via dataset ref as parameter handshake
  // toggling state vars prevActiveLink and currentActiveLink 
  getNavListParent().addEventListener("click", (e) => {
    e.preventDefault();
    //console.log(" id : " + e.target.id);
    if (e.target.dataset.ref != null) {
      prevActiveLink = currentActiveLink;
      currentActiveLink = e.target.id;
      if (!e.target.classList.contains("nav__active__class")) {
        e.target.classList.add("nav__active__class");
      }
      // prev + clicked id need to be different to not re-delete same active link clicked twice
      if (prevActiveLink && (prevActiveLink != e.target.id)) {
        document.getElementById(prevActiveLink).classList.remove("nav__active__class");
      }
      const originatorID = e.target.dataset.ref;
      const origElement = document.getElementById(originatorID);
      origElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    } else { return; }
    //console.log('Target of event in navi : ' + e.target.dataset.ref);
  });
});


// Add class 'active' to section when near top of viewport
//  this eventListener needs to be aware scrolling / halting and interruptive scrolling
// the setTimeout placeholder is undefined at loading time and "pushes" its timer forward while
// the event keeps fireing


window.addEventListener("scroll", function (e) {
  e.preventDefault();
  if (scrollFlag !== null) {
    clearTimeout(scrollFlag);
  }
  if (scrollFlagSlow !== null) {
    clearTimeout(scrollFlagSlow);
  }
  pageTop.classList.remove("page__header__scrolling");
  navTop.classList.remove("nav__header__scrolling");
  scrollFlagSlow = setTimeout(function () {
    navTop.classList.add("nav__header__scrolling");
    pageTop.classList.add("page__header__scrolling");
  }, 500);
  //must be calculated ongoingly
  let viewportY = window.innerHeight;
  scrollFlag = setTimeout(function () {

    getSections().forEach(
      function (sectionElement) {
        let yDistance = sectionElement.getBoundingClientRect().y;
        // Set sections as active in nav
        if (yDistance > - 125 && yDistance < viewportY / 2) {
          sectionElement.classList.add("active__section");
          document.getElementById("li__" + sectionElement.id).classList.add("nav__active__class");
        } else {
          sectionElement.classList.remove("active__section");
          document.getElementById("li__" + sectionElement.id).classList.remove("nav__active__class");
        }
      }
    );
  }, 10);
}, false);

// on hovering the menu let it reappear

pageTop.addEventListener("mouseover", function (e) {
  e.preventDefault();
  pageTop.classList.remove("page__header__scrolling");
  navTop.classList.remove("nav__header__scrolling");
}, true);
pageTop.addEventListener("mouseout", function (e) {
  pageTop.classList.add("page__header__scrolling");
  navTop.classList.add("nav__header__scrolling");
}, true);

// collapsible
// basic solution
// document.querySelectorAll( "#" + "section2" + " .landing__container p").forEach( (element) => { element.style.display = "block" });
