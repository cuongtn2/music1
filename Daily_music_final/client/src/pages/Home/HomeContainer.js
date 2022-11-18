import PlayCard from "../../components/Card/PlayCard";


function HomeContainer({data}) {
    return ( 
        <div className="mb-4 min-w-full">
            <div className="grid grid-cols-5 gap-x-6">
                {data && data.map((song, i) => (
                    <PlayCard key={song._id} data={song} index={i}/>
                ))}
            </div>
        </div>
     );
}

export default HomeContainer;
