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
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

const getNavListParent = () => {
  return document.getElementById("navbar__list");
}


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

// first concept not needed, kept for edupurp
// const removeActiveSectionClasses = () => {
//   const _objectList = document.querySelectorAll("section");
//   _objectList.forEach(function (element) { element.classList.remove("your-active-class"); })
// }

// always add the homebutton first - commented out for udacity audit
// let _homeBtn = document.createElement("li");
// let _homeSymbol = document.createTextNode(" Top ");
// _homeBtn.append(_homeSymbol);
// _homeBtn.id = "li__page_top";
// _homeBtn.classList.add("homeBtn", "unselectable");
// liFragment.appendChild(_homeBtn);

// this method works by appending the created nav elements to namespace wide defined liFragment 
const mkNav = (sectionElement) => {
  let _tempLi = document.createElement("li");
  let _tempName = document.createTextNode(" " + sectionElement.dataset.nav + " ");
  _tempLi.append(_tempName);
  _tempLi.id = "li__" + sectionElement.id;
  // let's store the reference to the originator for later use:
  _tempLi.dataset.ref = sectionElement.id;
  _tempLi.classList.add("menu__link", "unselectable");
  liFragment.appendChild(_tempLi);
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
  if (scrollFlag !== null) {
    clearTimeout(scrollFlag);
  }

  //must be calculated ongoingly
  let viewportY = window.innerHeight;
  scrollFlag = setTimeout(function () {

    getSections().forEach(
      function (sectionElement) {
        let yDistance = sectionElement.getBoundingClientRect().y;
        // Set sections as active in nav
        if (yDistance > - 150 && yDistance < viewportY / 2) {
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

