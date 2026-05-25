import './Vocab.css'
type VocabProp={
    id: string,
    vocab: string,
    cachdoc:string
    mean: string,
}
// Định nghĩa kiểu dữ liệu cho props nhận vào
type VocabComponentProps = {
  listData: VocabProp[];
}
export default function Vocab({listData}:VocabComponentProps){
    return(
        <>
        <div className='Contain_table'>
        <table className="table">
        <thead>
          <tr>
            {/* Các class định hình độ rộng chỉ đặt DUY NHẤT tại đây ở hàng th đầu tiên */}
            <th className="col-kanji">KANJI</th>
            <th className="col-hiragana">HIRAGANA</th>
            <th className="col-meaning">NGHĨA TIẾNG VIỆT</th>
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
            listData.map((item) => (
              <tr key={item.id} className="vocab-row">
                <td className="cell-kanji">{item.vocab }</td>
                <td className="cell-hiragana">{item.cachdoc}</td>
                <td className="cell-meaning">{item.mean}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    {/* <table className="table">
      <thead>
        <tr className="border-b border-outline-variant ">
          <th className=" text-on-surface-variant col-kanji ">KANJI</th>
          <th className="text-on-surface-variant col-hiragana ">HIRAGANA</th>
          <th className="text-on-surface-variant col-meaning ">NGHĨA TIẾNG VIỆT</th>
          <th className="text-on-surface-variant ol-audio ">NGHE</th>
        </tr>
      </thead>
      <tbody className='BodyTable'>
       <tr className="border-outline-variant ">
          <td className=" text-on-surface-variant col-kanji ">先生</td>
          <td className="text-on-surface-variant col-hiragana ">せんせい</td>
          <td className="text-on-surface-variant col-meaning ">Giáo viên</td>
          <td className="text-on-surface-variant ol-audio ">NGHE</td>
        </tr>
        <tr className="border-outline-variant ">
          <td className=" text-on-surface-variant col-kanji ">先生</td>
          <td className="text-on-surface-variant col-hiragana ">せんせい</td>
          <td className="text-on-surface-variant col-meaning ">Giáo viên</td>
          <td className="text-on-surface-variant ol-audio ">NGHE</td>
        </tr>
      </tbody>
      </table> */}
        </div>
       
     
        </>
    )
}