import { useEffect, useState } from "react"
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";

export const Viewer = () => {
    const { userId, joinId } = useSelector((state: AppStoreType) => state.global);
    const [rtc, setRtc] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        SignalingManager.getInstance().setCallbacks(MessageTypes.RECEIVE_OFFER, async (sdp: RTCSessionDescription) => {
            console.log("Offer Recieved")
            const pc = new RTCPeerConnection();

            pc.ontrack = (event) => {
                console.log("Event recieved")
                const video = document.createElement('video');
                document.getElementById('viewer')?.appendChild(video);
                console.log({event});
                video.srcObject = new MediaStream([event.track]);
                video.play();
            }

            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            pc.setLocalDescription(answer);
    
            SignalingManager.getInstance().giveAnswer(joinId as string, userId as number, answer as RTCSessionDescription);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    SignalingManager.getInstance().sendIceCandidateToOwner(userId as number, joinId as string, event.candidate);
                };
            }

            setRtc(pc);
            // startReceiving(pc);
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.USER_ICE_CANDIDATE, (candidate: RTCIceCandidate) => {
            rtc?.addIceCandidate(candidate);
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
