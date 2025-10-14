import { HTMLLoader } from '../core/utils/html_loader';
import { Accordion } from './accordion';
import { doSomething } from './do-something';
import { HTMLContent, itemsToCache } from './html-imports';
import { Slideshow } from './slideshow';

// Put all function calls that need to be made on every page load inside the setupAll function body.
export function PutStudentPageLoadOperationsInsideThisStudentBody() {
    // TODO: Put all operations that you want to happen on ever page load in this function.
    // For example you could write: Sticky.setup()
    doSomething();
}

export async function setupAll() {
    await new Promise((r: any) => setTimeout(r, 100));
    console.log('reloading');
    Slideshow.setupAll();
    Accordion.setupAll();
    PutStudentPageLoadOperationsInsideThisStudentBody();
    console.log('reloaded');
}

itemsToCache.forEach((item: HTMLContent) => {
    HTMLLoader.cacheHTML(item.name, item.content);
});
(window as any).HTMLLoader = HTMLLoader;

console.log('dynamic-dom loaded');
// Do not touch this line, needed to reinitialize code in the dynamic-dom.ts setupAll function
window.addEventListener('newPageLoad', () => setupAll());

window.jumpToStaff = function(targetId) {
  console.log("Button clicked, target:", targetId);
  sessionStorage.setItem("scrollTarget", targetId);

  const staffNav = document.querySelector('a[href*="staff.html"]');
  if (staffNav) {
    staffNav.click();
  } else {
    console.warn("Staff nav link not found.");
  }
}

function scrollToElement(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return false;

  console.log("Scrolling to:", targetId);
  
  el.scrollIntoView({ 
    behavior: "smooth", 
    block: "start", 
    inline: "nearest"   
  });
  
  return true;
}

function checkAndScroll() {
  const targetId = sessionStorage.getItem("scrollTarget");
  if (targetId) {
    if (scrollToElement(targetId)) {
      sessionStorage.removeItem("scrollTarget");
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (scrollToElement(targetId) || attempts > 10) {
          sessionStorage.removeItem("scrollTarget");
          clearInterval(interval);
        }
      }, 300);
    }
  }
}

window.addEventListener("DOMContentLoaded", checkAndScroll);
window.addEventListener("load", checkAndScroll);

const observer = new MutationObserver(() => {
  const targetId = sessionStorage.getItem("scrollTarget");
  if (targetId && document.getElementById(targetId)) {
    checkAndScroll();
  }
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  window.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}