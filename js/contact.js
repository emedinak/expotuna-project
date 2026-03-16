const form = document.getElementById("contact-form");
const message = document.getElementById("form-message");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

const button = form.querySelector("button");
button.innerText = "Sending...";
button.disabled = true;

const data = new FormData(form);

try{

const response = await fetch(form.action,{
method:"POST",
body:data,
headers:{
'Accept':'application/json'
}
});

if(response.ok){

form.reset();
message.style.display = "block";

button.innerText = "Send Message";
button.disabled = false;

}

}catch(error){

button.innerText = "Send Message";
button.disabled = false;

}

});

}

