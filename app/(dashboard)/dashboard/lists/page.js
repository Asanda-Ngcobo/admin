import SummariesWrapper from "@/app/_comps/SummariesWrapper";
import { getLists } from "@/app/lib/data/data-services"

async function page() {

     const lists = await getLists();
    return (
        <div className="mt-10  w-full">
            <SummariesWrapper
           
         lists={lists}
         />
            
        </div>
    )
}

export default page
