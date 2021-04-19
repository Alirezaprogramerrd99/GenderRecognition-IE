
/*
setCookie:
   this function will set user information (name, gender) in
   format key=name and value=gender in each cookie.

***NOTE that some logs are printed on the inspect-elements in browser
 you can see this logs for step by step oprations.
 for example for functions like setCookie and deleteCookie
 i inserted logs for better understanding of oprations.
*/

function setCookie(nameVal, gender, dayes) {

   var d = new Date();
   d.setTime(d.getTime() + (dayes*24*60*60*1000));
   var expires = "expires="+ d.toUTCString();
   document.cookie = nameVal + "=" + gender + ";" + expires + ";path=/";
   console.log("the cookie for name=" + nameVal + " ; gender=" + gender + " has been set.");
 }

 /*

 this function deletes cookie using passed date format.
 ***NOTE that some logs are printed on the inspect-elements in browser
 you can see this logs for step by step oprations.
 */

function deleteCookie(nameVal, gender) {
   document.cookie = nameVal + "=" + gender + ";" + " expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
   console.log("the cookie for name=" + nameVal + " ; gender=" + gender + " has been deleted.")
 }

function getCookie(cname) {  // search cookie by name.

   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');

   for(var i = 0; i <ca.length; i++) {
     var c = ca[i];
     while (c.charAt(0) == ' ') {
       c = c.substring(1);
     }
     if (c.indexOf(name) == 0) {
       return c.substring(name.length, c.length);
     }
   }
   return "";   // if we dont have any cookie with this name, return empty string.
 }

/*
   ReadCookie():
   this function is for debuging the saved cookies..
*/

function ReadCookie() {
   var allcookies = document.cookie;
   
   // Get all the cookies pairs in an array
   cookiearray = allcookies.split(';');
   console.log(cookiearray.length);
   // Now take key value pair out of this array
   for(var i = 0; i < cookiearray.length; i++) {
      let name = cookiearray[i].split('=')[0];
      let value = cookiearray[i].split('=')[1];
      alert ("Key is : " + name + " and Value is : " + value);
   }
}

/*
createErrorMsg:
   if some kind of error happen, show this error to the user.
*/
function createErrorMsg(msg){

   var errorMsg = document.getElementById("errorMessage");
   errorMsg.innerHTML = msg;

}

/*
createErrorMsg:
   this function clears error message every time the submit event happens.
*/

function removeErrorMsg(){
   
   var errorMsg = document.getElementById("errorMessage");
   errorMsg.innerHTML = "";
}

 /*
 resetSavedMsgTextBox:
    this function clears SavedMsgTextBox.
 */
 
function resetSavedMsgTextBox(){

   var savedMessageTextBox = document.getElementById("savedAnswerTextBox");
   savedMessageTextBox.value = "";
}
   
/*
   resetPredictionTextBox:
   this function clears PredictionTextBox.
*/
   
function resetPredictionTextBox(){
   
   var PredictionTextBox = document.getElementById("predictionTextBox")
   PredictionTextBox.value = "";
}

/*
   resetPredictionTextBox:
   this function clears radio Group.
*/
function resetRadioGroup(){

   document.getElementById("femaleBtn").checked = false;
   document.getElementById("maleBtn").checked = false;
}

let genderValue = "";
let nameValue = "";
let validInput = true;

// using DOM to access to submit button to create an event.
let submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", ()=>{

      console.log('submit btn clicked!!');
      removeErrorMsg();               // removing the error msg.
      resetPredictionTextBox();      // reset textbox
      resetSavedMsgTextBox();       // reset textbox
      genderValue = "";
      nameValue = "";
      validInput = true;           // reseting the flag for next user.

   /*
      after submit has been clicked, we read the string and radio button values
      that user had been entered using DOM.
   */
     nameValue = document.getElementById("nameTxtBox").value;   // gating the name from user.
     let GenderRadioGroup = document.getElementsByName("gender");
     
     if(nameValue === "" || GenderRadioGroup === "")
         createErrorMsg("Enter name and gender!");
     
     else{
      //------------ checking the user selection according to radio buttons ---------
      if(GenderRadioGroup[0].checked)
         genderValue = "male";
      else if (GenderRadioGroup[1].checked)
         genderValue = "female";

      //   console.log(nameValue);
      //   console.log(genderValue);

         const SERVER_URL = new URL("https://api.genderize.io");

      /*
            creating params using user's information: 
      */

      params = {name:nameValue, gender:genderValue};     // convertion to param object.
      console.log(params);   // printing log in inspect-element in browser.

      //------------- apending quary params to url
      Object.keys(params).forEach(key => SERVER_URL.searchParams.append(key, params[key]))
      let httpResponse;

      /* 
            using fetch function to send GET request to server
            this function returns a promise object, and I used
            chaining them to convert the response object to json
            format. and in inner then, I used json data recived 
            from server to show to user.
      */

      httpResponse = fetch(SERVER_URL).then(response => response.json())
      .then(json => {console.log(json); 
         
         let predictionTextBox = document.getElementById("predictionTextBox");
         
         /*
            this part is for handling the server problem or some name
            prediction problem we will throw some alert message to user.
         */

         if(json["gender"] === null && json["probability"] === 0){
            createErrorMsg("Error! please enter another name");
            validInput = false;
         }

         /*
         else: if we dont have any problems, we pass server 's response information
         that has json format(name=value) to the predictionTextBox object
         using DOM.
         */
         else{ 
            predictionTextBox.value = json["gender"]  + "\n";
            predictionTextBox.value += json["probability"];
         }
 
         if(validInput && genderValue !== "")        // if has valid input and gender value store it.
            setCookie(nameValue, genderValue, 2);   // saving true values from user. pair(name, gender)

         // search for cookie name and if it was cookie for that name, show in TextBox.
         cookieValue = getCookie(nameValue);

         if(cookieValue !== ""){        // if user had saved information.
            let savedMessageTextBox = document.getElementById("savedAnswerTextBox");
            savedMessageTextBox.value = cookieValue;
         }
      
      })
      .catch(err => {
         createErrorMsg("Error! Network problem.");  // error handeling. (network problem!!)
         validInput = false}
         );   

     }
     resetRadioGroup();           // reset radioGroup

});
/*
 setting event handler for clear button if the user press the button the 
 callback function(arrow function) body will run.
*/
let clearBtn = document.getElementById("clearBtn"); 
clearBtn.addEventListener("click", ()=>{

   resetSavedMsgTextBox();
   deleteCookie(nameValue, genderValue);   // deleteing the cookie with name, gender pair.
})



