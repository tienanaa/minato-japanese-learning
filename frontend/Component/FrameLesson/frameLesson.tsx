import './frameLesson.css'
import { FiFileText } from "react-icons/fi";

type FrameLessonProp={
    name: string,
    GotoContent: ()=>void;
}

export default function FrameLesson({ name, GotoContent}:FrameLessonProp){

    return (
        <>
            <button className='lesson' onClick={GotoContent}>
                <div>
                    <FiFileText style={{
                    marginTop: "5px",
                    width:"5rem",
                    height:"5rem",
                    stroke :"black"
                }}/>
                </div>
                <span style={{
                    fontSize:"15px",
                    color:"black"

                }}>{name}</span>
            </button>
        </>
    )
}