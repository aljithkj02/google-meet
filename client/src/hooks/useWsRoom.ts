import { RefObject, useEffect, useState } from "react";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { AppStoreType } from "../store/appStore";
import { useSelector } from "react-redux";

export const useWsRoom = (videoRef: RefObject<HTMLVideoElement>) => {
    const [userCount, setUserCount] = useState(0);
    const {joinId} = useSelector((state: AppStoreType) => state.global);
    const [time, setTime] = useState(getCurrentTime());

    useEffect(() => {
        SignalingManager.getInstance().setCallbacks(MessageTypes.NEW_USER, async (id: number) => {
            setUserCount(count => count + 1);
            const pc = new RTCPeerConnection();

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            SignalingManager.getInstance().giveOffer(joinId as string, id, pc.localDescription as RTCSessionDescription);

            pc.onnegotiationneeded = async () => {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                
                SignalingManager.getInstance().giveOffer(joinId as string, id, pc.localDescription as RTCSessionDescription);
            }


            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    SignalingManager.getInstance().sendIceCandidateToUser(id, event.candidate, joinId as string);
                }
            }

            const stream = SignalingManager.getInstance().stream;
            if (stream) {
                pc.addTrack(stream.getVideoTracks()[0], stream);
            }

            SignalingManager.getInstance().addNewViewer(id, pc);
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.RECEIVE_ANSWER, ({userId, sdp }: { userId: number, sdp: RTCSessionDescription}) => {
            const viewers = SignalingManager.getInstance().viewers;
            if (viewers[userId]) {
                viewers[userId].setRemoteDescription(new RTCSessionDescription(sdp));
            }
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.OWNER_ICE_CANDIDATE, ({ userId, candidate }: { userId: number, candidate: RTCIceCandidate}) => {
            const viewers = SignalingManager.getInstance().viewers;
            if (viewers[userId]) {
                viewers[userId].addIceCandidate(candidate);
            }
        })

        SignalingManager.getInstance().setCallbacks(MessageTypes.LEAVE_MEETING, ({ userId }: { userId: number}) => {
            delete SignalingManager.getInstance().viewers[userId];
            setUserCount(count => count - 1);
        })

        startStreaming();

        const interval = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000);

        return () => {
            clearInterval(interval);
            if (videoRef.current) {
                SignalingManager.getInstance().stream?.getTracks().forEach(track => {
                    track.stop();
                });
                
                SignalingManager.getInstance().stream = null;
                videoRef.current.srcObject = null;
            }
        }
    }, [])

    const startStreaming = async () => {
        const stream: MediaStream | null = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        SignalingManager.getInstance().addStream(stream);
        
        if(videoRef.current){
            videoRef.current.srcObject = SignalingManager.getInstance().stream;

            videoRef.current && videoRef.current.play();
        }
    }

    function getCurrentTime() {
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

    return { userCount, time };

}