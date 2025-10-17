import AdminStatistics from '../../../components/Dashboard/Statistics/AdminStatistics'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import useRole from '../../../hooks/useRole'
import CustomerStatics from '../Customer/CustomerStatics'
import SellerStatics from '../Seller/SellerStatics'
const Statistics = () => {

  const [role, isRoleLoading] = useRole()

if(isRoleLoading) return <LoadingSpinner></LoadingSpinner>
  return (
    <div>
      
      {role === 'admin' &&  <AdminStatistics />}
      {role === 'seller' &&  <SellerStatics></SellerStatics>}
      {role === 'customer' &&  <CustomerStatics />}

    </div>
  )
}

export default Statistics
