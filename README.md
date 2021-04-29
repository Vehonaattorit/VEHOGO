# VEHOGO

- [Navigation](#markdown-navigation)
    - [Introduction](#introduction)
    - [API's](#aPI's)
    - [Introduction to Firebase](#introductionToFirebase)
    - [Introduction to Google API](#introductionToGoogleAPI)
    - [Setup & Installation](#Setup&Installation)
    - [Testing](#Testing)
    
 

## Introduction

VEHO-GO is an application made manly for the use of Veho company. It is a technology platform. Our smartphone app connects driver-partners and riders.

You can use your rider app to request a ride. When a nearby driver-partner accepts your request, your app displays an estimated time of arrival for the driver-partner heading to your pickup location. Your app notifies you when the driver-partner is about to arrive.

Your app also provides info about the driver-partner with whom you will ride, including full name, vehicle type, and license plate number. This info helps the two of you connect at your pickup location.

Use your app to enter your work destination and also your work schedule for the week. If you have a preferred route, it's helpful to talk through the directions together. When you arrive at your destination and exit the vehicle, your trip ends.

## API's

### Introduction to Firebase

Firebase is Google’s mobile application development platform that helps you build, improve, and grow your app. It provides developers with a variety of tools and services to help them develop quality apps, grows their user base, and earn profit. It is built on Google’s infrastructure. Firebase is categorized as a NoSQL database program, which stores data in JSON-like documents. <a href="https://medium.com/firebase-developers/what-is-firebase-the-complete-story-abridged-bcc730c5f2c0">More about Firebase...</a>

We have used firebase authentication to know the user’s identity, provide a customized experience, and keep the user’s data secure. <a href="https://firebase.google.com/docs/auth">More about authentication...</a>

We have also taken advantage of Firebase’s real-time database which is cloud-hosted. Data is stored as JSON and synchronized in real-time to every connected client. <a href="https://firebase.google.com/docs/database">More about database...</a>

### Introduction to Google API

Google Map’s API is a robust tool that can be used to create a custom map, a searchable map, check-in functions, display live data synching with location, plan routes, or create a mashup just to name a few. <a href="https://medium.com/@helennnsays/why-when-and-how-to-use-the-google-map-api-f5dfa35986dc">More about Google Map API...</a>

What we have used Google Map API for:

<ol>
<li>Get the passengers and drivers location</li>
<li>Show the route between driver and passenger</li>
<li>Showing nearest road to destination</li>
</ol>

We have also used Google Places Autocomplete API to give our application the type-ahead-search behavior. The autocomplete service can match on full words and substrings, resolving place names, addresses, and codes. Applications can therefore send queries as the user types, to provide on-the-fly place predictions. <a href="https://developers.google.com/maps/documentation/places/web-service/autocomplete">Read more...
</a>

## Setup & Installation

Assuming that you have [Node 12 LTS](https://nodejs.org/en/download/) or greater installed, you can use npm to install the Expo CLI command-line utility:

1. If needed, install code editor (+ extensions), git, npm</li>
2. Install Expo app to your phone. <a href="https://apps.apple.com/us/app/expo-client/id982107779">iOS</a>
   or <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&hl=fi">Android</a></li>
3. Install expo CLI: <code>npm install -g expo-cli</code></li>
4. Clone the project: git clone git@github.com:Vehonaattorit/VEHOGO.git</li>

Create new folder 'secrets'.

Inside secrets folder create a new file secrets.js and copy/paste the following code snippet in it</li>

```
const firebaseConfig = {
  apiKey: '(FIREBASE_CONFIG)',
  authDomain: '(FIREBASE_CONFIG)',
  projectId: '(FIREBASE_CONFIG)',
  storageBucket: '(FIREBASE_CONFIG)',
  messagingsenderID: '(FIREBASE_CONFIG)',
  appId: '(FIREBASE_CONFIG)',
  measurementId: '(FIREBASE_CONFIG)',
}
let googleMapsApiKey = '(GOOGLE_API_KEY)'
export {firebaseConfig}

```

Test that app works:

run it and open it in your emulator(the interactive shell is needed to get the menu option (A) for launching the emulator)</li>

        > cd VEHOGO
        > npm start

## Testing

As your codebase expands, small errors and edge cases you don’t expect can cascade into larger failures. Bugs lead to bad user experience and ultimately, business losses. One way to prevent fragile programming is to test your code before releasing it into the wild.

Testing helps you uncover these mistakes and verifies that your code is working. Perhaps even more importantly, testing ensures that your code continues to work in the future as you add new features, refactor the existing ones, or upgrade major dependencies of your project. <a href="https://reactnative.dev/docs/testing-overview">Read more...</a>

### Introduction to Cypress

In this project, we have used Cypress as our testing platform. With Cypress, you can Run End to End tests. It checks whether a web application works as expected or not. <a href="https://www.browserstack.com/dg/cypress-testing?utm_source=google&utm_medium=cpc&utm_campaign=Search-NB-CypressTesting-TestKeywords-EMEA-Automate-CL&utm_adgroup=Cypress-End-to-End-Testing&utm_keyword=%2Bcypress%20%2Bend%20%2Bto%20%2Bend%20%2Btesting&utm_matchtype=b&gclid=Cj0KCQjwsqmEBhDiARIsANV8H3bT1GEoovqozRxwtsGSaWFry6alc8JLfeA5a_BY0od8Gvvl_J4uTLcaAvikEALw_wcB">Read more...<a>


## Change Log

## Maintainers

@Kurosh Husseini <a href="https://github.com/kurosh97">Github Link...</a><br/>
@Juhana Tamminen <a href="https://github.com/JuhanaTa">Github Link...</a><br/>
@Niklas Nilsson <a href="https://github.com/Jalsson">Github Link...</a><br/>
@Michael Lock <a href="https://github.com/thelockymichael">Github Link...</a><br/>
