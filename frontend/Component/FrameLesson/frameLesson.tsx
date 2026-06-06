import { GiNotebook } from 'react-icons/gi';
import './frameLesson.css'

type FrameLessonProp={
    name: string,
    GotoContent: ()=>void;
}

export default function FrameLesson({ name, GotoContent}:FrameLessonProp){

    return (
        <>
            <button className='lesson' onClick={GotoContent}>
                <div>
                    <GiNotebook style={{
                    color:"black",
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