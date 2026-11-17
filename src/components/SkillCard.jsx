function SkillCard ({ person, onClick }) {
    return (
        <div
        onClick={onClick}
        className="bg-white rounded-2x1 shadow-md overflow-hidden cursor-pointer hover:shadow-x1 hover:-translate-y-1 transition"
        >

            <img
            src={person.photo}
            alt={person.name}
            className="w-full h-56 object-cover"
            />

            <div className= "p-4 space-y-1">
                <h2 className="text-x1 font-bold"> {person.name} </h2>
                <p>Teaches: {person.skillOffered}</p>
                <p>Takes: {person.timeToLearn}</p>
                <p>Wants: {person.skillWanted}</p>

            </div>
        </div>
    )
}

export default SkillCard