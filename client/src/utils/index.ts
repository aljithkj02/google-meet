
export const closeRTCPeerConnection = (pc: RTCPeerConnection) => {
    pc.getSenders().forEach(sender => {
        if (sender.track) {
            sender.track.stop();  
        }
    });
    
    if (pc.signalingState !== "closed") {
        pc.close(); 
    }

    pc.onicecandidate = null;
    pc.ontrack = null;
    pc.ondatachannel = null;
    pc.oniceconnectionstatechange = null;
    pc.onnegotiationneeded = null;
    pc.onsignalingstatechange = null;
}

export const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}