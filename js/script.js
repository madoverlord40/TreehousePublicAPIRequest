//constant random user URL
const randomUserURL = "https://randomuser.me/api/?results=12&nat=us";
//reference to the root gallery div
let rootDiv = document.getElementById('gallery');

let userList = null;

//used to add div element to root div
function updateHTML(user, index) {     
    //format our new elements
    let newElements = `<div class="card">
        <div class="card-img-container">
        <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div> 
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.title} ${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>`;

    rootDiv.insertAdjacentHTML('beforeend', newElements);
    rootDiv.lastElementChild.addEventListener('click', (event ) => {
        showModalWindow(userList[index], false);
    });
}

//the modal window to display when an element is clicked
//@param userData, a json filled structure containing the entity clicked on
//@bIsError, boolean so we can use this modal window to display errors
function showModalWindow(userData, bIsError) {
    if(!bIsError) {
        const birthDate = userData.dob.date;
        const date = birthDate.substr(5,2) + "/" + birthDate.substr(8,2) + "/" + birthDate.substr(0, 4);
        let newElement = `<div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src=${userData.picture.large} alt="profile picture">
                                <h3 id="name" class="modal-name cap">${userData.name.title} ${userData.name.first} ${userData.name.last}</h3>
                                <p class="modal-text">${userData.email}</p>
                                <p class="modal-text cap">${userData.location.city}</p>
                                <hr>
                                <p class="modal-text">${userData.cell}</p>
                                <p class="modal-text">${userData.location.street.number} ${userData.location.street.name}, ${userData.location.city}, ${userData.location.state} ${userData.location.postcode}</p>
                                <p class="modal-text">Birthday: ${date}</p>
                            </div>
                        </div>
                    </div>`;
        
        //add the new element to the rootDiv
        rootDiv.insertAdjacentHTML('beforeend', newElement);

        //configure the button click event for closing the modal window.
        let closeBn = rootDiv.querySelector('#modal-close-btn');
        closeBn.addEventListener('click', (event) => {
            //grab the modal container and remove it
            let container = rootDiv.querySelector(".modal-container");
            rootDiv.removeChild(container);
        });

    }
    else {
        let newElement = `<div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                                <h3 id="name" class="modal-name cap">${userData}</h3>
                            </div>
                        </div>`;
        //add the new element to the rootDiv
        rootDiv.insertAdjacentHTML('beforeend', newElement);

        //configure the button click event for closing the modal window.
        let closeBn = rootDiv.querySelector('#modal-close-btn');
        closeBn.addEventListener('click', (event) => {
            //grab the modal container and remove it
            let container = rootDiv.querySelector(".modal-container");
            rootDiv.removeChild(container);
        });
    }
}


//using async here because it takes a bit of time to fetch 12 users, so we wait for it to load then display
async function run() {

    let fetchResponse = null;

    //sometimes the api fails with an error about CORS, when this happens we can trap it here
    try {
        //first lets wait for our fetch to respond
        fetchResponse = await fetch(randomUserURL);
    } catch(error) {
        //show modal function with error message
        showModalWindow(error, true);
    }

    //make sure our response is ok
    if(fetchResponse != null && fetchResponse.ok) {
        //convert the response to json
        let json = await fetchResponse.json();
        //list to store the random users results for later reference
        userList = json.results;

        //lets only do something as long as we dont have a null or empty list
        if(userList != null && userList.length > 0) {
            //clear the innerHTML
            rootDiv.innerHTML = '';
            //loop through the users list and display them
            for(var index = 0; index < userList.length; index++) {
                 //get our user from the index by current index
                const user = userList[index];
                //update the html
                updateHTML(user, index);
            }
        }
    } else {
        //show modal function with error message
        showModalWindow("Failed to fetch information from URL.", true);
    }
}

run();