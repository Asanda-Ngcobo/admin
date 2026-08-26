
import SurveysWrapper from "@/app/_comps/SurveysWrapper";
import { getSurveys } from "@/app/lib/data/data-services";


async function page() {

     const surveys = await getSurveys();

     console.log(surveys.length)
    return (
        <div className="mt-10  w-full">
            <SurveysWrapper
           
         surveys={surveys}
         />
            
        </div>
    )
}

export default page
