import "./ChatWindow.css";
import Chat from './Chat.jsx';
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from 'react-spinners';
import {v1 as uuidv1} from "uuid";

function ChatWindow() {

    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, setcurrThreadId} = useContext(MyContext);
    const [loading, setLoading] = useState(false);


    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

            try {
                const response = await fetch("http://localhost:8080/api/chat", options);
                const res = await response.json();
                
                
                setReply(res.reply);
            } catch (err) {
                console.log(err);
            }

            setLoading(false);

    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }
        setPrompt("");
    }, [reply]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
    }

    return (

        <div className="chatWindow">
            <div className="navbar">
                <div className="nChat">
                    <span className="nChatsp">
                        <button onClick={createNewChat}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    </span>
                </div>
            </div>
            <Chat></Chat>
            <ScaleLoader loading={loading} color="#fff">

            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input 
                        id="chatInput"
                        placeholder="Ask anything" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key==='Enter'? getReply() : ''}>
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>

                </div>
                <p className="info">
                    FastChat can make mistakes.
                </p>
            </div>

        </div>
    );
}

export default ChatWindow;