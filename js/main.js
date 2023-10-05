
// Get the element you want to display in full-screen mode
let element = document.documentElement;  // This is for the full page

// Use the appropriate vendor-prefixed method
if (element.requestFullscreen) {
    element.requestFullscreen();
} else if (element.webkitRequestFullscreen) {   /* Safari */
    element.webkitRequestFullscreen();
} else if (element.msRequestFullscreen) {  /* IE11 */
    element.msRequestFullscreen();
}