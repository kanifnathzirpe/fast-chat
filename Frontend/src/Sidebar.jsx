import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function Sideabar() {
    const {allThreads, setAllThreads, currThreadId, newChat, setNewChat, setPrompt, setReply, setcurrThreadId, setPrevChats} = useContext(MyContext);
    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setcurrThreadId(newThreadId);
        setNewChat(false);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch(err) {
            console.log(err);
        }

    }
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);
            setAllThreads(allThreads.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="logo" className="logo" />
                <h3>FastChat</h3>
            </button>

           {/* History */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => 
                        <li className={thread.threadId === currThreadId && !newChat ? "highlighted" : ""}
                            key={idx}
                            onClick={ (e) => changeThread(thread.threadId)}    
                        >{thread.title}  
                        <i className="fa-solid fa-trash"
                            onClick={(e) => 
                            {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }
                            }></i></li>
                    )
                }          
            </ul>

            {/* sign */}
            <div className="sign">
                <p>Made with <i className="fa-solid fa-heart" style={{color: "#ff0000" }}></i></p>
                <p>By Kanifnath Zirpe</p>
            </div>
        </section>
    );
}

export default Sideabar;