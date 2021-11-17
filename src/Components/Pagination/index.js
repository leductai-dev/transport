import ReactPaginate from 'react-paginate'
import { useCallback } from 'react'
import './styles.css'

export const Pagination = ({ pagination, handlePageChange }) => {
    const { totalCount, page, limit } = pagination
    const totalPages = Math.ceil(totalCount / limit)
    const onPageChange = useCallback(
        ({ selected }) => {
            handlePageChange(selected + 1)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pagination]
    )   

    return (
        <>
            {totalPages > 0 && (
                <ReactPaginate
                    disableInitialCallback={true} // Disable onPageChange callback with initial page.
                    forcePage={page - 1} // Override selected page every time prop changes
                    initialPage={page - 1}
                    pageCount={totalPages}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    onPageChange={onPageChange}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageLinkClassName="page-link"
                    breakLinkClassName="page-link"
                    nextLinkClassName="page-link prev-next-link"
                    previousLinkClassName="page-link prev-next-link"
                    pageClassName="page-item"
                    breakClassName="page-item"
                    nextClassName="page-item"
                    previousClassName="page-item"
                    previousLabel={<>&laquo;</>}
                    nextLabel={<>&raquo;</>}
                />
            )}
        </>
    )
}
