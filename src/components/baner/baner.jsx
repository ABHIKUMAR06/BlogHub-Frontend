import { CiCircleCheck } from "react-icons/ci"
import { MdOutlineCancel } from "react-icons/md"

const Banner = ({type,message}) =>{
    return(
        <div
                            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl z-60 border shadow-lg w-[90%] sm:w-auto transition-all ${
                              type === "success"
                                ? "bg-green-100 text-green-800 border-green-400"
                                : "bg-red-100 text-red-800 border-red-400"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                              {type === "success" ? <CiCircleCheck /> : <MdOutlineCancel />}
                              <span>{message}</span>
                            </div>
                          </div>
    )
}
export default Banner