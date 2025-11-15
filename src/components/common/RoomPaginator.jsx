import PropTypes from "prop-types";

const RoomPaginator = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              onClick={() => onPageChange(pageNumber)}
              className="page-link"
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RoomPaginator;

RoomPaginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
