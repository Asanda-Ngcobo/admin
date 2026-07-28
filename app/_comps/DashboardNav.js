import DashNavLinks from "./DashboardNavLinks";






export default async function DashboardNavigation({data}) {

   
  return (
    <div className="fixed bottom-0 bg-(--accent-primary) w-full hidden
     h-27.5
     lg:flex
         lg:bg-white  lg:w-[15%] lg:left-0 lg:h-screen lg:bottom-auto
            lg:flex-col lg:justify-start">
 <DashNavLinks 
 data={data}/>

    </div>
   
  )
 
}