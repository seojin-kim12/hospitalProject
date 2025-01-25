import "../../styles/Modal.css";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null; // 모달이 열리지 않으면 아무 것도 렌더링하지 않음

  return (
    <div className="modal-overlay">
      {children} 
    </div>
  );
};

export default Modal;