# iEngage

	
Third Party Packages	Purpose
@react-native-community/async-storage	An asynchronous, unencrypted, persistent, key-value storage system
@react-native-community/datetimepicker	date & time picker component for iOS, Android and Windows
@react-native-community/geolocation	to fetch location of iOS, android devices
@react-native-community/netinfo	Network info api to get connection type, quality etc
appcenter	continuous integration, delivery and learning solution
jail-monkey	to protect data integrity i.e rooted device, location set etc
moment	library for parsing, validating, manipulating, and formatting dates
react-native-android-location-enabler	Allow to display a GoogleMap like android popup to ask for user to enable location services
react-native-autocomplete-input	to autocomplete text based on api data or local data
react-native-camera	to use camera functionality on android, iOS
react-native-config	to configure enviroments .env files as per need
react-native-code-push	easily add a dynamic update experience to our React Native app
react-native-device-info	to get device info i.e version, RAM etc
react-native-document-picker	 to open a document picker for the user to select file(s)
react-native-elements	a cross platform UI Toolkit
react-native-exit-app	Exit / Close / Kill / shutdown your react native app.
react-native-file-viewer	Preview any type of file supported by the mobile device
react-native-fs	Native filesystem access
react-native-image-picker	to select a photo/video from the device library or camera
react-native-image-resizer	can create scaled versions of local images
react-native-image-slider-box	to show multiple images in slider view
react-native-keyboard-aware-scrollview	handles keyboard appearance and automatically scrolls to focused textInput
react-native-modal-datetime-picker	A declarative cross-platform react-native datetime-picker
react-native-modal-dropdown	dropdown/picker/selector component for both Android & iOS
react-native-nested-listview	to create a listview with N levels of nesting
react-native-paper	follow material design guidelines for UI
react-native-pdf	read a PDF from url/local file/asset and can cache it
react-native-render-html	renders our HTML into 100% native views
react-native-simple-radio-button	simple useful radio button component
react-native-simple-toast	It just lets iOS users have the same toast experience as on Android
react-native-splash-screen	for programatically hide and show the splash screen
react-native-table-component	to show content in tabular form in react native
react-native-vector-icons	Perfect for buttons, logos and nav/tab bars
react-navigation	need for an extensible yet easy-to-use navigation solution
react-redux	to global state management, Performant and flexible
rn-fetch-blob	to making file access and data transfer easier and more efficient
rn-sliding-up-panel	to use draggable sliding up panel
	
	
Commands
ENVFILE=.env.PROD react-native run-android	Android Simulator- prod
ENVFILE=.env.DEV react-native run-android	Android Simulator- dev
ENVFILE=.env.PROD react-native run-ios --simulator="iPhone 8" --scheme iNIITian	iOS Simulator- dev
ENVFILE=.env.DEV react-native run-ios --simulator="iPhone 8" --scheme iNiitian_Dev	iOS Simulator- dev
appcenter codepush release-react -a Coforge/iEngage-1 -d Production -t 20.7.1	Android code push- prod
appcenter codepush release-react -a Coforge/iEngage-1 -d Production -t 99.99.99	Android code push- dev
appcenter codepush release-react -a Coforge/iEngage -d Production -t 20.7.1	iOS code push- prod
appcenter codepush release-react -a Coforge/iEngageDev -d Production -t 99.99.99	iOS code push- dev
cd android && ENVFILE=.env.PROD ./gradlew assembleRelease	Android Release Build- prod
cd android && ENVFILE=.env.DEV ./gradlew assembleRelease	Android Release Build- dev
Manually from Xcode	iOS Release Build- prod
Manually from Xcode	iOS Release Build- dev
	
