// 데이터베이스 연결하기
import mysql from 'mysql'
export const db = mysql.createPool({
    host:'RDS 데이터베이스 DB 식별자 엔드포인트',        
    user:'RDS 데이터베이스 사용자명',               
    password:'RDS 데이터베이스 비밀번호',           
    database:'RDS 데이터베이스 데이터베이스명',       
    connectionLimit: 10, // 필요에 따라 조정하세요
});
// 연결 테스트
db.getConnection((err, connection) => {
    if (err) {
        console.error('데이터베이스 연결에 실패했습니다:', err);
    } else {
        console.log('데이터베이스 연결에 성공했습니다');
        connection.release(); // 연결을 반환합니다.
    }
});

// export const db = mysql.createConnection({
//     connectionLimit: 10, // 필요에 따라 조정하세요
//     host:'localhost',        
//     user:'root',               
//     password:'1234',           
//     database:'starship',       
// })
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection error:', err);
//         return;
//     }
//     console.log('Connected to the database.');
// });


