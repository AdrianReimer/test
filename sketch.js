const BOX_WIDTH = 4
const BOX_HEIGHT = 2
const MFCC_HISTORY_MAX_LENGTH = 87
var mfcc_history = []


function createAudioCtx(){
	let AudioContext = window.AudioContext || window.webkitAudioContext;
	return new AudioContext();
}

function createMicSrcFrom ( audioCtx ) {
	return new Promise ( ( resolve, reject ) => {
		/* only audio */
		let constraints = { audio : true, video : false }

		/* get microphone access */
		navigator.mediaDevices.getUserMedia ( constraints )
		.then ( ( stream ) => {
			/* create source from microphone input stream */
			let src = audioCtx.createMediaStreamSource ( stream )
			resolve ( src )
		}).catch ( (err ) => { reject ( err ) } )
	})
}

function setupMeydaAnalzer () {
	let audioCtx = createAudioCtx ()

	createMicSrcFrom ( audioCtx )
	.then ( ( src ) => {
		let analyzer = Meyda.createMeydaAnalyzer ({
			'audioContext': audioCtx,
			'source':src,
			'bufferSize':512,
			'featureExtractors':["mfcc","rms"],
			'callback':callback
		})
		analyzer.start ()
	}).catch ( ( err ) => {
		alert ( err )
	})
}

function callback ( features ) {
	let mfcc = features ["mfcc"]
	let rms = features ["rms"] 
	plot (mfcc)
	console.log(features)

	if ( rms > THRESHOLD_RMS ) 
		mfcc_history.push ( mfcc ) /* only push mfcc where some audio is present */

	if(mfcc_history.length > MFCC_HISTORY_MAX_LENGTH)
		mfcc_history.splice(0,1) /* remove past mfcc values */
}

function plot(data){
  for(let i = 0; i < data.length; i++ ) {
	for(let j = 0; j < data [i].length; j++ ) {
	  // setting fill color
	  if ( data [i] [j] >= 0 ) fill ( 100, data[i][j] * 100, 100 )
	  else fill( 100, 100, - data[i][j] * 100 )

	  noStroke();
	  rect(i * BOX_WIDTH, j * BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT)
	}
  }
}

function setup() {
	createCanvas ( BOX_WIDTH * MFCC_HISTORY_MAX_LENGTH, BOX_HEIGHT * 87 )
	background ( 255, 230, 150 )

	setupMeydaAnalzer ()
}

function draw() {
  background(220);
  plot ( mfcc_history )
}