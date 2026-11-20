import {useState} from "react"
import SkillCard from "./SkillCard"

function SwipeDeck ({people, onLike, onDone, onOpen}) {
    const[index, setIndex] = useState(0)
    const[startX, setStartX] = useState(null)

    //When we have gone through everyone
    if (index >= people.length) {
        return (
            <div className="max-w-s mx-auto text-center p-8 bg-white rounded-2x1 shadow-md">
                <p className ="text-lg mb-4">You have seen everyone!</p>
                <button
                    onClick={onDone}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                    >
                        See my shortlist
                    </button>
            </div>
        )
    }


    const person = people[index]

    const skip =() => setIndex(index + 1)

    const like = () => {
        onLike(person)
        setIndex(index + 1)
    }

    //Swiping on the phone specifically
    const handleTouchStart = (e) => setStartX(e.touches[0].clientX)

    const handleTouchEnd = (e) => {
        if (startX === null) return
        const distance = e.changedTouches[0].clientX - startX
        if (distance > 80) like()
            else if (distance < -80) skip()
                setStartX(null)
        }
        

        return (
            <div className = "max-w-xs mx-auto">
                <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} >
                    <SkillCard person = {person} onClick={() => onOpen (person)} />
                    
                    </div>

                    <div className = "flex justify-between mt-4">
                        <button
                        onClick={skip}
                        className = "bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                        >
                            X Skip
                        </button>

                        <button 
                        onClick={like}
                        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                        >
                            Like
                        </button>
                        </div>           
                    
                    <p className= "text-center text-sm text-gray-500 mt-2">
                        {index + 1} of {people.length}

                    </p>
                     </div>
        )
    }

    export default SwipeDeck