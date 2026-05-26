import './Kanji.css'

type KanjiProp={
    id: string,
    kanji: string,
    sonet:string,
    mean: string,
    trangthai: number,
}

// Định nghĩa kiểu dữ liệu cho props nhận vào
type VocabComponentProps = {
  listData: KanjiProp[];
  onToggleStatus: (itemId: string, newStatus: number) => void;
  savingItemId: string | null;
}

export default function Kanji({listData, onToggleStatus, savingItemId}:VocabComponentProps){


    return(
        <>
        <div className='Contain_table'>
        <table className="table">
        <thead>
          <tr>
            {/* Các class định hình độ rộng chỉ đặt DUY NHẤT tại đây ở hàng th đầu tiên */}
            <th className="col-kanji">KANJI</th>
            <th className="col-hiragana">Nghĩa </th>
            <th className="col-meaning">Số nét</th>
            <th className="col-status">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="BodyTable">
          {/* Kiểm tra nếu mảng trống thì báo chưa có dữ liệu */}
          {listData.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#0f2047' }}>
                Bài học này hiện tại chưa có từ vựng.
              </td>
            </tr>
            
          ) : (
            /* MAP CÁC TỪ VỰNG TỪ BACKEND VÀO ĐÂY */
            listData.map((item) => {
              const nextStatus = item.trangthai === 1 ? 0 : 1;
              const buttonText = item.trangthai === 1 ? 'Đánh dấu Chưa thuộc' : 'Đánh dấu Đã thuộc';
              return (
                <tr key={item.id} className="vocab-row">
                  <td className="cell-kanji">{item.kanji }</td>
                  <td className="cell-hiragana">{item.mean}</td>
                  <td className="cell-meaning">{item.sonet}</td>
                  <td className="cell-status">
                    <div className="status-label">{item.trangthai === 1 ? 'Đã thuộc' : 'Chưa thuộc'}</div>
                    <button
                      type="button"
                      className="status-button"
                      onClick={() => onToggleStatus(item.id, nextStatus)}
                      disabled={savingItemId === item.id}
                    >
                      {savingItemId === item.id ? 'Đang lưu...' : buttonText}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
   
        </div>
       
     
        </>
    )
}