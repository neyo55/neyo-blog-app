import React from 'react';

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-900 dark:text-gray-100">{page} of {totalPages}</span>
      <button
        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;








// import React from 'react';

// const Pagination = ({ page, setPage, totalPages }) => (
//   <div className="flex justify-center space-x-2 mt-4">
//     <button
//       disabled={page === 1}
//       onClick={() => setPage(page - 1)}
//       className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
//     >
//       Previous
//     </button>
//     <span className="px-4 py-2">{page} of {totalPages}</span>
//     <button
//       disabled={page === totalPages}
//       onClick={() => setPage(page + 1)}
//       className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
//     >
//       Next
//     </button>
//   </div>
// );

// export default Pagination;