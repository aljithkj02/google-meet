import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";

export const Room = () => {
  const {joinId} = useSelector((state: AppStoreType) => state.global);
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
  }, [])

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    SignalingManager.getInstance().addStream(stream);
    
    if(videoRef.current){
        videoRef.current.srcObject = stream;

        videoRef.current && videoRef.current.play();
    }
  }

  return (
    <div className="w-full h-[91.9vh] flex flex-col items-center">
        <p className="text-center py-3 text-xl font-semibold text-blue-700">{joinId}</p>
        <h1>Viewers count: {userCount}</h1>
        <video width={700} ref={videoRef}></video>
    </div>
  )
}
