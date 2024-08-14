import { RefObject, useEffect, useState } from "react";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";

export const useWsViewer = (videoRef: RefObject<HTMLVideoElement>) => {
    const { userId, joinId } = useSelector((state: AppStoreType) => state.global);
    const [rtc, setRtc] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        SignalingManager.getInstance().setCallbacks(MessageTypes.RECEIVE_OFFER, async (sdp: RTCSessionDescription) => {
            const pc = new RTCPeerConnection();

            pc.ontrack = (event) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = new MediaStream([event.track]);
                    videoRef.current.play();
                }
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
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.USER_ICE_CANDIDATE, (candidate: RTCIceCandidate) => {
            rtc?.addIceCandidate(candidate);
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.LEAVE_MEETING, (candidate: RTCIceCandidate) => {
            rtc?.addIceCandidate(candidate);
        })

    }, []);
}