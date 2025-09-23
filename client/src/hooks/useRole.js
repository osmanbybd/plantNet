
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
const useRole = () => {
    const [role , setRole]= useState(null)
    const [isRoleLoading, setIsRoleLoading] = useState(true)
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth()
  useEffect(() => {
    const fetchUserRole= async() =>{
        const {data} =await axiosSecure(`${import.meta.env.VITE_API_URL}/user/role/${user?.email}`)
        setRole(data?.role)
        setIsRoleLoading(false)
    }
    fetchUserRole()
  }, [user, axiosSecure]);
  console.log(role)
  return [role, isRoleLoading];

};

export default useRole;
