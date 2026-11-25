var currentFloor = 1;
var selectedSlot = "";
var slots = [
  { id: "F1-1", floor: 1, isOccupied: false },
  { id: "F1-2", floor: 1, isOccupied: true },
  { id: "F1-3", floor: 1, isOccupied: false },
  { id: "F1-4", floor: 1, isOccupied: false },
  { id: "F1-5", floor: 1, isOccupied: false },
  { id: "F1-6", floor: 1, isOccupied: true },
  { id: "F2-1", floor: 2, isOccupied: false },
  { id: "F2-2", floor: 2, isOccupied: false },
  { id: "F2-3", floor: 2, isOccupied: true },
  { id: "F2-4", floor: 2, isOccupied: false },
  { id: "F2-5", floor: 2, isOccupied: false },
  { id: "F2-6", floor: 2, isOccupied: false }
];

var bookings = [
  { id: "BK-101", name: "Rahul", vehicle: "DL 01 AA 1000", slot: "F1-2" },
  { id: "BK-102", name: "Priya", vehicle: "DL 02 BB 2000", slot: "F1-6" },
  { id: "BK-103", name: "Amit", vehicle: "DL 03 CC 3000", slot: "F2-3" }
];

window.onload = function() {
  renderSlots();
  updatePrice();
  updateDashboard();
};

function setFloor(floorNum) {
  currentFloor = floorNum;
  selectedSlot = "";
  document.getElementById("floor-label").innerText = "Showing: Floor " + floorNum;
  document.getElementById("selected-slot-text").innerText = "None";
  renderSlots();
}

function renderSlots() {
  var grid = document.getElementById("slot-grid");
  grid.innerHTML = "";

  for (var i = 0; i < slots.length; i++) {
    if (slots[i].floor === currentFloor) {
      var btn = document.createElement("div");
      btn.innerText = slots[i].id;

      if (slots[i].isOccupied) {
        btn.className = "slot occupied";
      } else if (selectedSlot === slots[i].id) {
        btn.className = "slot selected";
      } else {
        btn.className = "slot free";
        btn.setAttribute("onclick", "chooseSlot('" + slots[i].id + "')");
      }
      grid.appendChild(btn);
    }
  }
}

function chooseSlot(slotId) {
  selectedSlot = slotId;
  document.getElementById("selected-slot-text").innerText = slotId;
  renderSlots();
}

function updatePrice() {
  var rate = parseInt(document.getElementById("vehicle").value);
  var hrs = parseInt(document.getElementById("hours").value) || 1;
  document.getElementById("price-text").innerText = rate * hrs;
}

function bookParking() {
  if (selectedSlot === "") {
    alert("Please click an available green slot first!");
    return;
  }

  var name = document.getElementById("cust-name").value;
  var veh = document.getElementById("veh-num").value;

  if (name === "" || veh === "") {
    alert("Please enter Name and Vehicle Number!");
    return;
  }

  var bookId = "BK-" + Math.floor(100 + Math.random() * 900);

  for (var i = 0; i < slots.length; i++) {
    if (slots[i].id === selectedSlot) {
      slots[i].isOccupied = true;
      break;
    }
  }

  bookings.push({ id: bookId, name: name, vehicle: veh, slot: selectedSlot });

  document.getElementById("rec-id").innerText = bookId;
  document.getElementById("rec-name").innerText = name;
  document.getElementById("rec-veh").innerText = veh;
  document.getElementById("rec-slot").innerText = selectedSlot;
  document.getElementById("receipt").style.display = "block";

  selectedSlot = "";
  document.getElementById("selected-slot-text").innerText = "None";
  document.getElementById("cust-name").value = "";
  document.getElementById("veh-num").value = "";

  renderSlots();
  updateDashboard();
  alert("Booking Successful! ID: " + bookId);
}

function freeSlot(slotId, bookId) {
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].id === slotId) {
      slots[i].isOccupied = false;
      break;
    }
  }

  for (var j = 0; j < bookings.length; j++) {
    if (bookings[j].id === bookId) {
      bookings.splice(j, 1);
      break;
    }
  }

  renderSlots();
  updateDashboard();
}

function updateDashboard() {
  var occupiedCount = 0;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].isOccupied) {
      occupiedCount++;
    }
  }

  document.getElementById("stat-total").innerText = slots.length;
  document.getElementById("stat-occ").innerText = occupiedCount;
  document.getElementById("stat-avail").innerText = slots.length - occupiedCount;

  var tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  for (var k = 0; k < bookings.length; k++) {
    var tr = document.createElement("tr");
    tr.innerHTML = 
      "<td>" + bookings[k].id + "</td>" +
      "<td>" + bookings[k].name + "</td>" +
      "<td>" + bookings[k].vehicle + "</td>" +
      "<td>" + bookings[k].slot + "</td>" +
      "<td><button class=\"btn-danger\" onclick=\"freeSlot('" + bookings[k].slot + "','" + bookings[k].id + "')\">Exit</button></td>";
    tbody.appendChild(tr);
  }
}
