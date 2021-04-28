# VEHOGO
## Introduction

VEHO-GO is an application made manly for the use of Veho company. It is a technology platform. Our smartphone app connects driver-partners and riders.

You can use your rider app to request a ride. When a nearby driver-partner accepts your request, your app displays an estimated time of arrival for the driver-partner heading to your pickup location. Your app notifies you when the driver-partner is about to arrive.

Your app also provides info about the driver-partner with whom you will ride, including first name, vehicle type, and license plate number. This info helps the two of you connect at your pickup location.

Use your app to enter your work destination and also your work schedule for the week. If you have a preferred route, it's helpful to talk through the directions together. When you arrive at your destination and exit the vehicle, your trip ends. 



## Usage
Assuming that you have [Node 12 LTS](https://nodejs.org/en/download/) or greater installed, you can use npm to install the Expo CLI command-line utility:

<ol>
  <li>If needed, install code editor (+ extensions), git, npm</li>
  <li>Install Expo app to your phone.<a href="https://apps.apple.com/us/app/expo-client/id982107779">Ios</a>
     or<a href="https://play.google.com/store/apps/details?id=host.exp.exponent&hl=fi">Android</a></li>
   <li>npm install -g expo-cli</li>
   <li>git clone git@github.com:Vehonaattorit/VEHOGO.git</li>
  <li>Test that app works: 
    <ul><li>run it and open it in your emulator(the interactive shell is needed to get the menu option (A) for launching the emulator)
      <ul>
        <li>cd VEHOGO</li>
        <li>npm start</li>
      </ul>
      </li>
    </ul>
  </li>
</ol>

Create new folder and file in 'secrets/secrets.js'.

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
