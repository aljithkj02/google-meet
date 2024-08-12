import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppStoreType } from "../store/appStore";
import { setStream } from "../store/slices/global.slice";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";

export const Room = () => {
  const joinId = useSelector((state: AppStoreType) => state.global.joinId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    SignalingManager.getInstance().setCallbacks(MessageTypes.NEW_USER, (id: number) => {
      console.log({id})
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
