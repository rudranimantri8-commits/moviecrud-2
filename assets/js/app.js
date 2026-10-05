
const cl = console.log;
const form = document.getElementById("form");
const movieinput = document.getElementById("movieinput");
const moviedescriptioninput = document.getElementById("moviedescriptioninput");
const movieratinginput = document.getElementById("movieRating");
const movieimageinput = document.getElementById("movieimageinput");
const movieYearInput = document.getElementById("movieYearInput");
const addMovieBtn = document.getElementById("addMovieBtn");
const addmoviebtn = document.getElementById("addmoviebtn");
const updatemoviebtn = document.getElementById("updatemoviebtn");
const movieFormContainer = document.getElementById("movieFormContainer");
const movieContainer = document.getElementById("movieContainer");
const spinner = document.getElementById("spinner");
const closemoviebtn = document.getElementById("closemoviebtn");
const closeIcon = document.getElementById("closeIcon");

const BASE_URL = `https://crud-post-5e4d9-default-rtdb.firebaseio.com`;
const MOVIE_URL = `${BASE_URL}/moviescrud.json`;

let state = {
 movieArray: [],
 movieEditId: null
};

// function onToggle() {
// form.classList.toggle('active');
// backDrop.classList.toggle('active');
// movieForm.reset();
// updatemoviebtn.classList.add('d-none');
// }

function resetForm() {
 form.reset();
 updatemoviebtn.classList.add('d-none');
 addMovieBtn.classList.remove('d-none');
 document.querySelector('.card-header h3').innerText = 'Add Movie';
}

function handleSpinner(flag) {
 if (flag) {
 spinner.classList.remove("d-none");
 } else {
 spinner.classList.add("d-none");
 }
}

function snackBar(msg, icon) {
 Swal.fire({
 text: msg,
 icon: icon,
 timer: 2000,
 showConfirmButton: false
 });
}

function toggleForm() {
 movieFormContainer.classList.toggle("d-none");
 form.reset();
 closemoviebtn.classList.add("d-none")
 addMovieBtn.classList.remove("d-none");
 updatemoviebtn.classList.add("d-none");
 state.movieEditId = null;
}

function makeApiCall(url, methodName, body) {
 let data = body ? JSON.stringify(body) : null;
 return fetch(url, {
 method: methodName,
 body: data,
 headers: {
 "content-type": "application/json"
 }
 })
 .then(res => {
 if (!res.ok) {
 throw new Error("API Error");
 }
 return res.json();
 });
}


function movieRating(rating) {
rating = Number(rating);
 if (rating >= 4) {
 return "badge badge-success";
 }
 else if (rating >= 3) {
 return "badge badge-warning";
 }
 else {
 return "badge badge-danger";
 }
}


function onCreateMovieCard(eve) {
eve.preventDefault();
 if (
 movieinput.value.trim() === "" ||
 moviedescriptioninput.value.trim() === "" ||
 movieratinginput.value.trim() === "" ||
 movieimageinput.value.trim() === "" ||
 movieYearInput.value.trim() === ""
)
 {
 snackBar("Please fill all fields", "warning");
 return;
 }
 let movieObj = {
 name: movieinput.value,
 description: moviedescriptioninput.value,
 rating: movieRatinginputValue(),
 image: movieimageinput.value,
 year: movieYearInput.value
 };
 cl(movieObj);
 handleSpinner(true);
 makeApiCall(MOVIE_URL, "POST", movieObj)
 .then(res => {
 movieObj.id = res.name;
 state.movieArray.unshift(movieObj);
 templatingMovieCards(state.movieArray);
 form.reset();
 movieFormContainer.classList.add("d-none");
 handleSpinner(false);
 snackBar("Movie Added Successfully", "success");
 })
 .catch(err => {
 cl(err);
 handleSpinner(false);
 snackBar("Unable to add movie", "error");
 });
}


function movieRatinginputValue() {
 return Number(movieratinginput.value);
}


function objToArr(res) {
 state.movieArray = [];
 if (!res) {
 return;
 }
 for (let key in res) {
 res[key].id = key;
 state.movieArray.unshift(res[key]);
 }
}


function fetchMovieCard() {
 handleSpinner(true);
 makeApiCall(MOVIE_URL, "GET")
 .then(res => {
 objToArr(res);
 templatingMovieCards(state.movieArray);
 handleSpinner(false);
 })
 .catch(err => {
 cl(err);
 handleSpinner(false);
 snackBar("Unable to fetch movies", "error");
 });
}


function templatingMovieCards(arr) {
 let result = "";
 arr.forEach(mov => {
 result += `
 <div class="col-md-3 mt-3" id="${mov.id}">
 <div class="card movieCard h-100">
 <div class="card-header">
 <div class="row">
 <div class="col-8">
 <h5>${mov.name}</h5>
 </div>
 <div class="col-4 text-right">
 <span class="text-center p-2 ${movieRating(mov.rating)}">
 ${mov.rating}
 </span>
 </div>
 </div>
 </div>
 <div class="card-body">
 <figure>
 <img
 src="${mov.image}"
 alt="${mov.name}"
 class="img-fluid"
 >
 <figcaption>
 <p>
 ${mov.description}
 </p>
 <p>
 <strong>Year:</strong> ${mov.year}
 </p>
 </figcaption>
 </figure>
 </div>
 <div class="card-footer d-flex justify-content-between">
 <button
 type="button"
 onclick="onEditMovie(this)"
 class="btn btn-sm btn-primary"
 >
 Edit
 </button>
 <button
 type="button"
 onclick="onDeleteMovie(this)"
 class="btn btn-sm btn-danger"
 >
 Remove
 </button>
 </div>
 </div>
 </div>
 `;
 });
 movieContainer.innerHTML = result;
}


function onEditMovie(ele) {
 let editId = ele.closest(".col-md-3").id;
 state.movieEditId = editId;
 const EDIT_URL = `${BASE_URL}/moviescrud/${editId}.json`;
 handleSpinner(true);
 makeApiCall(EDIT_URL, "GET")
 .then(res => {
 movieFormContainer.classList.remove("d-none");
 movieinput.value = res.name;
 moviedescriptioninput.value = res.description;
 movieratinginput.value = res.rating;
 movieimageinput.value = res.image;
 movieYearInput.value = res.year;
 addmoviebtn.classList.add("d-none");
 updatemoviebtn.classList.remove("d-none");
 handleSpinner(false);
 })
 .catch(err => {
 cl(err);
 handleSpinner(false);
 snackBar("Unable to edit movie", "error");
 });
}


function onUpdateMovieCard() {
 let updateId = state.movieEditId;
 if (!updateId) {
 return;
 }
 let updateMovieObj = {
 name: movieinput.value,
 description: moviedescriptioninput.value,
 rating: Number(movieratinginput.value),
 image: movieimageinput.value,
 year: movieYearInput.value,
 id: updateId
 };
 const UPDATE_URL = `${BASE_URL}/moviescrud/${updateId}.json`;
 handleSpinner(true);
 makeApiCall(UPDATE_URL, "PATCH", updateMovieObj)
 .then(res => {
 let findIndex = state.movieArray.findIndex(
mov => mov.id === updateId
 );
 state.movieArray[findIndex] = updateMovieObj;
 templatingMovieCards(state.movieArray);
 form.reset();
 movieFormContainer.classList.add("d-none");
 addmoviebtn.classList.remove("d-none");
 updatemoviebtn.classList.add("d-none");
 state.movieEditId = null;
 handleSpinner(false);
 snackBar("Movie Updated Successfully", "success");
 })
 .catch(err => {
 cl(err);
 handleSpinner(false);
 snackBar("Unable to update movie", "error");
 });
}


function onDeleteMovie(ele) {
 let deleteId = ele.closest(".col-md-3").id;
 Swal.fire({
 title: "Are you sure?",
 text: "You want to delete this movie?",
 icon: "warning",
 showCancelButton: true,
 confirmButtonText: "Yes, Delete",
 cancelButtonText: "Cancel"
 })
 .then(result => {
 if (result.isConfirmed) {
 handleSpinner(true);
 const DELETE_URL =
 `${BASE_URL}/moviescrud/${deleteId}.json`;
 makeApiCall(DELETE_URL, "DELETE")
 .then(res => {
 let findIndex =
 state.movieArray.findIndex(
mov => mov.id === deleteId
 );
 state.movieArray.splice(findIndex, 1);
 templatingMovieCards(state.movieArray);
 handleSpinner(false);
 snackBar(
 "Movie Deleted Successfully",
 "success"
 );
 })
 .catch(err => {
 cl(err);
 handleSpinner(false);
 snackBar(
 "Unable to delete movie",
 "error"
 );
 });
 }
 });
}

addMovieBtn.addEventListener("click", function () {
 movieFormContainer.classList.toggle("d-none");
 form.reset();
 addmoviebtn.classList.remove("d-none");
 updatemoviebtn.classList.add("d-none");
 state.movieEditId = null;
});

form.addEventListener("submit", onCreateMovieCard);

updatemoviebtn.addEventListener(
 "click",
 onUpdateMovieCard
);

function closeForm() {
 form.reset();
 movieFormContainer.classList.add("d-none");
 addmoviebtn.classList.remove("d-none");
 updatemoviebtn.classList.add("d-none");
 state.movieEditId = null;
}

closemoviebtn.addEventListener("click", closeForm);

closeIcon.addEventListener("click", closeForm);

movieFormContainer.addEventListener("click", function (eve) {
 if (!eve.target.closest(".card")) {
 closeForm();
 }
});

fetchMovieCard();