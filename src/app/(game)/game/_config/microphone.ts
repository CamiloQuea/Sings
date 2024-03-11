export class MicrophoneConnection {
    connect(callBack: (stream: MediaStream) => void) {
        navigator.mediaDevices
            .getUserMedia({
                audio: {

                    noiseSuppression: true,
                    echoCancellation: true
                }
            })
            .then(callBack)
            .catch(err => console.log(err))
    }
}