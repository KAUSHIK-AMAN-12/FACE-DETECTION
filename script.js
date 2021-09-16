const video = document.getElementById('video')

// to load all Models Asynchromously
Promise.all([ 
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),  //--> to detect face
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //--> to register nose,lips,ears,eyes
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //-> to recognise face box in the video
    faceapi.nets.faceExpressionNet.loadFromUri('/models')   //-> to detect smile,anger
]).then(startVideo)

function startVideo()
{
    navigator.getUserMedia(      //--> in order to get access to "WEBCAM"
        {
            video : {}           //-->  
        },
        stream => video.srcObject = stream,      //-->  what coming from webcam is the source of video
        error => console.log(error)
    )
}

//add event listnener
video.addEventListener('play', ()=>   //on play event the callback will start excuting
{

console.log('Video is playing')
const canvas = faceapi.createCanvasFromMedia(video)
document.body.append(canvas)
const displaySize = {width : video.width , height : video.height}  //size of canvas is same as video
//how to match canvas to our display size
faceapi.matchDimensions(canvas,displaySize)

setInterval(async()=>
{
const detections = await faceapi.detectAllFaces(video ,   //it takes source of video and libraries
    new faceapi.TinyFaceDetectorOptions()            //--> dont need to set any custom option here
    ).withFaceLandmarks().withFaceExpressions()
    //------ to show all info on the screen we need "CANVAS" lement here
     const resizedDetections = faceapi.resizeResults(detections , displaySize )
     canvas.getContext('2d').clearRect(0,0,canvas.width , canvas.height)
    faceapi.draw.drawDetections(canvas , resizedDetections) //  we need to clear the pervious detections first
     faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
     faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
   
},100)     //every 100 milisec

})
