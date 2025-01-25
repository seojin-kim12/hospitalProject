import Modal from './Modal';

const HospitalModal = ({ isOpen, hospital, onClose }) => {
  if (!isOpen || !hospital) return null;

  // 전화번호 기본값 처리
  const tel = hospital.phone || "전화번호 없음";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ marginTop: "40rem" }}>
        {/* 전화 링크 */}
        <a 
          href={hospital.phone ? `tel:${hospital.phone}` : "#"}
          style={{
            display: 'block',
            textDecoration: 'none',
            pointerEvents: hospital.phone ? "auto" : "none", // 전화번호 없을 경우 클릭 불가능
          }}
        >
          <div 
            style={{ 
              width: '20rem', 
              height: '4rem', 
              background: '#474747', 
              borderRadius: '10px', 
              color: hospital.phone ? '#6985FF' : '#999999', // 전화번호 없을 경우 색상 변경
              fontSize: '23px', 
              display: 'flex',             
              justifyContent: 'center',    
              alignItems: 'center',        
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            {tel}
          </div>
        </a>

        {/* 취소 버튼 */}
        <div 
          style={{ 
            width: '20rem', 
            height: '4rem', 
            background: '#474747', 
            borderRadius: '10px', 
            color: '#FF5B59', 
            fontSize: '23px', 
            fontWeight: 'bold',
            display: 'flex',             
            justifyContent: 'center',    
            alignItems: 'center',        
            textAlign: 'center'          
          }} 
          onClick={onClose}
        >
          취소
        </div>
      </div>
    </Modal>
  );
};

export default HospitalModal;
