class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        this.list = document.getElementById("list");
        this.newTask = document.getElementById("newTask");
        this.newDate = document.getElementById("newDate");
        this.addBtn = document.getElementById("addBtn");
        this.search = document.getElementById("search");
        this.term = "";

        this.addBtn.onclick = () => this.addTask();
        this.search.oninput = () => this.searchTasks();

        this.draw();
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    addTask() {
        let text = this.newTask.value.trim();
        let date = this.newDate.value;

        if (text.length < 3) {
            alert("Za krótki tekst!");
            return;
        }

        if (date && new Date(date) < new Date().setHours(0,0,0,0)) {
            alert("Data musi być dzisiejsza lub w przyszłości!");
            return;
        }

        this.tasks.push({ text: text, date: date || null });
        this.save();
        this.newTask.value = "";
        this.newDate.value = "";
        this.draw();
    }


    deleteTask(i) {
        this.tasks.splice(i, 1);
        this.save();
        this.draw();
    }

    editTask(i, li) {
        if (li.querySelector(".edit-box")) return;

        let t = this.tasks[i];

        let box = document.createElement("div");
        box.className = "edit-box";

        let inputText = document.createElement("input");
        inputText.type = "text";
        inputText.value = t.text;

        let inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.value = t.date || "";

        box.appendChild(document.createTextNode("Nazwa: "));
        box.appendChild(inputText);
        box.appendChild(document.createElement("br"));
        box.appendChild(document.createTextNode("Data: "));
        box.appendChild(inputDate);

        li.appendChild(box);

        const saveChanges = (e) => {
            if (!box.contains(e.target)) {
                let newText = inputText.value.trim();
                let newDate = inputDate.value;

                if (newText.length < 3) {
                    alert("Za krótki tekst!");
                    return;
                }

                t.text = newText;
                t.date = newDate ? newDate : null;
                this.save();
                this.draw();

                document.removeEventListener("click", saveChanges);
            }
        };

        setTimeout(() => {
            document.addEventListener("click", saveChanges);
        }, 0);

        inputText.focus();
    }


    searchTasks() {
        this.term = this.search.value.toLowerCase();

        if (this.term.length < 2) {
            this.term = "";
        }

        this.draw();
    }


    draw() {
        this.list.innerHTML = "";

        let filtered = this.tasks.filter(t => t.text.toLowerCase().includes(this.term));

        for (let i = 0; i < filtered.length; i++) {
            let t = filtered[i];
            let li = document.createElement("li");

            let txt = t.text;
            if (this.term) {
                let reg = new RegExp("(" + this.term + ")", "gi");
                txt = txt.replace(reg, "<span class='highlight'>$1</span>");
            }

            li.innerHTML = txt + (t.date ? " (" + t.date + ")" : "");

            let delBtn = document.createElement("button");
            delBtn.innerText = "Usuń";
            delBtn.onclick = () => this.deleteTask(this.tasks.indexOf(t));

            li.onclick = (e) => {
                if (e.target.tagName !== "BUTTON") {
                    this.editTask(this.tasks.indexOf(t), li);
                }
            };

            li.appendChild(delBtn);
            this.list.appendChild(li);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new Todo();
});
