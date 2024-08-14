import { useRef } from "react"
import { SignalingManager } from "../managers/signaling.manager";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useWsViewer } from "../hooks/useWsViewer";

export const Viewer = () => {
    const { userId, joinId } = useSelector((state: AppStoreType) => state.global);
    const videoRef = useRef<HTMLVideoElement>(null);
    useWsViewer(videoRef);
    const navigate = useNavigate();

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
