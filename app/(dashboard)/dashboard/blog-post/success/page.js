import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link"

function page() {
    return (
        <div className="w-full h-full flex flex-col
         justify-center items-center">
          
            <div className=" h-[30vh] w-[50%] my-auto mx-auto flex flex-col gap-2 justify-center
        items-center">

                 <h1>Blog Post Sucessfully added!!</h1>
                   <button className="h-fit w-fit p-3 rounded-full flex justify-center
            items-center
            text-white
            bg-(--accent-primary)">
                <Link href='/dashboard/blog-post'>
                Go Back To AddBlog Form
                </Link>

            </button>
            </div>

            
            
        </div>
    )
}

export default page
