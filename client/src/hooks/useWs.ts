import { wsManager } from "../managers/ws.manager";
import { MessageTypes } from "../types";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsJoined, setJoinId, setUserId } from "../store/slices/global.slice";
import { AppStoreType } from "../store/appStore";


export const useWs = () => {
    const { joinId, stream, userId } = useSelector((state: AppStoreType) => state.global);
    const dispatch = useDispatch();

    wsManager.getSocket().onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === MessageTypes.JOIN_ID) {
            dispatch(setJoinId(message.data));
        } else if (message.type === MessageTypes.ERROR) {
            toast.dismiss();
            toast.error(message.message);
        } else if (message.type === MessageTypes.JOIN_SUCCESSFUL) {
            dispatch(setIsJoined(true));
            dispatch(setUserId(message.data.userId));
            dispatch(setJoinId(message.data.roomId));
        } else if (message.type === MessageTypes.NEW_USER) {
            wsManager.addNewUser(message.data, joinId as string, stream as MediaStream);
        } else if (message.type === MessageTypes.RECEIVE_OFFER) {
            wsManager.receiveOffer(message.data, userId as number, joinId as string);
        } else if (message.type === MessageTypes.RECEIVE_ANSWER) {
            wsManager.receiveAnswer(message.data);
        } if (message.type === MessageTypes.USER_ICE_CANDIDATE) {
            wsManager.giveIceCandidateToUser(message.data);
        } if (message.type === MessageTypes.OWNER_ICE_CANDIDATE) {
            wsManager.giveIceCandidateToOwner(message.data);
        }
    }
}