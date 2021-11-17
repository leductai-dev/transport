import { useState } from 'react'

const usePagination = (defaultLimit = 1) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: defaultLimit,
    totalCount: 0,
  
  })

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page,
    })
  }
  

  return {
    pagination,
    setPagination,
    handlePageChange,
}
}

export default usePagination
