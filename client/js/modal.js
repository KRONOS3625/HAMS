const Modal = {

    show(html) {

        document.getElementById("modalBody").innerHTML = html;

        document.getElementById("modal").style.display = "flex";

    },

    close() {

        document.getElementById("modal").style.display = "none";

    }

};

document
.getElementById("closeModal")
.addEventListener("click", Modal.close);

window.onclick = function(e){

    if(e.target.id==="modal")

        Modal.close();

};