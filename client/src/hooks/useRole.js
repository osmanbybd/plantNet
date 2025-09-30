
// import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const useRole = () => {
    // const [role , setRole]= useState(null)
    // const [isRoleLoading, setIsRoleLoading] = useState(true)
  const axiosSecure = useAxiosSecure();
  const {user, loading} = useAuth()

  const {data:role , isLoading: isRoleLoading} = useQuery({
    queryKey:['role', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async() =>{
       const {data} =await axiosSecure(`/user/role/${user?.email}`)
       return data
    }
  })

console.log(role)

  // useEffect(() => {
  //   const fetchUserRole= async() =>{
  //     if(!user) return setIsRoleLoading(false)
  //      try{
  //        const {data} =await axiosSecure(`${import.meta.env.VITE_API_URL}/user/role/${user?.email}`)
  //       setRole(data?.role)
       
  //      }catch(err){
  //       console.log(err)
  //      }finally{
  //         setIsRoleLoading(false)
  //      }
  //   }
  //   fetchUserRole()
  // }, [user, axiosSecure]);
  console.log(role)
  return [role?.role, isRoleLoading];

};

export default useRole;
