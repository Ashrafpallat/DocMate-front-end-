import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useDispatch } from 'react-redux';
import { setVideoCallUrl } from '../redux/videoCallSlice';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';


function randomID(len: number) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCallComponent() {
    const socket = useSocket(); // Get the socket instance from the context
  const location = useLocation();
  const chatId = location.state?.chatId || 'non';   
  console.log('Received chatId from video call:', chatId);
  const roomID = getUrlParams().get('roomID') || randomID(5);

  let myMeeting = async (element: any) => {
    // Generate Kit Token
    const appID = 2071757411;
    const serverSecret = "64fafbbcc885952a133715b846a7c057";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Generate the URL
    const generatedUrl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?roomID=' +
      roomID;

    if (!socket || !chatId) return;
    socket.emit('video-call', {
      chatId: chatId,
      videoCallUrl: generatedUrl,
    });
    // dispatch(setVideoCallUrl(generatedUrl));

    // Optionally, you can emit this URL using a socket or store it elsewhere
    // socket.emit('videoCall', { url: generatedUrl, roomID });

    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url: generatedUrl,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // Change this for 1-on-1 call
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}

