import './Kanji.css'

export default function Kanji(){


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
        <tr  className="vocab-row">
              <td className="cell-kanji">先生</td>
              <td className="cell-hiragana">せんせい</td>
              <td className="cell-meaning">giáo viên</td>

                {/* Thay thế chữ NGHE thô sơ bằng một nút bấm có icon vòng tròn mượt mà */}
              
            
            </tr>
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