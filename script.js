const editIcon = `<i class="fas fa-edit"></i>`;
const deleteIcon = `<i class="fas fa-trash"></i>`;

function plotHistogram() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: date,
            datasets: [{
                label: 'Water Intake (ml)',
                data: water,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Exercise Duration (min)',
                data: exercise,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'Calories Intake (Kcal)',
                data: bloodsugar,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function toggleGraphType() {
    const myChart = document.getElementById('myChart');
    if (myChart.style.display === 'none') {
        myChart.style.display = 'block';
        plotHistogram(); // Plot histogram when showing
    } else {
        myChart.style.display = 'none';
    }
}

function clearInputs() {
    wInput.value = ""
    eInput.value = ""
    bInput.value = ""
}

function addToLocalStorage() {
    localStorage.setItem("date", JSON.stringify(date))
    localStorage.setItem("water", JSON.stringify(water))
    localStorage.setItem("exercise", JSON.stringify(exercise))
    localStorage.setItem("bloodsugar", JSON.stringify(bloodsugar))
}

function activateEdit(i) {
    wInput.value = water[i]
    eInput.value = exercise[i]
    bInput.value = bloodsugar[i]
    editIndex = i
    submitButton.classList.add("hidden")
    editSection.classList.remove("hidden")
}

function cancelEdit() {
    clearInputs()
    editIndex = -1
    submitButton.classList.remove("hidden")
    editSection.classList.add("hidden")
}

function editRow() {
    if (editIndex == -1) return
    water[editIndex] = wInput.value
    exercise[editIndex] = eInput.value
    bloodsugar[editIndex] = bInput.value
    fillTable()
    addToLocalStorage()
    cancelEdit()
}

function deleteRow(i) {
    if (!confirm(`Confirm that you want to delete the entry: \n ${date[i]}: ${water[i]}ml, ${exercise[i]}min, ${bloodsugar[i]}mg/dL`))
        return
    date.splice(i, 1)
    water.splice(i, 1)
    exercise.splice(i, 1)
    bloodsugar.splice(i, 1)
    document.querySelector(`#output > tr:nth-child(${i+1})`)
        .classList.add("delete-animation")
    addToLocalStorage()
    setTimeout(fillTable, 500)
}

function fillTable() {
    const tbody = document.getElementById("output")
    const rows =
        Math.max(water.length, exercise.length, bloodsugar.length)
    let html = ""
    for (let i = 0; i < rows; i++) {
        let w = water[i] || "N/A"
        let e = exercise[i] || "N/A"
        let b = bloodsugar[i] || "N/A"
        let d = date[i] || "N/A"
        html += `<tr> 
            <td>${d}</td> 
            <td>${w}</td> 
            <td>${e}</td> 
            <td>${b}</td> 
            <td> 
                <button onclick="activateEdit(${i})"
                        class="edit">${editIcon} 
                </button> 
            </td> 
            <td> 
                <button 
                    onclick="deleteRow(${i})"
                    class="delete">${deleteIcon} 
                </button> 
            </td> 
        </tr>`
    }
    tbody.innerHTML = html;
}

let editIndex = -1;

let date =
    JSON.parse(localStorage.getItem("date")) || []
let water =
    JSON.parse(localStorage.getItem("water")) || []
let exercise =
    JSON.parse(localStorage.getItem("exercise")) || []
let bloodsugar =
    JSON.parse(localStorage.getItem("bloodsugar")) || []

const wInput = document.getElementById("water")
const eInput = document.getElementById("exercise")
const bInput = document.getElementById("bloodsugerlevel")

const submitButton = document.getElementById("submit")
const editSection = document.getElementById("editSection")

fillTable()

submitButton.addEventListener("click", () => {
    const w = wInput.value || null;
    const e = eInput.value || null;
    const b = bInput.value || null;
    if (w === null || e === null || b === null) {
        alert("Please enter all the fields.")
        return
    }
    const d = new Date().toLocaleDateString()
    date = [d, ...date]
    water = [w, ...water]
    exercise = [e, ...exercise]
    bloodsugar = [b, ...bloodsugar]
    clearInputs()
    fillTable()
    addToLocalStorage()
})
document.getElementById('toggleGraph').addEventListener('click', toggleGraphType);
