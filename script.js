console.log("Script loaded successfully");

nav = document.querySelector(".navbar");
window.addEventListener("scroll", ()=>{
    console.log("scrolled");
    if(window.scrollY==0){
        nav.style.backgroundColor = "transparent";
    }
    else if(window.scrollY>0){
        nav.style.backgroundColor = "rgb(137 82 123 / 50%)";
    }
    
})