/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';

import { getFirebaseConfig } from './firebase-config.js';



// Saves a new message on the Cloud Firestore.
async function saveMessage(messageText, messageName, messageEmail) {
  // TODO 7: Push a new message to Cloud Firestore.
  try {
    console.log(messageName);
    await addDoc(collection(getFirestore(), 'messages'), {
      name: messageName,
      text: messageText,
      email: messageEmail,
      timestamp: serverTimestamp()
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // TODO 8: Load and listen for new messages.
   // Create the query to load the last 12 messages and listen for new ones.
   const recentMessagesQuery = query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'desc'), limit(12));
  
   // Start listening to the query.
   onSnapshot(recentMessagesQuery, function(snapshot) {
     snapshot.docChanges().forEach(function(change) {
       if (change.type === 'removed') {
         deleteMessage(change.doc.id);
       } else {
         var message = change.doc.data();
         displayMessage(change.doc.id, message.timestamp, message.name,
                       message.text, message.profilePicUrl, message.imageUrl);
       }
     });
   });
}


// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  console.log(messageNameElement.value);
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && messageNameElement.value) {
    let email = messageEmailElement.value;
    if(!email) {
      email = "";
    }
    saveMessage(messageInputElement.value, messageNameElement.value, email).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      resetMaterialTextfield(messageNameElement);
      resetMaterialTextfield(messageEmailElement);
      toggleButton();
    });
  }
}


// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
  '<div class="message-container">' +
  '<div class="spacing"><div class="pic"></div></div>' +
  '<div class="message"></div>' +
  '<div class="name"></div>' +
  '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

function createAndInsertMessage(id, timestamp) {
  const container = document.createElement('div');
  container.innerHTML = MESSAGE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var div =
    document.getElementById(id) || createAndInsertMessage(id, timestamp);

  div.classList.add('row');
  div.classList.add('mb-2');
  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }
  var nameElement = div.querySelector('.name')
  nameElement.classList.add('align-start')
  nameElement.classList.add('blockquote-footer')
  // nameElement.classList.add('col-md-6')
  nameElement.textContent = name;
  var messageElement = div.querySelector('.message');
  messageElement.classList.add('mt-3')
  
  if (text) {
    // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) {
    // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function () {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }

  // div.insertBefore(hrElement, messageElement);
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function () {
    div.classList.add('visible');
  }, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}
console.log("hello");
// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var messageNameElement = document.getElementById('message-name');
var messageEmailElement = document.getElementById('message-email');
var submitButtonElement = document.getElementById('submit');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
console.log(document);
console.log(document.getElementById('messages'));

const firebaseAppConfig = getFirebaseConfig();
// TODO 0: Initialize Firebase
// const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

loadMessages();
