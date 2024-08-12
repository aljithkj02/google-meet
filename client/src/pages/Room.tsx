import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import { setStream, setViewers } from "../store/slices/global.slice";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";

export const Room = () => {
  const {joinId, stream, viewers} = useSelector((state: AppStoreType) => state.global);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    SignalingManager.getInstance().setCallbacks(MessageTypes.NEW_USER, (id: number) => {

      const pc = new RTCPeerConnection();

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

      if (stream) {
        pc.addTrack(stream.getVideoTracks()[0], stream);
      }

      // this.viewers[userId] = pc;
      dispatch(setViewers({ id, rtcObj: pc}));
    })

    SignalingManager.getInstance().setCallbacks(MessageTypes.RECEIVE_ANSWER, ({userId, sdp }: { userId: number, sdp: RTCSessionDescription}) => {
      if (viewers[userId]) {
        viewers[userId].setRemoteDescription(new RTCSessionDescription(sdp));
      }
    })
    startStreaming();
  }, [])

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    dispatch(setStream(stream));
    
    if(videoRef.current){
        videoRef.current.srcObject = stream;

        videoRef.current && videoRef.current.play();
    }
  }

  return (
    <div className="w-full h-[91.9vh] flex flex-col items-center">
        <p className="text-center py-3 text-xl font-semibold text-blue-700">{joinId}</p>
        <video width={700} ref={videoRef}></video>
    </div>
  )
}
