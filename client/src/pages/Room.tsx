import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";

export const Room = () => {
  const {joinId} = useSelector((state: AppStoreType) => state.global);
  const [time, setTime] = useState(getCurrentTime());

  const [userCount, setUserCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
            SignalingManager.getInstance().sendIceCandidateToUser(id, event.candidate);
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
    startStreaming();

    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    SignalingManager.getInstance().addStream(stream);
    
    if(videoRef.current){
        videoRef.current.srcObject = stream;

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

  return (
    <div className="w-full h-screen flex flex-col items-center bg-[#202124] justify-between">
        <video className="w-[100%] h-[660px] pt-4" ref={videoRef}></video>

        <div className="px-8 py-4 flex justify-between w-full">
          <div className="flex items-center gap-3">
            <p className="text-white">{ time }</p>
            <p className="text-white"> | </p>
            <p className="text-white">{ joinId }</p>
          </div>

          <div className="flex items-center gap-3 select-none">
            <div className="bg-[#3C4043] p-3 rounded-[50%] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
            </div>

            <div className="bg-[#3C4043] p-3 rounded-[50%] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </div>

            <div className="bg-[#3C4043] p-3 rounded-[50%] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </div>

            <div className="bg-[#FF3B30] p-1 rounded-[50%] cursor-pointer">
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/end-call-icon.png"
                    alt="Call hangup"
                    className="w-10 bg-white rounded-[50%]"
                />
            </div>

          </div>

          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>

            <p className="text-white">Viewers</p>

            <p className="text-white text-xl">{userCount}</p>
          </div>
        </div>
    </div>
  )
}
