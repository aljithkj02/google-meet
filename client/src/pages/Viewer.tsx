import { useEffect } from "react"
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";

export const Viewer = () => {
    const { userId, joinId } = useSelector((state: AppStoreType) => state.global);

    useEffect(() => {
        SignalingManager.getInstance().setCallbacks(MessageTypes.RECEIVE_OFFER, (sdp) => {

            const pc = new RTCPeerConnection();
            pc.ontrack = (event) => {
                console.log(event);
                // video.srcObject = new MediaStream([event.track]);
                // video.play();
            }

            pc.setRemoteDescription(sdp).then(() => {
                pc.createAnswer().then((answer) => {
                    pc.setLocalDescription(new RTCSessionDescription(answer));
                    SignalingManager.getInstance().giveAnswer(joinId as string, userId as number, pc.localDescription as RTCSessionDescription);
                });
            });
            startReceiving(pc);
        })

    }, []); 
    
    function startReceiving(pc: RTCPeerConnection) {
        const video = document.createElement('video');
        document.getElementById('viewer')?.appendChild(video);

        pc.ontrack = (event) => {
            console.log(event);
            video.srcObject = new MediaStream([event.track]);
            video.play();
        }

        // socket.onmessage = (event) => {
        //     (message.type === 'iceCandidate') {
        //         pc.addIceCandidate(message.candidate);
        //     }
        // }
    }

    return (
        <div id="viewer">Viewer</div>
    )
}
