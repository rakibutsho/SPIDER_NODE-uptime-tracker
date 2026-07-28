const Pagination = ({
  currentPage,
  totalItem,
  limit,
  onPageChange,
}: {
  currentPage: number;
  totalItem: number;
  limit: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPage = Math.ceil(totalItem / limit);
  const pageNumbers = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center items-center mt-8 mb-4 gap-6 text-white">
      <button
        className="bg-[#A141FE] text-white px-2 py-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {pageNumbers?.map((num) => (
        <button
          key={num}
          className={`px-2 py-1 border border-[#A141FE] ${
            currentPage === num ? "bg-[#A141FE] text-white" : ""
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="bg-[#A141FE] px-2 py-1 text-white"
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
