let title = document.querySelector(".title")

let note = document.querySelector(".note")

let addBtn = document.querySelector(".btn")

let pinnedNote = document.querySelector(".showPinnedNote");

let otherNote = document.querySelector(".showOtherNotes")

let otherHeader = document.querySelector(".otherNote")

let pinnedHeader = document.querySelector(".pinnedNote");

let arrayOfNotes = JSON.parse(localStorage.getItem("notes")) || []

let noteContainer = document.querySelector(".noteContainer");

let pinContainer = document.querySelector(".showPinnedNote")

let archiveNote = document.querySelector(".archiveContainer")

const fileName = window.location.pathname.split('/').pop();


function renderPinned(arrayOfNotes){
    let tempNote = arrayOfNotes.filter(note => note.isPinned && !note.isArchived);    
    pinnedNote.innerHTML = tempNote.map(({ id, title, note })=>`
        <div class=" container parentContainer newNote mt-3 bgColor textColor boxShadow" data-key="${id}">
            <div class="container">
                <span>${title}</span>
                <button class="btn btn-danger btn-delete" data-type=delete><i class="fas fa-trash" ></i></button>
            </div>
            <p>${note}</p>
            <div>
                <button class="btn btn-success btn-pin" data-type=pin><i class="fa-solid fa-thumbtack"></i></button>
                <button class="btn btn-outline-primary btn-archive" data-type=archive><i class="fa-solid fa-box-archive" ></i></button>
            </div>
        </div>
    `).join("");
    tempNote.length>0?pinnedHeader.innerText = "Pinned Note":pinnedHeader.innerText = "";
}
function render(arrayOfNotes){
    let tempNote = arrayOfNotes.filter(item=>!item.isPinned && !item.isArchived);
    otherNote.innerHTML = tempNote.map(({ id, title, note}) => `
        <div class="container parentContainer newNote mt-3 boxShadow" data-key="${id}">
            <div class="container d-flext justify-content-between" >
                <span>${title}</span>
                <button class="btn btn-danger btn-delete" data-type=delete><i class="fas fa-trash" ></i></button>
            </div>
            <p>${note}</p>
            <div>
                <button class="btn btn-outline-primary btn-pin" data-type=pin><i class="fa-solid fa-thumbtack"></i></button>
                <button class="btn btn-outline-primary btn-archive" data-type=archive><i class="fa-solid fa-box-archive" ></i></button>
            </div>
        </div>
    `).join("")
    tempNote.length>0?otherHeader.innerText = "Other Note":otherHeader.innerText = ""
}

function renderArchive(arrayOfNotes){
    let archiveArray = arrayOfNotes.filter(item=>item.isArchived);
    archiveNote.innerHTML = archiveArray.map(({ id, title, note}) => `
        <div class=" container parentContainer newNote mt-3 boxShadow" data-key="${id}">
            <div class="container d-flext justify-content-between" >
                <span>${title}</span>
                <button class="btn btn-danger btn-delete" data-type=delete><i class="fas fa-trash" ></i></button>
            </div>
            <p>${note}</p>
            <div>
                <button class="btn btn-outline-primary btn-pin" data-type=pin><i class="fa-solid fa-thumbtack"></i></button>
                <button class="btn btn-outline-primary btn-archive" data-type=archive><i class="fa-solid fa-box-archive" ></i></button>
            </div>
        </div>
    `).join("")
    localStorage.setItem("archive",JSON.stringify(arrayOfNotes));
    localStorage.setItem("notes",JSON.stringify(arrayOfNotes))
}


if(fileName=="index.html"){
    if(arrayOfNotes.length>0){
        render(arrayOfNotes);
        renderPinned(arrayOfNotes);
    }

    addBtn.addEventListener("click",(event)=>{
        event.preventDefault()
        if(note.value || title.value){
            arrayOfNotes = [...arrayOfNotes,{id:Date.now(),title:title.value.trim(),
            note:note.value.trim(),isPinned:false,isArchived:false}]
            render(arrayOfNotes);
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes));;
        }
        console.log(arrayOfNotes)
        title.value=note.value=""
    })


    noteContainer.addEventListener("click",(event)=>{
        let type = event.target.dataset.type;
        if(type=="delete"){
            let deleteNote = event.target.closest(".parentContainer")
            console.log(event.target,deleteNote)
            renderPinned(arrayOfNotes);
            arrayOfNotes = arrayOfNotes.filter(item=>item.id!=deleteNote.dataset.key);
            render(arrayOfNotes);
            console.log(arrayOfNotes)
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes));;
        }
        if(type=="pin"){
            let pinned =  event.target.closest(".parentContainer");
            arrayOfNotes = arrayOfNotes.map(item=>item.id==pinned.dataset.key?{...item,isPinned:!item.isPinned}:item);
            console.log(arrayOfNotes)
            event.target.closest(".parentContainer").classList.toggle("bgColor");
            renderPinned(arrayOfNotes);
            render(arrayOfNotes);
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes));;
        }
        if(type=="archive"){
            let archive = event.target.closest(".parentContainer");
            arrayOfNotes = arrayOfNotes.map(item=>item.id==archive.dataset.key?{...item,isArchived:!item.isArchived}:item);
            render(arrayOfNotes);
            renderPinned(arrayOfNotes);
            localStorage.setItem("archive",JSON.stringify(arrayOfNotes));
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes))
        }
    })
}
else{
    let archiveArray = JSON.parse(localStorage.getItem("archive")) || []
    if(archiveArray.length>0)   renderArchive(archiveArray);
    archiveNote.addEventListener("click",(event)=>{
        let type = event.target.dataset.type;
        if(type=="delete"){
            let deleteNote = event.target.closest(".parentContainer")
            arrayOfNotes = arrayOfNotes.filter(item=>item.id!=deleteNote.dataset.key);
            renderArchive(arrayOfNotes);
            localStorage.setItem("archive",JSON.stringify(archiveNote))
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes))
        }
        if(type=="archive"){
            let archive = event.target.closest(".parentContainer");
            arrayOfNotes = arrayOfNotes.map(item=>item.id==archive.dataset.key?{...item,isArchived:!item.isArchived}:item);
            renderArchive(arrayOfNotes)
            localStorage.setItem("notes",JSON.stringify(arrayOfNotes))
            localStorage.setItem("archive",JSON.stringify(arrayOfNotes))
        }
    })

}

