import { uploadFile, downloadFile} from "./mega.js"

//navbar
const rightNavContent = document.getElementById("right-nav-content");
const bar = document.getElementById("bar");
const barBtn = document.getElementById("bar-btn");
const check_size = () =>{
    if(window.innerWidth<850){
        bar.classList.remove("invisible");
        rightNavContent.classList.add("invisible");
        barBtn.onclick=()=>{
            if(rightNavContent.classList.contains("invisible")){
                rightNavContent.classList.remove("invisible");
                rightNavContent.classList.add("collapsed")
            }else{
                rightNavContent.classList.remove("collapsed");
                rightNavContent.classList.add("invisible");
            }
        }
    }else{
        bar.classList.add("invisible");
        rightNavContent.classList.remove("invisible");
        rightNavContent.classList.remove("collapsed")
    }
}
window.addEventListener("resize", function(){
    check_size();
})
check_size();



const homeBtn = document.getElementById("nav-home");
homeBtn.onclick=()=>{
    window.location.href='home.html';
}


const userBtn = document.getElementById("nav-user");
userBtn.onclick=()=>{
    window.location.href='user.html';
}


const logoutBtn = document.getElementById("nav-logout");
logoutBtn.onclick=()=>{
    sessionStorage.setItem("utente",null);
    window.location.href="login.html";
}



//check user logged

const user = JSON.parse(sessionStorage.getItem("utente"));

//modal new viaggio
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");
const openModal_btn = document.getElementById("openModal");
const close_btn = document.getElementById("close_btn");

let isOpened = false;

const openModal = () => {
  modal.classList.add("is-open");
};

const closeModal = () => {
  modal.classList.remove("is-open");
};



openModal_btn.onclick=()=>{
    openModal();
}
close_btn.onclick=()=>{
    closeModal();
}

//add viaggio
const newViaggio = document.getElementById("newViaggio_btn");
const titoloInput = document.getElementById("titolo_viaggio_input");
const descrInput = document.getElementById("descrizione_viaggio_input");
const immInput = document.getElementById("immagine_viaggio_input");

const titoloErr = document.getElementById("titolo_error");
const descrErr = document.getElementById("descrizione_error");
const immErr = document.getElementById("immagine_error");

const time = 3000;

const travelContentDiv = document.getElementById("travel-content");

const travelTemplate = `
<div class="travel" id="travel-%id">
    <div class="image-space">
        <img src="%VIAGGIO">
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            <img src="%PROFILO" id="user-foto">
            <p>%utente</p>
        </div>
    </div>
</div>
`
const render = (viaggi, utenti) => {
    travelContentDiv.innerHTML="";
    viaggi.result.forEach(async(travel)=>{
        const utente = utenti.result.find(u => u.id === travel.id_utente);
        const srcViaggio = await downloadFile(travel.immagine);
        const srcProfilo = await downloadFile(utente.foto);
        travelContentDiv.innerHTML+=travelTemplate.replace("%nome",travel.titolo).replace("%utente",utente.username).replace("%VIAGGIO", srcViaggio).replace("%PROFILO", srcProfilo)
    })

    const travels = document.querySelectorAll(".travel");
    travels.forEach((travel)=>{
        travel.onclick=()=>{

        }
    })
}

const getViaggi = async () => {
    try{
        const r = await fetch("/getViaggi");
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    } 
}

const getUtenti = async () => {
    try{
        const r = await fetch("/get_users");
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    } 
}
const saveViaggio = async (data) => {
    try{
        const r = await fetch("/addViaggio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({data})
        });
        const result = await r.json();
        return result;
    } catch (e) {
        console.log(e);
    }
};

const formAdd = document.getElementById("formAdd");

newViaggio.onclick= async()=>{
    const titolo = titoloInput.value;

    if(!titolo){
        titoloErr.classList.remove("invisible");
        setTimeout(()=>{
            titoloErr.classList.add("invisible");
        },time)
    }

    const descrizione = descrInput.value;
    if(!descrizione){
        descrErr.classList.remove("invisible");
        setTimeout(()=>{
            descrErr.classList.add("invisible");
        },time)
    }

    const immagine = immInput.value;
    // aggiunta dell'immagine
    const fileImg = await uploadFile(immInput); //contiente il path e il link
    const link = fileImg.link;
  
    if(!immagine){
        immErr.classList.remove("invisible");
        setTimeout(()=>{
            immErr.classList.add("invisible");
        },time)
    };
    
    if(titolo && descrizione && immagine){
        const id_utente = user.id;
        const viaggio = {
            titolo: titolo,
            descrizione: descrizione,
            immagine: link,
            id_utente: id_utente
        }
    
        saveViaggio(viaggio).then(async()=>{
            formAdd.reset();
            const viaggi = await getViaggi();
            const utenti = await getUtenti();
            render(viaggi,utenti);
        })
    }
}



const viaggi = await getViaggi();
const utenti = await getUtenti();
console.log(utenti);
render(viaggi, utenti);