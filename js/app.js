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
var LandingPage_nameSpace = {};
// Nobody wants to type that more than twice, shortcut: n
let n = LandingPage_nameSpace;
//n.activeElement = "dom object";
n.liFragment = document.createDocumentFragment();
// console.log(" Fragment :" + n.liFragment + "\n");

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

n.getNavListParent = function () {
  return document.getElementById("navbar__list");
}

//console.log(" element: " + n.getNavListParent() );

n.logData = function (data) { console.log(" Out: " + data); }

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/
// build the nav

n.getSections = function () {
  let _sectionList = document.querySelectorAll("Section");
  let sectionElementList = [];
  for (let _liElement of _sectionList) {
    sectionElementList.push(_liElement);
  }
  return sectionElementList;
}();

n.removeActiveSectionClasses = function () {
  const _objectList = document.querySelectorAll("section");
  _objectList.forEach(function (element) { element.classList.remove("your-active-class"); })
}

// this method works by appending the created nav elements to namespace wide defined liFragment 
n.mkNav = function (sectionElement) {
  let _tempLi = document.createElement("li");
  let _tempName = document.createTextNode(" " + sectionElement.dataset.nav + " ");
  _tempLi.append(_tempName);
  // let's store the reference to the originator for later use:
  _tempLi.dataset.ref = sectionElement.id;
  _tempLi.classList.add("menu__link");
  n.liFragment.appendChild(_tempLi);
}
// getSections returns an array of DOM Elements - mkNav is called on all of them to produce html nodes
n.getSections.forEach(n.mkNav);
// move the fragment into the DOM
n.getNavListParent().appendChild(n.liFragment);

// using one handle to scroll to element.id via dataset ref as parameter handshake

n.getNavListParent().addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.dataset.ref != null) {
    const originatorID = e.target.dataset.ref;
    const origElement = document.getElementById(originatorID);
    origElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  } else { return; }
  //console.log('Target of event in navi : ' + e.target.dataset.ref);
});


// Add class 'active' to section when near top of viewport

n.scrollFlag = null;
window.addEventListener('scroll', function (e) {
  if (n.scrollFlag !== null) {
    clearTimeout(n.scrollFlag);
  }
  n.scrollFlag = setTimeout(function () {
    n.getSections.forEach(
      function (sectionElement) {
        const yDistance = sectionElement.getBoundingClientRect().y;
        if (yDistance > -100 && yDistance < 150) {
          /* console.log("close: " + sectionElement.id); */
          sectionElement.classList.add('active__section');
        } else {
          sectionElement.classList.remove('active__section');
        }
      }
    );
  }, 100);
}, false);



/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu 

// Scroll to section on link click

// Set sections as active