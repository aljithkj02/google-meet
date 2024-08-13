import { useEffect, useRef, useState } from "react"
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Viewer = () => {
    const { userId, joinId } = useSelector((state: AppStoreType) => state.global);
    const [rtc, setRtc] = useState<RTCPeerConnection | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const navigate = useNavigate();

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

    const handleLeaveMeet = () => {
        SignalingManager.getInstance().leaveMeeting(joinId as string, userId as number);
        toast.dismiss();
        toast.success('Left the meeting!');
        navigate('/');
    }

    return (
        <div className="w-full h-screen flex flex-col items-center bg-[#202124] justify-between">
            <video className="w-[100%] h-[660px] pt-4" ref={videoRef}></video>

            <div className="py-4">
                <div className="bg-[#FF3B30] p-1 rounded-[50%] cursor-pointer"
                    onClick={handleLeaveMeet}
                >
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/end-call-icon.png"
                        alt="Call hangup"
                        className="w-10 bg-white rounded-[50%]"
                    />
                </div>
            </div>
        </div>
    )
}
