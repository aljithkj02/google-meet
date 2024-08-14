import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { setJoinId, setLoading, setUserId } from "../store/slices/global.slice";

export const usWsHome = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    useEffect(() => {
      SignalingManager.getInstance().setCallbacks(MessageTypes.JOIN_ID, (joinId: string) => {
        dispatch(setJoinId(joinId));
        dispatch(setLoading(false));
        if (joinId) navigate(`/room/${joinId}`);
      })
  
      SignalingManager.getInstance().setCallbacks(MessageTypes.JOIN_SUCCESSFUL, ({ userId, roomId }: { userId: Number, roomId: string}) => {
        dispatch(setUserId(userId));
        dispatch(setJoinId(roomId));
        dispatch(setLoading(false));
        navigate('/viewer');
      })
    }, [])
}