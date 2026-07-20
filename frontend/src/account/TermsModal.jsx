// // components/TermsModal.js
// import React from "react";
// import "./termsModal.css";
// function TermsModal({ isOpen, toggleModal, content }) {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-container">
//       <div className="modal-content">
//         {content}
//         <button onClick={toggleModal}>Close</button>
//       </div>
//     </div>
//   );
// }

// export default TermsModal;
import React from "react";
import "./termsModal.css";

function TermsModal({ isOpen, toggleModal, content }) {
  if (!isOpen) return null;

  function closeModal(e) {
    toggleModal();
    e.stopPropagation();
  }

  function stopPropagation(e) {
    e.stopPropagation();
  }

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={stopPropagation}>
        {content}
        <button onClick={toggleModal}>Close</button>
      </div>
    </div>
  );
}

export default TermsModal;
