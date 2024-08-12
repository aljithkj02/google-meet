import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignalingManager } from "../managers/signaling.manager";
import { MessageTypes } from "../types";
import { setJoinId, setUserId } from "../store/slices/global.slice";

export const Home = () => {
  const [text, setText] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    SignalingManager.getInstance().setCallbacks(MessageTypes.JOIN_ID, (joinId: string) => {
      if (joinId) navigate(`/room/${joinId}`);
    })

    SignalingManager.getInstance().setCallbacks(MessageTypes.JOIN_SUCCESSFUL, ({ userId, roomId }: { userId: Number, roomId: string}) => {
      dispatch(setUserId(userId));
      dispatch(setJoinId(roomId));
      navigate('/viewer');
    })
  }, [])

  const handleNewMeeting = () => {
    SignalingManager.getInstance().createRoom();
  }

  const handleJoinRoom = (id: string) => {
    SignalingManager.getInstance().joinRoom(id);
  }

  return (
    <div className="mx-20 grid grid-cols-2 h-[90vh] items-center">
      <div className="col-span-1 flex flex-col gap-3">
        <p className="text-[42px]">
          Video calls and meeting for everyone
        </p>

        <p className="text-gray-500 text-lg">
          Connect, collaborate and celebrate from anywhere with <br/> Google Meet
        </p>

        <div className="flex gap-10">
          <div>
            <button 
              onClick={handleNewMeeting}
              className="bg-blue-500 text-white px-5 py-2 rounded-md text-lg w-40"
            >
              New Meeting
            </button>
          </div>

          <div className="w-full flex gap-5 items-center">
            <div className="w-[60%]">
              <input type="text" 
                className="border-2 border-gray-500 w-full p-2 px-4 rounded-md"
                placeholder="Enter a Code or Link"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div >
              <button className={`text-lg font-semibold ${text ? 'text-blue-600': 'text-gray-500'}`}
                disabled={!text}
                onClick={() => handleJoinRoom(text)}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 flex justify-center">
        <div className="w-64">
          <img src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg" alt="google meet" 
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
